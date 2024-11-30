from dotenv import load_dotenv
import boto3
import os

load_dotenv()

def upload_to_s3(filePath):
    s3_client = boto3.client(
      's3',
      aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
      aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
      region_name=os.getenv('AWS_S3_REGION')
    )
    s3_file_name = os.path.basename(filePath)
    s3_client.upload_file(filePath, os.getenv('AWS_S3_BUCKET_NAME'), s3_file_name, ExtraArgs={'Metadata': {}, 'ContentDisposition': 'attachment'})
    downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{s3_file_name}"   

    return downloadURL
  
def put_object_to_s3(key, data):
    s3_client = boto3.client(
      's3',
      aws_access_key_id=os.getenv('AWS_S3_ACCESS_KEY_ID'),
      aws_secret_access_key=os.getenv('AWS_S3_SECRET_ACCESS_KEY'),
      region_name=os.getenv('AWS_S3_REGION')
    )
    s3_client.put_object(Bucket=os.getenv('AWS_S3_BUCKET_NAME'), Key=key, Body=data)
    downloadURL = f"https://{os.getenv('AWS_S3_BUCKET_NAME')}.s3.{os.getenv('AWS_S3_REGION')}.amazonaws.com/{key}"
    
    return downloadURL