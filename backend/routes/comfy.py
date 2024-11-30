from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from dotenv import load_dotenv
import jwt
import json
import random
import os
import requests
from datetime import datetime
import time
from dto.apparel_background_change_request import ApparelBackgroundChangeRequest
from dto.brushnet_background_change_request import BrushnetBackgroundChangeRequest
from dto.ootd_background_change_request import OOTDBackgroundChangeRequest
from dto.product_background_change_request import ProductBackgroundChangeRequest
from dto.description_generator_request import DescriptionGeneratorRequest
from dto.magic_fix_request import MagicFixRequest
from dto.text_to_3d_request import SV3DRequest
from state import generations
from mongo import db
from routes.auth import authenticate, checkForCredits
from threading import Lock
from service.sqs import push_to_generation_sqs

credit_lock = Lock()

load_dotenv()
comfy = Blueprint('comfy', __name__)

mongo_generations = db['generations']
accounts = db['accounts']

@comfy.route('/api/image-generation/apparel', methods=['POST'])
def apparelBackgroundChange():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        checkForCredits(user_data['email'], 1)
        shouldUseLora = request.args.get('lora', False).lower() == 'true'
        client_id = request.args.get('clientId', None)
        request_data = ApparelBackgroundChangeRequest.parse_obj(request.json)
        
        if not request_data.generationId:
            return jsonify({"error": "Generation ID is required"}), 400
        if not request_data.inputImageURL:
            return jsonify({"error": "Input image URL is required"}), 400
        if not request_data.seed:
            request_data.seed = random.randint(1, 1_500_000)
        if request_data.regeneration:
            if not request_data.originalImageURL or not request_data.originalImageFileName:
                return jsonify({"error": "Original image URL and file name are required"}), 400
        
        workflow = None
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        if shouldUseLora:
            file_path = os.path.join(base_dir, "workflow", "apparel_background_change", "bg_change_with_background_lora.json")
        else:          
            file_path = os.path.join(base_dir, "workflow", "apparel_background_change", "bg_change_gaussian_blur.json")
            
        with open(file_path, "r") as f:
            workflow = json.load(f)        
        
        workflow["3"]["inputs"]["seed"] = request_data.seed
        workflow["70"]["inputs"]["seed"] = request_data.seed
        
        workflow["6"]["inputs"]["text"] = request_data.positivePrompt
        workflow["7"]["inputs"]["text"] = request_data.negativePrompt
        workflow["70"]["inputs"]["wildcard"] = request_data.faceDetailerPrompt
        
        if shouldUseLora:
            workflow["193"]["inputs"]["lora_name"] = request_data.backgroundLora.name
            workflow["193"]["inputs"]["strength_model"] = request_data.backgroundLora.strength_model
            workflow["193"]["inputs"]["strength_clip"] = request_data.backgroundLora.strength_clip
        
        workflow["128"]["inputs"]["image"] = request_data.inputMaskImagePath
        workflow["134"]["inputs"]["image"] = request_data.inputImagePath
        workflow["139"]["inputs"]["image"] = request_data.inputFocusImagePath
        
        workflow["115"]["inputs"]["amount"] = request_data.outputCount
        if shouldUseLora:
            workflow["195"]["inputs"]["filename_prefix"] = request_data.outputFileName
        else:
            workflow["193"]["inputs"]["filename_prefix"] = request_data.outputFileName
        
        data = {
            "prompt": workflow,
            "client_id": client_id
        }
        
        try:
            comfy_url = f'{os.getenv("COMFY_URL")}/prompt'
            response = requests.post(comfy_url, json=data)
            
            if client_id not in generations:
                generations[client_id] = []

            generations[client_id].append(response.json().get('prompt_id'))

            mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": request_data.generationId,
                "type": "apparel",
                "input_image_url": request_data.inputImageURL,
                "download_url": None,
                "filename": request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount),
                "negative_prompt": request_data.negativePrompt,
                "positive_prompt": request_data.positivePrompt,
                "timestamp": None,
                "prompt_id": response.json().get('prompt_id'),
                "regeneration": request_data.regeneration,
                "original_image_url": request_data.originalImageURL if request_data.regeneration else None,
                "original_image_filename": request_data.originalImageFileName if request_data.regeneration else None,
                "category": "generation" if not request_data.regeneration else "regeneration",
                "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
            })

            deductCredits(user_data['email'], 1)
            push_to_generation_sqs(request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount), user_data['email'], request_data.generationId, "Apparel", request_data.positivePrompt)
            return jsonify(response.json()), response.status_code
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@comfy.route('/api/image-generation/bg_change_b', methods=['POST'])
def brushnetBackgroundChange():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        checkForCredits(user_data['email'], 1)
        client_id = request.args.get('clientId', None)
        request_data = BrushnetBackgroundChangeRequest.parse_obj(request.json)
        
        if not request_data.generationId:
            return jsonify({"error": "Generation ID is required"}), 400
        if not request_data.inputImageURL:
            return jsonify({"error": "Input image URL is required"}), 400
        if not request_data.seed:
            request_data.seed = random.randint(1, 1_500_000)
        
        workflow = None
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        file_path = os.path.join(base_dir, "workflow", "brushnet_background_change", "bg_change_brushnet.json")
            
        with open(file_path, "r") as f:
            workflow = json.load(f)        
        
        workflow["64"]["inputs"]["seed"] = request_data.seed
        workflow["67"]["inputs"]["text"] = request_data.prompt  
        workflow["1"]["inputs"]["image"] = request_data.inputImagePath
        workflow["53"]["inputs"]["filename_prefix"] = request_data.outputFileName
        
        data = {
            "prompt": workflow,
            "client_id": client_id
        }
        
        try:
            comfy_url = f'{os.getenv("COMFY_URL")}/prompt'
            response = requests.post(comfy_url, json=data)
            
            if client_id not in generations:
                generations[client_id] = []

            generations[client_id].append(response.json().get('prompt_id'))

            mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": request_data.generationId,
                "type": "backgroundChangeB",
                "input_image_url": request_data.inputImageURL,
                "download_url": None,
                "filename": request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount),
                "prompt": request_data.prompt,
                "timestamp": None,
                "prompt_id": response.json().get('prompt_id'),
                "category": "generation",
                "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
            })

            deductCredits(user_data['email'], 1)
            push_to_generation_sqs(request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount), user_data['email'], request_data.generationId, "Background Change", request_data.prompt)
            return jsonify(response.json()), response.status_code
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@comfy.route('/api/image-generation/bg_change_o', methods=['POST'])
def ootdBackgroundChange():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        checkForCredits(user_data['email'], 1)
        client_id = request.args.get('clientId', None)
        request_data = OOTDBackgroundChangeRequest.parse_obj(request.json)
        target = request.args.get('target', None)
        if not target:
            return jsonify({"error": "Target is required"}), 400
        
        if not request_data.generationId:
            return jsonify({"error": "Generation ID is required"}), 400
        if not request_data.inputPersonImageURL:
            return jsonify({"error": "Input image URL is required"}), 400
        if not request_data.inputClothImageURL:
            return jsonify({"error": "Input image URL is required"}), 400
        if not request_data.seed:
            request_data.seed = random.randint(1, 1_500_000)
        
        workflow = None
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        file_path = os.path.join(base_dir, "workflow", "ootd", "ootd_workflow.json")
            
        with open(file_path, "r") as f:
            workflow = json.load(f)        
        
        if target == "upper_half":
            workflow["2"]["inputs"]["type"] = "Half body"
            workflow["3"]["inputs"]["category"] = "Upper body"
        elif target == "lower_half":
            workflow["2"]["inputs"]["type"] = "Full body"
            workflow["3"]["inputs"]["category"] = "Lower body"
        elif target == "full_body":
            workflow["2"]["inputs"]["type"] = "Full body"
            workflow["3"]["inputs"]["category"] = "Dress"
        
        workflow["3"]["inputs"]["seed"] = request_data.seed

        workflow["4"]["inputs"]["image"] = request_data.inputClothImagePath
        workflow["5"]["inputs"]["image"] = request_data.inputPersonImagePath
        
        workflow["8"]["inputs"]["filename_prefix"] = request_data.outputFileName

        data = {
            "prompt": workflow,
            "client_id": client_id
        }
        
        try:
            comfy_url = f'{os.getenv("OOTD_COMFY_URL")}/prompt'
            print(comfy_url)
            response = requests.post(comfy_url, json=data)
            print(response.json())
            
            if client_id not in generations:
                generations[client_id] = []

            generations[client_id].append(response.json().get('prompt_id'))

            mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": request_data.generationId,
                "type": "backgroundChangeO",
                "input_image_person_url": request_data.inputPersonImageURL,
                "input_image_cloth_url": request_data.inputClothImageURL,
                "download_url": None,
                "filename": request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount),
                "prompt": None,
                "timestamp": None,
                "prompt_id": response.json().get('prompt_id'),
                "category": "generation",
                "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
            })

            deductCredits(user_data['email'], 1)
            # push_to_generation_sqs(request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount), user_data['email'], request_data.generationId, "Background Change", None)
            return jsonify(response.json()), response.status_code
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
  
