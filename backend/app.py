import json
import threading
import time
import zipfile
from flask import Flask, send_file, request, jsonify
import websocket
from werkzeug.utils import secure_filename
from flask_cors import CORS
from pillow_heif import register_heif_opener
import pillow_avif
import os
from PIL import Image
import glob
import requests
from v2.routes.app import app as app_v2
from routes.scrape import scrape
from routes.auth import auth
from routes.comfy import comfy
from routes.request_generation import req_gen
from routes.vton import vton
from routes.text_to_3d import text_to_3d
from dotenv import load_dotenv
from datetime import datetime
import boto3
from flask_socketio import SocketIO, emit
import jwt
import schedule
import logging
import threading
from state import generations
from mongo import client, db
from routes.auth import authenticate
import json
from threading import Thread
from worker.generation_worker import generation_scanner
from worker.email_worker import email_scanner

DEFAULT_EXTERNAL_API_URL = os.getenv('COMFY_URL')
SELF_URL = os.getenv('SELF_URL')
OOTD_SERVER_URL = os.getenv('OOTD_SERVER_URL')

load_dotenv()

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

mongo_generations = db['generations']
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
)
logging.basicConfig(filename='server.log', level=logging.INFO)

app = Flask(__name__)
CORS(app)

app.register_blueprint(app_v2)
app.register_blueprint(scrape)
app.register_blueprint(auth)
app.register_blueprint(vton)
app.register_blueprint(comfy)
app.register_blueprint(req_gen)
app.register_blueprint(text_to_3d)
register_heif_opener()

socketio = SocketIO(app, cors_allowed_origins="*")

clients = {}

def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(5)
schedule.every(5).seconds.do(generation_scanner)
schedule.every(15).seconds.do(email_scanner)
Thread(target=run_schedule).start()
# Thread(target=run_schedule, args=(email_scanner,)).start()

@app.route('/', methods=['GET'])
def hello():
    return "Hello, welcome to the server!"

@socketio.on('connect')
def connect():
    clients[request.sid] = time.time()
    generations[request.sid] = []  
    print('Client connected: ', request.sid)

@socketio.on('disconnect')
def disconnect():
    sid = request.sid
    print(f"Client {sid} has been disconnected")
    # url = f"{DEFAULT_EXTERNAL_API_URL}/queue"
    # response = requests.get(url)
    # queue_data = response.json()
    # running_executions = queue_data['queue_running']                
    # pending_executions = queue_data['queue_pending']      
    # execution_ids = generations.get(sid)
    # print(execution_ids)          
    # if execution_ids is None:
    #     return    
    
    # for id in execution_ids:
    #     executions = {'pending': pending_executions, 'running': running_executions}
    #     # thread = threading.Thread(target=delete_and_interrupt, args=(executions, id))
    #     # thread.start()
    
    # clients.pop(sid, None)
    print('Client disconnected: ', sid)

@socketio.on('heartbeat')
def handle_heartbeat(message):
    clients[request.sid] = time.time()
    emit('heartbeat_response', {'data': 'Heartbeat received'})          
            
def check_for_generations_ws():
    while True:
        ws = websocket.WebSocket()
        ws.connect("ws://4.227.147.49:8188/ws")
        for client in clients:
            if client not in generations or not generations[client]:
                continue
            print('Checking for generations...')
            print(generations)
            for generation in generations[client]:
                out = ws.recv()
                print(out)
                print(isinstance(out, str))
                if isinstance(out, str):
                    message = json.loads(out)
                    print(message)
                    if message['type'] == 'executing':
                        data = message['data']
                        if data['node'] is None and data['prompt_id'] == generation:
                            emit('generations', {'data': generation})
                            generations.pop(generation, None)
        socketio.sleep(5)

def delete_and_interrupt(executions, id):
    try:
        for execution in executions['pending']:
            if execution[1] == id:
                response = requests.post(f"{SELF_URL}/delete-queue-item", json={"delete": [id]})
                response.raise_for_status()
        for execution in executions['running']:
            if execution[1] == id:
                response = requests.post(f"{SELF_URL}/interrupt", json={"execution_id": execution[0]})
                response.raise_for_status()
    except requests.exceptions.HTTPError:
        print(f'Deleted/Interrupted: {id}')
    except Exception as err:
        print(f'Other error occurred: {err}')

