import json
import threading
from mongo import db
from service.email import send_email_with_attachments
from service.sqs import pull_from_sqs, delete_message_from_sqs, push_to_generation_sqs, push_to_email_sqs

mongo_generations = db['generations']

def email_scanner():
  print("Email Worker is running...")
  
  try:
    message = pull_from_sqs(target="email")
    
    if not message:
      print("No email messages in queue")
      return
    
    body = json.loads(message['Body'])
    send_email_with_attachments(body['subject'], body['body'], body['to'], body['image_urls'])
    mongo_generations.update_one({"user_email": body['to']}, 
                                {"$set": {"email_sent": "true"}})
    
    print("Email sent to ", body['to'])
    
    delete_message_from_sqs(message['ReceiptHandle'], target="email")
  except Exception as e:
    print("Error in email worker: ", e)