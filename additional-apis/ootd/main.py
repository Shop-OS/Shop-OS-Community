import functools
import glob
from flask import Flask, request, jsonify
import os
import boto3
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from PIL import Image
import pillow_avif
from pillow_heif import register_heif_opener

load_dotenv()

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
)

app = Flask(__name__)
register_heif_opener()

def require_api_key(view_function):
    @functools.wraps(view_function)
    def decorated_function(*args, **kwargs):
        if request.headers.get('x-api-key') and request.headers.get('x-api-key') == os.getenv('API_KEY'):
            return view_function(*args, **kwargs)
        else:
            return jsonify({"message": "Invalid API key"}), 403

    return decorated_function
  
  
@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400

    file = request.files['image']
    if file.filename.strip() == '':
        return jsonify({"error": "No image selected for uploading"}), 400

    if file:
        try:
            filename = secure_filename(file.filename)
            print(filename)
            save_path = os.path.join('/home/ubuntu/workspace', 'ComfyUI', 'input', filename)
            image = Image.open(file)
            
            file_ext = os.path.splitext(filename)[1]
            if not file_ext:
              file_ext = '.jpg'
            if file_ext.lower() == '.png':
                image.save(save_path, format='PNG')
            else:
                rgb_im = image.convert('RGB')
                new_filename = os.path.splitext(filename)[0] + '.jpg'
                save_path = os.path.join('../ComfyUI/input', new_filename)
                rgb_im.save(save_path, format='JPEG')
                
            s3_client.upload_file(save_path, os.getenv('AWS_S3_BUCKET_NAME'), filename, ExtraArgs={'Metadata': {}, 'ContentDisposition': 'attachment'})
            downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{filename}"   
            return jsonify({"success": True, "downloadURL": downloadURL }), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "The image provided is invalid. Please try again"}), 400
    else:
        return jsonify({"error": "Allowed image types are - png, jpg, jpeg, webp"}), 400


@app.route('/api/file', methods=['POST'])
@require_api_key
def get_file_and_upload_to_s3():
  dir = os.path.join('/home/ubuntu/workspace', 'ComfyUI', 'output')
  filename = request.args.get('filename')
  
  if filename:
      file_paths = glob.glob(os.path.join(dir, '*' + filename + '*'))
      print(file_paths)
      if file_paths:
          s3_file_name = os.path.basename(file_paths[0])
          if os.path.getsize(file_paths[0]) == 0:
              print(os.path.getsize(file_paths[0]))
              return jsonify({"message": "File is empty"}), 204
          s3_client.upload_file(file_paths[0], os.getenv('AWS_S3_BUCKET_NAME'), s3_file_name, ExtraArgs={'Metadata': {}, 'ContentDisposition': 'attachment'})
          downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{s3_file_name}"
          return {"downloadURL": downloadURL}, 200
      else:
          return "File not found.", 204
  else:
      return "File not found.", 204

if __name__ == '__main__':
  app.run(debug=True)
  