def emit_queue_length():
    while True:
        try:
            if not clients:
                socketio.sleep(5)
                continue
            url = f"{DEFAULT_EXTERNAL_API_URL}/queue"
            response = requests.get(url)
            queue_data = response.json()
            running_executions = queue_data['queue_running']                
            pending_executions = queue_data['queue_pending']      
            queueSize = len(running_executions) + len(pending_executions)          
            socketio.emit('queue_length', {'count': queueSize})
            socketio.sleep(3)
        except Exception as e:
            print(f"Error in emit_queue_length: {e}")
            logging.error(f"Error in emit_queue_length: {e}")
            socketio.sleep(5)

socketio.start_background_task(emit_queue_length)

@app.route('/latest', methods=['GET'])
def get_latest_files():
  image_dir = '../ComfyUI/output/'
  text_dir = '../ComfyUI/output/'
  
  masked = request.args.get('masked', 'false').lower() == 'true'

  image_files = glob.glob(os.path.join(image_dir, '*.jpg'))
  image_files += glob.glob(os.path.join(image_dir, '*.png'))
  image_files += glob.glob(os.path.join(image_dir, '*.webp'))  

  if masked:
    image_files = [f for f in image_files if 'Masked' in os.path.basename(f)]
  else:
    image_files = [f for f in image_files if 'Final' in os.path.basename(f)]

  latest_image = max(image_files, key=os.path.getctime)

  text_files = glob.glob(os.path.join(text_dir, '*.txt'))
  latest_text = max(text_files, key=os.path.getctime)

  zip_filename = 'latest_files.zip'
  with zipfile.ZipFile(zip_filename, 'w') as zipf:
    zipf.write(latest_image, os.path.basename(latest_image))
    zipf.write(latest_text, os.path.basename(latest_text))

  return send_file(zip_filename, as_attachment=True)

@app.route('/file', methods=['GET'])
def get_file_by_fileName():
    dir = os.path.join('/home/azureuser/workspace', 'ComfyUI', 'output')
    specific_filename = request.args.get('filename')

    if specific_filename:
        file_paths = glob.glob(os.path.join(dir, '*' + specific_filename + '*'))
        if file_paths:
            return send_file(file_paths[0], as_attachment=True)
        else:
            return "File not found.", 204
    else:
        return "File not found.", 204

@app.route('/file-input', methods=['GET'])
def get_input_file_by_fileName():
    dir = os.path.join('/home/azureuser/workspace', 'ComfyUI', 'input')
    specific_filename = request.args.get('filename')

    if specific_filename:
        file_paths = glob.glob(os.path.join(dir, '*' + specific_filename + '*'))
        if file_paths:
            return send_file(file_paths[0], as_attachment=True)
        else:
            return "File not found.", 204
    else:
        return "File not found.", 204

@app.route('/file/v2', methods=['GET'])
def get_file_by_fileName_v2():
    if not request.headers.get('Authorization'):
        return jsonify({"error": "Unauthorized"}), 401
    user_data = authenticate(request.headers.get('Authorization'))
    dir = os.path.join('/home/azureuser/workspace', 'ComfyUI', 'output')
    generation_id = request.args.get('generationId')
    filename = request.args.get('filename')
    
    if not generation_id:
        return jsonify({"error": "Generation ID is required"}), 400
    
    generation = mongo_generations.find_one({
        "user_id": user_data['sub'], 
        "generation_id": generation_id,
        "filename": filename
    })
    if generation and generation.get('download_url'):
        return jsonify({"downloadURL": generation.get('download_url')}), 200
    
    if filename:
        file_paths = glob.glob(os.path.join(dir, '*' + filename + '*'))
        print(file_paths)
        if file_paths:
            s3_file_name = os.path.basename(file_paths[0])
            if os.path.getsize(file_paths[0]) == 0:
                print(os.path.getsize(file_paths[0]))
                return jsonify({"message": "File is empty"}), 204
            time.sleep(1)
            s3_client.upload_file(file_paths[0], os.getenv('AWS_S3_BUCKET_NAME'), s3_file_name, ExtraArgs={'Metadata': {}, 'ContentDisposition': 'attachment'})
            downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{s3_file_name}"   
            
            mongo_generations.update_one({
                "user_id": user_data['sub'], 
                "generation_id": generation_id,
                "filename": filename
                }, {
                "$set": {
                    "download_url": downloadURL,
                    "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
                }})
            
            return {"downloadURL": downloadURL}, 200
        else:
            return "File not found.", 204
    else:
        return "File not found.", 204

