from datetime import datetime
import time
from fastapi import FastAPI, File, HTTPException, UploadFile, Form, Body, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from PIL import Image
from fastapi.responses import JSONResponse
from sqs import delete_message_from_sqs, get_queue_length, pull_from_sqs, push_to_sqs
from translate import translate
from model import get_description, rewrite_description
import io
import json 
from llava.conversation import Conversation
from pydantic import BaseModel
from werkzeug.utils import secure_filename
import os
import boto3
from dotenv import load_dotenv
from mongo import db
from threading import Thread
import schedule
from store import description_lock
import logging
import boto3

load_dotenv()
logging.basicConfig(filename='server.log', level=logging.INFO)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
)
translate_client = boto3.client(
    'translate',
    aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
)
descriptionGen = db['product_description_generations']

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Conversation):
            return vars(obj)
        return super().default(obj)

class RequestBody(BaseModel):
    conv: Optional[str] = None

@app.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    if not image:
        return {"error": "No image part in the request"}
    file = image
    
    if file:
        if file.filename == '':
            return {"error": "No image selected for uploading"}
        file_ext = os.path.splitext(file.filename)[1]
        if file_ext not in ['.jpg', '.jpeg', '.png', '.webp']:
            raise HTTPException(status_code=400, detail="Invalid file type. Only .jpg, .jpeg, .webp and .png are allowed.")
        try:
            filename = secure_filename(file.filename)
            s3_client.upload_fileobj(file.file, os.getenv("AWS_S3_BUCKET_NAME"), filename, ExtraArgs={'ContentDisposition': 'attachment'})
            downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{filename}"

            return {"downloadURL": downloadURL}
        except Exception as e:
            return {"error": str(e)}
        
@app.post("/generate_description")
async def get_desc_enqueue(image_url: str, conv : Optional[RequestBody] = Body(None), prompt: str = None, generationId: str = None):
    if not generationId or not image_url:
        raise HTTPException(status_code=400, detail="Please provide generationId and image_url.")    
    desc = descriptionGen.find_one({"generationId": generationId})
    if desc:
        return {
            "description": desc['description'],
            "conv": json.loads(desc['conv']),
            "timestamp": desc['timestamp'],
            "image_url": desc['image_url'],
            "prompt": desc['prompt'],
            "generationId": desc['generationId']
        }    
    
    if conv:
        conv = json.loads(conv.conv)
    
    print("conv", conv)
    
    # description, conv_hist = get_description(image_url=image_url, prompt=prompt, conv=conv)
    push_to_sqs(conv, prompt, image_url, generationId)
    
    return {generationId: generationId}
        
def get_desc_execute():
    global description_lock
    print("==================================================")
    print("description_lock", description_lock)
    if description_lock == True:
        print("Description generation is locked.")
        return
    
    print("Checking for messages in the queue.")
    
    message = pull_from_sqs()
    if not message:
        return {"error": "No message in the queue."}
    description_lock = True
    try: 
        body = json.loads(message['Body'])
        
        description, conv_hist = get_description(image_url=body['image_url'], prompt=body['prompt'], conv=body['conv'])
        description_lock = False
        
        print("description", description)
        descriptionGen.insert_one({
            "generationId": body['generationId'],
            "description": description,
            "conv": json.dumps(conv_hist),
            "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z",
            "image_url": body['image_url'],
            "prompt": body['prompt']
        })
        
        delete_message_from_sqs(message['ReceiptHandle'])
        return
    except Exception as e:
        delete_message_from_sqs(message['ReceiptHandle'])
        print("Error in get_desc_execute", e)
        description_lock = False

@app.get("/fetch_description")
async def get_desc_fetch(generationId: str):
    desc = descriptionGen.find_one({"generationId": generationId})
    if not desc:
        queue_length = get_queue_length()
        return JSONResponse(status_code=200, content={"queue_length": queue_length})   
    return {
        "description": desc['description'],
        "conv": json.loads(desc['conv']),
        "timestamp": desc['timestamp'],
        "image_url": desc['image_url'],
        "prompt": desc['prompt'],
        "generationId": desc['generationId']
    }

@app.post("/rewrite_desc")
async def rewrite_desc(additional: str, output: str,image: UploadFile = File(...)):
    # if len(descriptions) != 2:
    #     return {"error": "Please provide two descriptions."}
    # print("additional",additional)
    # print("output",output)
    # print("image",
    image_bytes = await image.read()
    image = Image.open(io.BytesIO(image_bytes))
    
    rewritten_desc = rewrite_description(images=[image], additional_prompt=additional, out=output)
    
    return {"rewritten_description": rewritten_desc}

@app.post("/translate_description")
async def translate_desc(description: str, lang: str):
    # translated_desc = translate(description, lang)
    result = translate_client.translate_text(Text=description, 
            SourceLanguageCode="en", TargetLanguageCode=lang)
    
    return {"translated_description": result.get('TranslatedText')}



def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(5)
schedule.every(2).seconds.do(get_desc_execute)
Thread(target=run_schedule).start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9999)
