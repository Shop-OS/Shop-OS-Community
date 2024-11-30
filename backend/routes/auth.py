import os
from flask import Blueprint, abort, request, jsonify, url_for, redirect
from flask_bcrypt import Bcrypt
import re
import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta
from mongo import db
from werkzeug.exceptions import HTTPException
from service.email import send_email
import requests
from itsdangerous import URLSafeTimedSerializer

auth = Blueprint('auth', __name__)
load_dotenv()

bcrypt = Bcrypt()

accounts = db['accounts']

@auth.route('/api/auth/userinfo', methods=['GET'])
def getUserInfo():
  email = request.args.get('email')
  
  user = accounts.find_one({'email': email})
  if not user:
    return jsonify({"error": "User not found"}), 204
  else:
    return jsonify({
      "email": user.get('email'), 
      "verified": user.get('verified')
    }), 200

@auth.route('/api/auth/create', methods=['POST'])
def createUser():
  email = request.json.get('email')
  name = request.json.get('name')
  password = None
  type = request.json.get('type')
  google_access_token = None
  
  if not type:
    type = 'email-password'
    
  if type == 'google-oauth':
    google_access_token = request.json.get('google_access_token')
    if not google_access_token:
      return jsonify({"error": "Access token required"}), 400
  elif type == 'email-password':
    password = request.json.get('password')
    
  blacklisted_domains = [
      'abc.com',
      'test.com'
  ]
  domain = email.split('@')[1]
  if domain in blacklisted_domains:
    return jsonify({"error": "Failed to create a user"}), 400

  if not re.match(r"[^@]+@[^@]{2,}\.[^@]{2,}", email):
    return jsonify({"error": "Invalid email format"}), 400
  
  if type == "email-password" and not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\S])[A-Za-z\d\S]{8,}$", password):
    return jsonify({"error": "Password must be at least 8 characters long, contain both uppercase and lowercase letters, have at least one digit, and include at least one special character"}), 400

  if not email or type == 'email-password' and not password:
    return jsonify({"error": "Email and password required"}), 400

  existing_user = accounts.find_one({'email': email})

  if existing_user:
    return jsonify({"error": "Account with this email already exists"}), 400
  
  hashed_password = None
  if type == 'google-oauth':
    response = requests.get(f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={google_access_token}")
    if response.status_code != 200:
      return jsonify({"error": "Invalid access token"}), 400
  elif type == 'email-password':
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

  user = {
    'email': email,
    'name': response.json().get('name') if type == 'google-oauth' else name,
    'avatar': response.json().get('picture') if type == 'google-oauth' else 'https://www.gravatar.com/avatar/' + email,
    'password': hashed_password,
    'credits': 100,
    'type': type,
    'google_id': response.json().get('id') if type == 'google-oauth' else '',
    'verified': response.json().get('verified_email') if type == 'google-oauth' else False,
  }

  accounts.insert_one(user)

  s = URLSafeTimedSerializer(os.getenv('EMAIL_TOKEN_SECRET'))
  token = s.dumps(email, salt='email-confirm')

  try:
    confirm_url = url_for('auth.confirm_email', token=token, _external=True, _scheme='https')
  except Exception as e:
    print(str(e))
  
  confirmation_email_body = f"""
  <pre>
  Hi there! Welcome to House of Models!
  
  Please follow the link to confirm your email: {confirm_url}
  </pre>
  """
  
  try:
    send_email("Confirm your email", confirmation_email_body, email)
  except Exception as e:
    print(str(e))
  return jsonify({"success": "User created successfully"}), 200

@auth.route('/api/auth/resend', methods=['POST'])
def resend_confirmation():
    email = request.json.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = accounts.find_one({'email': email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user['verified']:
        return jsonify({"error": "Account already confirmed"}), 400

    s = URLSafeTimedSerializer(os.getenv('EMAIL_TOKEN_SECRET'))
    token = s.dumps(email, salt='email-confirm')
    try:
      confirm_url = url_for('auth.confirm_email', token=token, _external=True, _scheme='https')
    except Exception as e:
      print(str(e))
    email_body = f"""
    Please follow the link to confirm your email: {confirm_url}
    """

    try:
        send_email("Confirm your email", email_body, email)
        return jsonify({"success": "Confirmation email sent"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth.route('/api/auth/confirm/<token>')
def confirm_email(token):
    try:
        s = URLSafeTimedSerializer(os.getenv('EMAIL_TOKEN_SECRET'))
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except:
        return jsonify({"error": "The confirmation link is invalid or has expired."}), 400

    user = accounts.find_one({'email': email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get('verified') is True:
        return jsonify({"error": "Account already confirmed"}), 400

    try:
      accounts.update_one({'email': email}, {'$set': {'verified': True}})

      email_body_filename = os.path.join('/home/azureuser/workspace/server/service', 'email_templates', 'welcome.html')
      body = open(email_body_filename).read()

      send_email("Ready to sell 3X more? Welcome to House of Models! ", body, email)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return redirect("https://app.houseofmodels.ai/welcome?verified=true", code=302)
  
@auth.route('/api/auth/login', methods=['POST'])
def login():
  email = request.json.get('email')
  password = None
  type = request.json.get('type')
  google_access_token = None
  
  if not type:
    type = 'email-password'
    
  if type == 'google-oauth':
    google_access_token = request.json.get('google_access_token')
    if not google_access_token:
      return jsonify({"error": "Access token required"}), 400
  elif type == 'email-password':
    password = request.json.get('password')

  if not email or type == 'email-password' and not password:
    return jsonify({"error": "Email and password required"}), 400

  user = accounts.find_one({'email': email})

  if not user:
    return jsonify({"error": "Invalid email or password"}), 401

  if type == "email-password" and user.get('password') is not None and bcrypt.check_password_hash(user.get('password'), password):
    payload = {
      'exp': datetime.utcnow() + timedelta(days=7),
      'iat': datetime.utcnow(),
      'sub': str(user['_id']),
      'email': user.get('email')
    }
    try:
      token = jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')
    except Exception as e:
      return jsonify({"error": str(e)}), 500
    return jsonify({"token": token}), 200
  elif type == "google-oauth":
    response = requests.get(f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={google_access_token}")
    if response.status_code != 200:
      return jsonify({"error": "Invalid access token"}), 400
    ## Remove after all users migrated
    if not user.get('google_id'):
      accounts.update_one({'email': email}, {'$set': {'google_id': response.json().get('id'), 'verified': response.json().get('verified_email')}})
    if not user.get('picture') and response.json().get('picture'):
      accounts.update_one({'email': email}, {'$set': {'avatar': response.json().get('picture')}})
      
    if user['email'] == response.json().get('email'):
      payload = {
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow(),
        'sub': str(user['_id']),
        'email': user.get('email'),
        'verified': user.get('verified') if user.get('verified') else False,
      }
      try:
        token = jwt.encode(payload, os.getenv('JWT_SECRET'), algorithm='HS256')
      except Exception as e:
        return jsonify({"error": str(e)}), 500
      return jsonify({"token": token}), 200
    else:
      return jsonify({"error": "Login Failed"}), 401
  else:
    return jsonify({"error": "Login Failed"}), 401
  
@auth.route('/api/auth/verify-token', methods=['POST'])
def verifyToken():
  token = request.headers.get('Authorization')
  data = authenticate(token)
  if not data:
    return jsonify({"error": "Unauthorized"}), 401
  return jsonify({"email": data.get('email')}), 200

@auth.route('/api/auth/credits', methods=['GET'])
def getCredits():
  token = request.headers.get('Authorization')
  data = authenticate(token)
  user = accounts.find_one({'email': data.get('email')})
  if not user:
    return jsonify({"error": "Unauthorized"}), 401
  return jsonify({"credits": user.get('credits')}), 200

@auth.route('/api/auth/credits', methods=['POST'])
def addCredits():
  token = request.headers.get('Authorization')
  email = request.args.get('email')
  accounts.update_one({'email': email}, {'$set': {'credits': 100}})
  return jsonify({"success": "Credits added successfully"}), 200

class InsufficientCredits(HTTPException):
    code = 402
    description = 'InsufficientCredits'
  
@auth.errorhandler(InsufficientCredits)
def handle_402(error):
    response = jsonify({"error": "Insufficient Credits"})
    response.status_code = 402
    return response

def authenticate(token):
    if not token:
        abort(401, {"error": "Unauthorized"})
    
    try:
        data = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
        email = data.get('email')
        user = accounts.find_one({'email': email})
        
        if user and user.get('verified') is False:
            abort(403, {"error": "Forrbidden"})
            
    except jwt.ExpiredSignatureError:
        abort(401, {"error": "Unauthorized"})
    except jwt.InvalidTokenError:
        abort(401, {"error": "Unauthorized"})

    if (not data['sub']):
        abort(401, {"error": "Unauthorized"})
    
    return data
  
def checkForCredits(email, credits):
    user = accounts.find_one({'email': email})
    if not user:
        abort(401, {"error": "Unauthorized"})

    user_credits = user.get('credits')
    if user_credits is None:
        raise InsufficientCredits()

    if user_credits < credits:
        raise InsufficientCredits()
    return