@app.route('/file/v3', methods=['POST'])
def get_file_by_fileName_v3():
    if not request.headers.get('Authorization'):
        return jsonify({"error": "Unauthorized"}), 401
    user_data = authenticate(request.headers.get('Authorization'))
    
    generation_id = request.args.get('generationId')
    filename = request.args.get('filename')
    
    if not generation_id:
        return jsonify({"error": "Generation ID is required"}), 400
    
    generation = mongo_generations.find_one({
        "user_id": user_data['sub'], 
        "generation_id": generation_id,
        "filename": filename
    })
    if generation and generation.get('download_url'):
        return jsonify({"downloadURL": generation.get('download_url')}), 200
    
    headers = {
        'x-api-key': os.getenv('OOTD_API_KEY')
    }
    ootd_response = requests.post(f"{OOTD_SERVER_URL}/api/file?filename={filename}", json={} , headers=headers)
    if ootd_response.status_code == 204:
        return "File not found.", 204
    elif ootd_response.status_code == 200:
    
        file_download_url = ootd_response.json().get('downloadURL')
        
        if filename:
            mongo_generations.update_one({
                "user_id": user_data['sub'], 
                "generation_id": generation_id,
                "filename": filename
                }, {
                "$set": {
                    "download_url": file_download_url,
                    "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
                }})
            
            return {"downloadURL": file_download_url}, 200  
        else:
            return "File not found.", 204
    else:
        return "File not found.", 204

@app.route('/api/product-description', methods=['GET'])
def get_description_by_fileName_v2():
    dir = os.path.join('/home/azureuser/workspace', 'ComfyUI', 'output')
    specific_filename = request.args.get('filename')

    if specific_filename:
        file_paths = glob.glob(os.path.join(dir, '*' + specific_filename + '*'))
        if file_paths:
            _, ext = os.path.splitext(file_paths[0])
            if ext.lower() != '.txt':
                return "Error: The file is not a .txt file.", 400

            with open(file_paths[0], 'r') as file:
                description = file.read()
        
            return {"description": description}, 200
        else:
            return "File not found.", 204
    else:
        return "File not found.", 204

@app.route('/latest-tags', methods=['GET'])
def get_latest_tags():
  text_dir = '../ComfyUI/output/'

  text_files = glob.glob(os.path.join(text_dir, '*.txt'))
  latest_text = max(text_files, key=os.path.getctime)

  zip_filename = 'latest_files.zip'
  with zipfile.ZipFile(zip_filename, 'w') as zipf:
    zipf.write(latest_text, os.path.basename(latest_text))

  return send_file(zip_filename, as_attachment=True)

@app.route('/latest-media', methods=['GET'])
def get_latest_media():
  type = request.args.get('type')
  media_dir = '../ComfyUI/output/'

  image_files = glob.glob(os.path.join(media_dir, '*.jpg'))
  image_files += glob.glob(os.path.join(media_dir, '*.png'))
  image_files += glob.glob(os.path.join(media_dir, '*.webp'))   
  latest_image = max(image_files, key=os.path.getctime)

    
  video_files = glob.glob(os.path.join(media_dir, '*.mp4'))
  latest_video = max(video_files, key=os.path.getctime)

  zip_filename = 'latest_files.zip'
  with zipfile.ZipFile(zip_filename, 'w') as zipf:
    if type == "video" and latest_video:
        zipf.write(latest_video, os.path.basename(latest_video))
    else:
        zipf.write(latest_image, os.path.basename(latest_image))

  return send_file(zip_filename, as_attachment=True) if (latest_video or latest_image) else "No media files found"

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
            save_path = os.path.join('/home/azureuser/workspace', 'ComfyUI', 'input', filename)
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