@comfy.route('/api/image-generation/product', methods=['POST'])
def productBackgroundChange():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        checkForCredits(user_data['email'], 1)

        client_id = request.args.get('clientId', None)
        request_data = ProductBackgroundChangeRequest.model_validate(request.json)
        
        if not request_data.generationId:
            return jsonify({"error": "Generation ID is required"}), 400
        if not request_data.inputImageURL:
            return jsonify({"error": "Input image URL is required"}), 400
        if not request_data.seed:
            request_data.seed = random.randint(1, 1_500_000)
        
        workflow = None
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        file_path = os.path.join(base_dir, "workflow", "product_background_change", "bg_change_product.json")
            
        with open(file_path, "r") as f:
            workflow = json.load(f)        
        
        workflow["41"]["inputs"]["seed"] = request_data.seed
        
        workflow["144"]["inputs"]["prompt"] = request_data.prompt
        workflow["121"]["inputs"]["weight"] = request_data.renderStrength
        
        workflow["94"]["inputs"]["image"] = request_data.inputProductImagePath
        workflow["124"]["inputs"]["image"] = request_data.backgroundRefImagePath
        workflow["131"]["inputs"]["image"] = request_data.inputFocusImagePath
        workflow["156"]["inputs"]["image"] = request_data.inputBlackAndWhiteImagePath
        
        workflow["226"]["inputs"]["filename_prefix"] = request_data.outputFileName
        
        data = {
            "prompt": workflow,
            "client_id": client_id
        }
        
        try:
            comfy_url = f'{os.getenv("COMFY_URL")}/prompt'
            response = requests.post(comfy_url, json=data)
            
            if client_id not in generations:
                generations[client_id] = []

            generations[client_id].append(response.json().get('prompt_id'))
                        
            mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": request_data.generationId,
                "input_image_url": request_data.inputImageURL,
                "type": "product",
                "download_url": None,
                "filename": request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount),
                "timestamp": None,
                "prompt": request_data.prompt,
                "prompt_id": response.json().get('prompt_id'),
                "category": "generation",
                "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
            })
            
            deductCredits(user_data['email'], 1)
            push_to_generation_sqs(request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount), user_data['email'], request_data.generationId, "Product", request_data.prompt)
            return jsonify(response.json()), response.status_code
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 400   
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400  

@comfy.route('/api/3d-generation/image_to_3d', methods=['POST'])
def image_to_3d_generation():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        checkForCredits(user_data['email'], 2)

        client_id = request.args.get('clientId', None)
        request_data = SV3DRequest.model_validate(request.json)
        
        if not request_data.generationId:
            return jsonify({"error": "Generation ID is required"}), 400
        if not request_data.inputImageURL:
            return jsonify({"error": "Input image URL is required"}), 400
        if not request_data.seed:
            request_data.seed = random.randint(1, 1_500_000)
        
        workflow = None
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        file_path = os.path.join(base_dir, "workflow", "text_to_3d", "sv3d_image_to_3d.json")
            
        with open(file_path, "r") as f:
            workflow = json.load(f)        
        
        workflow["6"]["inputs"]["seed"] = request_data.seed  
        workflow["7"]["inputs"]["image"] = request_data.inputImagePath  
        workflow["11"]["inputs"]["filename_prefix"] = request_data.outputFileName
        
        data = {
            "prompt": workflow,
            "client_id": client_id
        }
        
        try:
            comfy_url = f'{os.getenv("COMFY_URL")}/prompt'
            response = requests.post(comfy_url, json=data)
            
            if client_id not in generations:
                generations[client_id] = []

            generations[client_id].append(response.json().get('prompt_id'))

            mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": request_data.generationId,
                "input_image_url": request_data.inputImageURL,
                "type": "image_to_3d",
                "download_url": None,
                "filename": request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount) + ".gif",
                "timestamp": None,
                "origin": "hom",
                "prompt_id": response.json().get('prompt_id'),
                "category": "generation",
                "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
            })
            
            deductCredits(user_data['email'], 2)
            return jsonify(response.json()), response.status_code
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 400   
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400  
  
@comfy.route('/api/text-generation/description', methods=['POST'])
def descriptionGeneration():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        checkForCredits(user_data['email'], 1)
        target = request.args.get('target', None)
        request_data = DescriptionGeneratorRequest.model_validate(request.json)
    
        workflow = None
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        file_path = os.path.join(base_dir, "workflow", "common", "generate_description.json")
            
        with open(file_path, "r") as f:
            workflow = json.load(f)        
        
        if target == "product":
            workflow["19"]["inputs"]["question"] = "Describe the product in the image in 5 words. Do not mention any brand's name. Do not mention size of the product. Mention only primary color of the product. No full-stop at the end. Example output, 'A white coffee cup with a green logo on it'"
        elif target == "apparel":
            workflow["19"]["inputs"]["question"] = "What are the clothes the subject is wearing? Describe all the clothes in the image in 5 words. (Example output: 'Black shirt with blue jeans')Do not mention any brand's name. Mention only primary color of the clothes. No full-stop at the end"
        else:
            return jsonify({"error": "Invalid target"}), 400
        
        workflow["5"]["inputs"]["image"] = request_data.inputImagePath
        workflow["20"]["inputs"]["filename_prefix"] = request_data.outputFileName
        
        data = {
            "prompt": workflow,
            "front": True
        }
        
        try:
            comfy_url = f'{os.getenv("COMFY_URL")}/prompt'
            response = requests.post(comfy_url, json=data)
            
            deductCredits(user_data['email'], 1)
            return jsonify(response.json()), response.status_code
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
 
