import os
from flask import Blueprint, abort, request, jsonify
from dotenv import load_dotenv
from mongo import db
from service.email import send_email
import requests

req_gen = Blueprint('req_gen', __name__)
load_dotenv()

support_requests = db['support_requests']

def createSupportRequest():
  subject = request.json.get('subject')
  body = request.json.get('body')
  
  if not subject or not body:
    return jsonify({"error": "Subject and body required"}), 400

  headers = {
        'Authorization': f"Bearer {os.getenv('OPENAI_API_KEY')}"
  }
  request_body = {
    "model": "gpt-3.5-turbo-0125",
    "messages": [
      {
        "role": "system",
        "content": "You are a brilliant summarizer of texts."
      },
      {
        "role": "user",
        "content": """
          Subject: {subject}
          Body: {body}
        
          Please summarize this support request.
        """
      }
    ]
  }

  try:
    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=request_body)
    response_data = response.json().get('choices')[0].get('message').get('content')
    
    email_body_filename = os.path.join('/home/azureuser/workspace/server/service', 'email_templates', 'req_gen.html')

    body = get_email_body(email_body_filename, subject, body)    
    send_email(f"Agent Request Received: {subject}", body, "aditya@insynkstudios.com")
    # send_email(f"Agent Request Received: {subject}", response_data, "aman@insynkstudios.com")
    send_email(f"Agent Request Received: {subject}", body, "rupayanc16@gmail.com")
  except Exception as e:
    return jsonify({"error": str(e)}), 500

  return jsonify({"success": "Support request created successfully"}), 200

def get_email_body(filename, subject, body):
  with open(filename, 'r') as file:
    data = file.read()
    data = data.replace('{subject}', subject)
    data = data.replace('{body}', body)
    return data