@app.route('/upload-image/v2', methods=['POST'])
def upload_image_v2():
    
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400

    file = request.files['image']
    if file.filename.strip() == '':
        return jsonify({"error": "No image selected for uploading"}), 400

    if file:
        try:
            url = f"{OOTD_SERVER_URL}/upload-image"
            files = {'image': (file.filename, file.stream, file.content_type)}
            response = requests.post(url, files=files)
            
            if response.status_code != 200:
                return jsonify({"error": "The image provided is invalid. Please try again"}), 400
            
            response_data = response.json()
            
            return jsonify({"success": True, "downloadURL": response_data.get('downloadURL') }), 200
        except Exception as e:
            print(e)
            return jsonify({"error": "The image provided is invalid. Please try again"}), 400
    else:
        return jsonify({"error": "Allowed image types are - png, jpg, jpeg, webp"}), 400

@app.route('/prompt', methods=['POST'])
def execute_comfy():
    authenticate(request.headers.get('Authorization'))

    external_api_url = DEFAULT_EXTERNAL_API_URL
    client_id = request.args.get('clientId')

    incoming_data = request.json
    external_api_url = f"{external_api_url}/prompt"

    try:
        response = requests.post(external_api_url, json=incoming_data)
        
        if client_id not in generations:
            generations[client_id] = []

        generations[client_id].append(response.json().get('prompt_id'))
            
        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
def postProcess(filename):
    external_api_url = DEFAULT_EXTERNAL_API_URL
    with open("./workflow/workflow_api_rewrite_metadata.json", "r") as file_json:
        postProcessing_workflow = json.load(file_json)
 
    postProcessing_workflow['1']['inputs']['image'] = "../output/" + "pre_" + filename + "_.png"
    postProcessing_workflow['2']['inputs']['filename_prefix'] = "processed_"+filename.split("_000")[0]
    
    prompt = {
        "prompt": postProcessing_workflow,
        "front": True
    }
    
    external_api_url = f"{external_api_url}/prompt"
    post_processing_response = requests.post(external_api_url, json=prompt)

    return post_processing_response.json()
    
@app.route('/get-queue', methods=['GET'])
def get_queue():
    external_api_url = DEFAULT_EXTERNAL_API_URL
    external_api_url = f"{external_api_url}/queue"

    try:
        response = requests.get(external_api_url)
        response_json = response.json()
        if 'queue_running' in response_json and response_json['queue_running']:
            for i in range(len(response_json['queue_running'])):
                if len(response_json['queue_running'][i]) > 2:
                    response_json['queue_running'][i] = response_json['queue_running'][i][:2]
                
        if 'queue_pending' in response_json and response_json['queue_pending']:
            for i in range(len(response_json['queue_pending'])):
                if len(response_json['queue_pending'][i]) > 2:
                    response_json['queue_pending'][i] = response_json['queue_pending'][i][:2]

        modified_response_json = {key: value for key, value in response_json.items()}
        return jsonify(modified_response_json), response.status_code    
    except requests.RequestException as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/delete-queue-item', methods=['POST'])
def delete_queue_item():
    external_api_url = DEFAULT_EXTERNAL_API_URL
    incoming_data = request.json
    
    external_api_url = f"{external_api_url}/queue"
    try:
        response = requests.post(external_api_url, json=incoming_data)

        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/interrupt', methods=['POST'])
def interrupt_execution():
    external_api_url = DEFAULT_EXTERNAL_API_URL

    external_api_url = f"{external_api_url}/interrupt"

    try:
        response = requests.post(external_api_url)

        return jsonify(response.json()), response.status_code
    except requests.RequestException as e:
        print(e)
        return jsonify({"error": str(e)}), 500

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS