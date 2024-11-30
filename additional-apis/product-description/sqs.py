import boto3
import json
from dotenv import load_dotenv
import os

load_dotenv()

def push_to_sqs(conv, prompt, image_url, generationId):
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )
  
  try:
    print('Pushing to SQS: ', os.getenv('SQS_DESCRIPTION_QUEUE_URL'), 'conv', conv, 'prompt', prompt, 'image_url', image_url, 'generationId', generationId)
    sqs.send_message(
      QueueUrl=os.getenv('SQS_DESCRIPTION_QUEUE_URL'),
      MessageGroupId='hom-description-queue',
      MessageBody=json.dumps({
        'conv': conv,
        'prompt': prompt,
        'image_url': image_url,
        'generationId': generationId
      })
    )
  except Exception as e:
    print(str(e))
    
def get_queue_length():
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )
  
  queue_url = os.getenv('SQS_DESCRIPTION_QUEUE_URL')
  
  response = sqs.get_queue_attributes(
    QueueUrl=queue_url,
    AttributeNames=[
      'ApproximateNumberOfMessages'
    ]
  )
  print('ApproximateNumberOfMessages', response['Attributes']['ApproximateNumberOfMessages'])
  
  return int(response['Attributes']['ApproximateNumberOfMessages'])    
    
def pull_from_sqs():
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )
  
  queue_url = os.getenv('SQS_DESCRIPTION_QUEUE_URL')

  response = sqs.receive_message(
    QueueUrl=queue_url,
    MaxNumberOfMessages=1
  )
  
  if not 'Messages' in response:
    return
    
  message = response['Messages'][0]  
  return message

def delete_message_from_sqs(receipt_handle):
  sqs = boto3.client('sqs',
    aws_access_key_id=os.getenv('AWS_SQS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SQS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_S3_REGION')
  )
  
  queue_url = os.getenv('SQS_DESCRIPTION_QUEUE_URL')

  sqs.delete_message(
    QueueUrl=queue_url,
    ReceiptHandle=receipt_handle
  )

  print(f"Message deleted from SQS: {receipt_handle}")