import boto3
import json
from dotenv import load_dotenv
import os

load_dotenv()

def push_to_generation_sqs(filename, userEmail, generationId, type = "Apparel", prompt = ""):
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )
  
  print(f"Pushing to SQS: {filename}, {userEmail}, {generationId}, {type}, {prompt}")
  try:
    sqs.send_message(
      QueueUrl=os.getenv('SQS_GENERATION_QUEUE_URL'),
      MessageGroupId='hom-generation-queue',
      MessageBody=json.dumps({'userEmail': userEmail, 'filename': filename, 'generationId': generationId, "type": type, "prompt": prompt})
    )
  except Exception as e:
    print(str(e))

def push_to_email_sqs(subject, body, to, image_urls):
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )

  try:
    sqs.send_message(
      QueueUrl=os.getenv('SQS_EMAIL_QUEUE_URL'),
      MessageGroupId='email-queue',
      MessageBody=json.dumps({'subject': subject, 'body': body, 'to': to, 'image_urls': image_urls})
    )
  except Exception as e:
    print(str(e))
  
def pull_from_sqs(target = "generation"):
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )

  if target == "generation":
    queue_url = os.getenv('SQS_GENERATION_QUEUE_URL')
  elif target == "email":
    queue_url = os.getenv('SQS_EMAIL_QUEUE_URL')

  response = sqs.receive_message(
    QueueUrl=queue_url,
    MaxNumberOfMessages=1
  )
  
  if not 'Messages' in response:
    return
    
  message = response['Messages'][0]  
  return message

def delete_message_from_sqs(receipt_handle, target = "generation"):
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )
  
  if target == "generation":
    queue_url = os.getenv('SQS_GENERATION_QUEUE_URL')
  elif target == "email":
    queue_url = os.getenv('SQS_EMAIL_QUEUE_URL')

  sqs.delete_message(
    QueueUrl=queue_url,
    ReceiptHandle=receipt_handle
  )

  print(f"Message deleted from SQS: {receipt_handle}")