@comfy.route('/api/image-generation/magic-fix', methods=['POST'])
def magicFix():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        checkForCredits(user_data['email'], 1)
        client_id = request.args.get('clientId', None)
        request_data = MagicFixRequest.model_validate(request.json)

        if not request_data.generationId:
            return jsonify({"error": "Generation ID is required"}), 400
        if not request_data.inputImageURL:
            return jsonify({"error": "Input image URL is required"}), 400
        if not request_data.originalImageURL or not request_data.originalImageFileName:
            return jsonify({"error": "Original image URL and file name are required"}), 400
        
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        file_path = os.path.join(base_dir, "workflow", "apparel_background_change", "magic_fix.json")
            
        with open(file_path, "r") as f:
            workflow = json.load(f)  
        
        workflow["2"]["inputs"]["image"] = request_data.inputImagePath
        workflow["7"]["inputs"]["image"] = request_data.inputMaskImagePath
        workflow["1"]["inputs"]["image"] = request_data.inputGeneratedImagePath
        workflow["12"]["inputs"]["filename_prefix"] = request_data.outputFileName
        
        data = {
            "prompt": workflow,
            "client_id": client_id,
            "front": True
        }
        
        try:
            comfy_url = f'{os.getenv("COMFY_URL")}/prompt'
            response = requests.post(comfy_url, json=data)
            
            if client_id not in generations:
                generations[client_id] = []

            generations[client_id].append(response.json().get('prompt_id'))
            
            mongo_generations.insert_one({
                "user_id": user_data['sub'],
                "user_email": user_data['email'],
                "generation_id": request_data.generationId,
                "type": "apparel",
                "input_image_url": request_data.inputImageURL,
                "download_url": None,
                "filename": request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount),
                "timestamp": None,
                "prompt_id": response.json().get('prompt_id'),
                "original_image_url": request_data.originalImageURL,
                "original_image_filename": request_data.originalImageFileName,
                "category": "generation",
            })
            
            positivePrompt = "Magic Fix"
            push_to_generation_sqs(request_data.outputFileName + "_0000" + str(request_data.outputFileNameCount), user_data['email'], request_data.generationId, "Apparel", positivePrompt)
            deductCredits(user_data['email'], 1)
            return jsonify(response.json()), response.status_code
        except requests.RequestException as e:
            return jsonify({"error": str(e)}), 400  
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@comfy.route('/api/generations', methods=['GET'])
def getGenerations():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        user_id = user_data['sub']
        target = request.args.get('target', None)
        
        print("getGenerations", user_id, target)
        
        if not target:
            return jsonify({"error": "Target is required"}), 400
        
        generations = mongo_generations.find({"user_id": user_id, "type": target})
        print("getGenerations: ", "got from mongo ", generations.count())
        
        if generations.count() == 0:
            return jsonify({"error": "No generations found"}), 400
        else:
            print("getGenerations", generations)            
            return jsonify([{
                "generationId": generation['generation_id'],
                "type": generation.get('type'),
                "inputImageURL": generation.get('input_image_url'),
                "inputPersonImageURL": generation.get('input_image_person_url') if generation.get('input_image_person_url') else None,
                "inputClothImageURL": generation.get('input_image_cloth_url') if generation.get('input_image_cloth_url') else None,
                "timestamp": generation.get('timestamp'),
                "downloadURL": generation.get('download_url'),
                "filename": generation.get('filename'),
                "category": generation.get('category'),
                "promptId": generation.get('prompt_id'),
                "regeneration": generation.get('regeneration') if generation.get('regeneration') else None,
                "originalImageURL": generation.get('original_image_url') if generation.get('original_image_url') else None,
                "originalImageFileName": generation.get('original_image_filename') if generation.get('original_image_filename') else None,
                "positivePrompt": generation.get('positive_prompt') if generation.get('positive_prompt') else None,
                "negativePrompt": generation.get('negative_prompt') if generation.get('negative_prompt') else None,
                "origin": generation.get('origin') if generation.get('origin') else None,
                "prompt": generation.get('prompt') if generation.get('prompt') else None,
            } for generation in generations]), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@comfy.route('/api/generations/remove', methods=['DELETE'])
def removeGenerations():
    try:
        if not request.headers.get('Authorization'):
            return jsonify({"error": "Unauthorized"}), 401
        user_data = authenticate(request.headers.get('Authorization'))
        user_id = user_data['sub']
        generation_id = request.args.get('generationId', None)
        filename = request.args.get('filename', None)

        mongo_generations.delete_one({"user_id": user_id, "generation_id": generation_id, "filename": filename})
        
        return jsonify({"message": "Generation removed successfully"}), 204
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
def deductCredits(email, credits):
    with credit_lock:
        user = accounts.find_one({'email': email})
        if user.get('credits') < credits:
            raise Exception("Insufficient credits")
        else:
            accounts.update_one({'email': email}, {'$inc': {'credits': -credits}})