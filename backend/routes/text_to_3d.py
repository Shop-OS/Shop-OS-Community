from datetime import datetime
import time
from flask import Blueprint, request, jsonify
from dto.text_to_3d_request import Tripo3DRequest, MeshyRequest
import requests
import os
import boto3
import base64
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from PIL import Image
from routes.auth import authenticate, checkForCredits
from routes.comfy import deductCredits
from service.s3 import put_object_to_s3
from mongo import db

load_dotenv()
text_to_3d = Blueprint('text_to_3d', __name__)
mongo_generations = db['generations']

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
)

# @text_to_3d.route('/api/text-to-3d/tripo3d', methods=['POST'])
# def tripo3d_generate_from_text_task():
#     authenticate(request.headers.get('Authorization'))
#     request_data = Tripo3DRequest.model_validate(request.json)
    
#     headers = {
#         'Authorization': f"Bearer {os.getenv('TRIPO_3D_API_KEY')}"
#     }
#     tripo_request_body = {
#         "type": "text_to_model",
#         "prompt": request_data.prompt,
#     }
    
#     try:
#         response = requests.post("https://api.tripo3d.ai/v2/openapi/task", headers=headers, json=tripo_request_body)
#         response_data = response.json()
#         return jsonify({"success": True, "task_id": response_data['data']['task_id']})
#     except requests.RequestException as e:
#         return jsonify({"success":False, "error": str(e)}), 400

# @text_to_3d.route('/api/text-to-3d/meshy', methods=['POST'])
# def meshy_generate_from_text_task():
#     authenticate(request.headers.get('Authorization'))
#     request_data = MeshyRequest.model_validate(request.json)
    
#     headers = {
#         'Authorization': f"Bearer {os.getenv('MESHY_API_KEY')}"
#     }
#     meshy_request_body = {
#         "mode": "preview",
#         "prompt": request_data.prompt,
#         "art_style": "realistic",
#         "negative_prompt": "low quality, low resolution, low poly, ugly"
#     }
    
#     try:
#         response = requests.post("https://api.meshy.ai/v2/text-to-3d", headers=headers, json=meshy_request_body)
#         response_data = response.json()
#         print(response_data)
#         return jsonify({"success": True, "task_id": response_data['result']})
#     except requests.RequestException as e:
#         return jsonify({"success":False, "error": str(e)}), 400

@text_to_3d.route('/api/image-to-3d/tripo3d', methods=['POST'])
def tripo3d_generate_from_image_task():
    user_data = authenticate(request.headers.get('Authorization'))
    checkForCredits(user_data['email'], 1)

    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400

    file = request.files['image']
    image_data = None
    
    if file:
        image_data = base64.b64encode(file.read()).decode('utf-8')
    else:
        return jsonify({"error": "No image part in the request"}), 400
    
    generationId = request.form.get('generationId')
    if not generationId:
        return jsonify({"error": "generationId is required"}), 400
    inputImageURL = request.form.get('inputImageURL')
    if not inputImageURL:
        return jsonify({"error": "inputImageURL is required"}), 400
    
    filename = secure_filename(file.filename)
    file_extension = os.path.splitext(filename)[1]
    if not file_extension:
        return jsonify({"error": "Invalid file extension"}), 400
    
    headers = {
        'Authorization': f"Bearer {os.getenv('TRIPO_3D_API_KEY')}"
    }
    tripo_request_body = {
        "type": "image_to_model",
        "file": {
            "type": file_extension,
            "data": image_data
        }
    }
    
    try:
        response = requests.post("https://api.tripo3d.ai/v2/openapi/task", headers=headers, json=tripo_request_body)
        response_data = response.json()
        print(response_data)
     
        mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": generationId,
                "input_image_url": inputImageURL,
                "type": "image_to_3d",
                "download_url": None,
                "filename": response_data['data']['task_id'],
                "timestamp": None,
                "prompt_id": response.json().get('prompt_id'),
                "category": "generation",
                "origin": "tripo3d",
                "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
            })
     
        deductCredits(user_data['email'], 1)
        return jsonify({"success": True, "task_id": response_data['data']['task_id']})
    except requests.RequestException as e:
        return jsonify({"success":False, "error": str(e)}), 400

