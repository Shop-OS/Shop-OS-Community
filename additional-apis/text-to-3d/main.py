from gradio_client import Client
import os
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import boto3

load_dotenv()
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
)

client = Client(os.getenv('GRADIO_SERVER_URL'))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

photos = []

@app.get("/")
async def home(request: Request):
    return {"message": "hello world"}

@app.post("/getglb")
async def get_3d_file(seed: str):
    try:
        obj_file_path = seed
        x = seed.split("/")[-1]
        # headers = {'Content-Disposition': f'attachment; filename="{x}" '}
        print(obj_file_path)
        s3_client.upload_file(obj_file_path, os.getenv('AWS_S3_BUCKET_NAME'), x, ExtraArgs={'ContentDisposition': 'attachment'})
        downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{x}"

        return {
            "downloadURL": downloadURL
        }
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
