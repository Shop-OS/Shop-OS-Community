import random
from typing import Optional
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import replicate
from pydantic import BaseModel
from routes.auth import authenticate, checkForCredits
from threading import Lock
from mongo import db

vton = Blueprint('vton', __name__)
credit_lock = Lock()
accounts = db['accounts']

load_dotenv()

class VtonRequest(BaseModel):
  category: str
  garm_img: str
  human_img: str
  garment_des: str
  mask_img: Optional[str] = None

@vton.route('/api/vton/create', methods=['POST'])
def create():
  if not request.headers.get('Authorization'):
      return jsonify({"error": "Unauthorized"}), 401
  user_data = authenticate(request.headers.get('Authorization'))
  checkForCredits(user_data['email'], 1)

  request_data = VtonRequest.model_validate(request.json)
  seed = random.randint(1, 10000)
  try:
    input = {
      "crop": True,
      "seed": seed,
      "steps": 30,
      "category": request_data.category,
      "garm_img": request_data.garm_img,
      "human_img": request_data.human_img,
      "garment_des": request_data.garment_des,
      "mask_img": request_data.mask_img if request_data.mask_img is not None else None
    }
    
    print(input)

    output = replicate.run(
      "cuuupid/idm-vton:906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f",
      input=input
    )
      
    print(output)
    deductCredits(user_data['email'], 1)

    return jsonify({'output': output}), 200
  except Exception as e:
    return jsonify({'message': str(e)}), 400
  
  
def deductCredits(email, credits):
    with credit_lock:
        user = accounts.find_one({'email': email})
        if user.get('credits') < credits:
            raise Exception("Insufficient credits")
        else:
            accounts.update_one({'email': email}, {'$inc': {'credits': -credits}})