@text_to_3d.route('/api/image-to-3d/meshy', methods=['POST'])
def meshy_generate_from_image_task():
    user_data = authenticate(request.headers.get('Authorization'))
    checkForCredits(user_data['email'], 1)

    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400

    file = request.files['image']
    if file.filename.strip() == '':
        return jsonify({"error": "No image selected for uploading"}), 400

    downloadURL = None    
        
    generationId = request.form.get('generationId')
    if not generationId:
        return jsonify({"error": "generationId is required"}), 400
    
    inputImageURL = request.form.get('inputImageURL')
    if not inputImageURL:
        return jsonify({"error": "inputImageURL is required"}), 400
    
    if file:
        filename = secure_filename(file.filename)
        save_path = os.path.join('/home/azureuser/workspace', 'ComfyUI', 'input', filename)
        image = Image.open(file)

        file_ext = os.path.splitext(filename)[1]

        if not file_ext:
            return jsonify({"error": "Invalid file extension"}), 400
    
        if file_ext.lower() == '.png':
            image.save(save_path, format='PNG')
        else:
            rgb_im = image.convert('RGB')
            new_filename = os.path.splitext(filename)[0] + '.jpg'
            save_path = os.path.join('../ComfyUI/input', new_filename)
            rgb_im.save(save_path, format='JPEG')

        s3_client.upload_file(save_path, os.getenv('AWS_S3_BUCKET_NAME'), filename, ExtraArgs={'Metadata': {}, 'ContentDisposition': 'attachment'})
        downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{filename}"   
    else:
        return jsonify({"error": "No image part in the request"}), 400
    
    file_extension = os.path.splitext(filename)[1]
    if not file_extension:
        return jsonify({"error": "Invalid file extension"}), 400
    
    headers = {
        'Authorization': f"Bearer {os.getenv('MESHY_API_KEY')}"
    }
    tripo_request_body = {
        "image_url": downloadURL,
    }
    
    try:
        response = requests.post("https://api.meshy.ai/v1/image-to-3d", headers=headers, json=tripo_request_body)
        response_data = response.json()
        print(response_data)
        
        mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": generationId,
                "input_image_url": inputImageURL,
                "type": "image_to_3d",
                "download_url": None,
                "filename": response_data['result'],
                "timestamp": None,
                "origin": "meshy",
                "category": "generation",
                "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
            })
        
        deductCredits(user_data['email'], 1)
        return jsonify({"success": True, "task_id": response_data['result']})
    except requests.RequestException as e:
        return jsonify({"success":False, "error": str(e)}), 400

@text_to_3d.route('/api/image-to-3d/tripo3d/<task_id>', methods=['GET'])
def tripo3d_get_task(task_id):
    user_data = authenticate(request.headers.get('Authorization'))
    generation_id = request.args.get('generationId')
    
    if not generation_id:
        return jsonify({"error": "generationId is required"}), 400
    
    try:
        headers = {
            'Authorization': f"Bearer {os.getenv('TRIPO_3D_API_KEY')}"
        }
        response = requests.get(f"https://api.tripo3d.ai/v2/openapi/task/{task_id}", headers=headers)
        response_data = response.json()
        
        if (response_data['data']['status'] == "running"):
            return jsonify({"success": True, "status": response_data['data']['status'], "progress": response_data['data']['progress']})
        elif (response_data['data']['status'] == "success"):
            glb_url = response_data['data']['result']['model']['url']
            glb_content = requests.get(glb_url).content
                
            download_url = put_object_to_s3(f"{task_id}.glb", glb_content)
            mongo_generations.update_one({
                    "user_id": user_data['sub'], 
                    "generation_id": generation_id,
                    "filename": task_id
                    }, {
                    "$set": {
                        "download_url": download_url,
                        "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
                    }})
            return jsonify({"success": True, "status": response_data['data']['status'], "progress": response_data['data']['progress'], "result": download_url})
        else:       
            return jsonify({"success": False, "status": response_data['data']['status']})
    except requests.RequestException as e:
        return jsonify({"success":False, "error": str(e)}), 400

# @text_to_3d.route('/api/text-to-3d/meshy/<task_id>', methods=['GET'])
# def meshy_get_task_text(task_id):
#     authenticate(request.headers.get('Authorization'))
#     try:
#         headers = {
#             'Authorization': f"Bearer {os.getenv('MESHY_API_KEY')}"
#         }
#         response = requests.get(f"https://api.meshy.ai/v2/text-to-3d/{task_id}", headers=headers)
#         response_data = response.json()
#         if (response_data['status'] == "IN_PROGRESS"):
#             return jsonify({"success": True, "status": response_data['status'], "progress": response_data['progress']})
#         elif (response_data['status'] == "SUCCEEDED"):
#             return jsonify({"success": True, "status": response_data['status'], "progress": response_data['progress'], "result": response_data['model_urls']['glb']})
#         else:       
#             return jsonify({"success": False, "status": response_data['status']})
#     except requests.RequestException as e:
#         return jsonify({"success":False, "error": str(e)}), 400

@text_to_3d.route('/api/image-to-3d/meshy/<task_id>', methods=['GET'])
def meshy_get_task_image(task_id):
    user_data = authenticate(request.headers.get('Authorization'))
    generation_id = request.args.get('generationId')
    
    if not generation_id:
        return jsonify({"error": "generationId is required"}), 400

    try:
        headers = {
            'Authorization': f"Bearer {os.getenv('MESHY_API_KEY')}"
        }
        response = requests.get(f"https://api.meshy.ai/v1/image-to-3d/{task_id}", headers=headers)
        response_data = response.json()
        if (response_data['status'] == "IN_PROGRESS"):
            return jsonify({"success": True, "status": response_data['status'], "progress": response_data['progress']})
        elif (response_data['status'] == "SUCCEEDED"):
            glb_url = response_data['model_urls']['glb']
            glb_content = requests.get(glb_url).content
            
            download_url = put_object_to_s3(f"{task_id}.glb", glb_content)
            mongo_generations.update_one({
                "user_id": user_data['sub'], 
                "generation_id": generation_id,
                "filename": task_id
                }, {
                "$set": {
                    "download_url": download_url,
                    "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
                }})
            
            return jsonify({"success": True, "status": response_data['status'], "progress": response_data['progress'], "result": download_url})
        else:       
            return jsonify({"success": False, "status": response_data['status']})
    except requests.RequestException as e:
        return jsonify({"success":False, "error": str(e)}), 400
    