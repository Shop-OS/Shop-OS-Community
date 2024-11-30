from flask import Blueprint, request, jsonify, send_file
import cv2
from segment_anything import sam_model_registry, SamPredictor
import numpy as np
import os
import io
import boto3

sam = Blueprint('sam', __name__)

@sam.route('/api/sam/embedding', methods=['POST'])
def createEmbedding():
    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_S3_REGION')
    )
    
    image = request.files.get('image')
    if not image:
        return jsonify({"error": "Image required"}), 400
    
    _, file_extension = os.path.splitext(image.filename)
    print(file_extension)
    if file_extension.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
        return jsonify({"error": "Invalid file type. Only jpg, png and webp are allowed"}), 400
  
    print(os.getcwd())
    checkpoint = "./checkpoint/sam_vit_h_4b8939.pth"
    model_type = "vit_h"

    sam = sam_model_registry[model_type](checkpoint=checkpoint)
    predictor = SamPredictor(sam)

    img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), -1)
    predictor.set_image(img)
    embedding = predictor.get_image_embedding().cpu().numpy()
    
    np.save('embedding.npy', embedding)

    s3_client.upload_file(os.getcwd() + "/embedding.npy", os.getenv('AWS_S3_BUCKET_NAME'), "embedding.npy", ExtraArgs={'ContentDisposition': 'attachment', 'ContentType': 'application/octet-stream'})
    downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/embedding.npy"   
    return {"downloadURL": downloadURL}, 200