import os
import json
import time
import glob
from mongo import db
from datetime import datetime
from service.s3 import upload_to_s3
from service.sqs import pull_from_sqs, delete_message_from_sqs, push_to_generation_sqs, push_to_email_sqs

mongo_generations = db['generations']
generation_mails = db['generation_mails']

def generation_scanner():
  start_time = time.time()
  print("Generation Worker is running...")
  
  try:
    message = pull_from_sqs(target="generation")

    if not message:
      print("No generation messages in queue")
      return

    print(message)
    body = json.loads(message['Body'])
    generation = getGenerationDocument(message)
    if not generation:
      print("Generation not found")
      delete_message_from_sqs(message['ReceiptHandle'], target="generation")
      return
    else:
      if generation['download_url'] is not None:
        print("Generation has download_url")
      else:
        file_path = getFilePathFromFileName(generation['filename'])
        if not file_path:
          print("File not found")
        else:
          download_url = upload_to_s3(file_path[0])
          updateGenerationDocument(generation['generation_id'], generation['filename'], download_url, generation['user_email'])
    
    generations = list(getGenerationDocumentsByGenerationId(generation['generation_id']))
    if len(generations) == 0:
      print("Generations not found, exiting generation worker: ", generation['generation_id'], ", filename: ", generation['filename'])
      return
    
    all_have_download_urls = all(generation['download_url'] for generation in generations)
    generation_mail_document = generation_mails.find_one({"generation_id": generation['generation_id']})
    
    if generation_mail_document and generation_mail_document['mail_sent'] == "true":
      print("Mail already sent, exited generation worker: ", generation['generation_id'], ", filename: ", generation['filename'])
      delete_message_from_sqs(message['ReceiptHandle'], target="generation")

      return
    
    if all_have_download_urls:
      print("All generations have download urls", generation['generation_id'])  
      headline = None
      if body['type'] == "Apparel":    
        headline = "Apparel Shoots: "
      elif body['type'] == "Product":
        headline = "Product Background Enhancer: "
      elif body['type'] == "Background Change":
        headline = "Background Changer: "
      push_to_email_sqs(f"{headline} Your AI Generations are Ready!",
                        f"""
<pre style="font-family: Arial;">
Hiya,\n
A quick note to let you know that your recent {body['type']} generations are ready.

Here are the details:
- <b>Prompt:</b> {body['prompt']}
- <b>Generations:</b> Please find the images attached to this email.

We hope you enjoy your creations!

Regards,
House of Models
</pre>
                        """, 
                        generation['user_email'], 
                        [generation['download_url'] for generation in generations])
      delete_message_from_sqs(message['ReceiptHandle'], target="generation")
      if generation_mail_document:
        generation_mails.update_one({
          "generation_id": generation['generation_id']
        }, {
          "$set": {
            "generations": [generation['download_url'] for generation in generations],
            "mail_sent": "true"
          }
        })
        print("Mail sent, updated mongo doc, exited generation worker: ", generation['generation_id'], ", filename: ", generation['filename'])
      else:
        generation_mails.insert_one({
          "user_email": generation['user_email'],
          "generation_id": generation['generation_id'],
          "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z",
          "generations": [generation['download_url'] for generation in generations],
          "mail_sent": "true",
          "retry_count": 0
        })
        print("Mail sent, created mongo doc, exited generation worker: ", generation['generation_id'], ", filename: ", generation['filename'])
    else:
      if generation_mail_document:
        if generation_mail_document['retry_count'] > 1 or generation['download_url'] is not None:
          push_to_generation_sqs(generation['filename'], generation['user_email'], generation['generation_id'], body['type'], body['prompt'])
          delete_message_from_sqs(message['ReceiptHandle'], target="generation")
          generation_mails.delete_one({
            "generation_id": generation['generation_id']
          })
          print("Attempted to find generations 2 times, exited generation worker: ", generation['generation_id'], ", filename: ", generation['filename'])
          return
        else:
          generation_mails.update_one({
            "generation_id": generation['generation_id']
          }, {
            "$inc": {
              "retry_count": 1
            }
          })
          print("Retrying to find generations on next attempt: ", generation['generation_id'], ", filename: ", generation['filename'], "Attempt: ", generation_mail_document['retry_count'])
      else:
        generation_mails.insert_one({
          "user_email": generation['user_email'],
          "generation_id": generation['generation_id'],
          "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z",
          "generations": [generation['download_url'] for generation in generations],
          "mail_sent": "false",
          "retry_count": 0
        })
        print("Mail not sent as generation mail doc is absent and all doesen't have download urls, created mongo doc, exited generation worker: ", generation['generation_id'], ", filename: ", generation['filename'])
  except Exception as e:
    print("Error in generation worker: ", e)
  finally:
    end_time = time.time()
    print("Generation Worker is done: ", end_time - start_time, " seconds")
  


def updateGenerationDocument(generation_id, filename, download_url, user_email):
  mongo_generations.update_one({
    "user_email": user_email, 
    "generation_id": generation_id,
    "filename": filename
    }, {
    "$set": {
        "download_url": download_url,
        "timestamp": datetime.fromtimestamp(time.time()).isoformat() + "Z"
    }})
  return


def getFilePathFromFileName(filename):
  dir = os.path.join('/home/azureuser/workspace', 'ComfyUI', 'output')
  return glob.glob(os.path.join(dir, '*' + filename + '*'))

def getGenerationDocument(message):
  body = json.loads(message['Body'])

  generationId = body['generationId']  
  filename = body['filename']
  generation = mongo_generations.find_one({
    "generation_id": generationId,
    "filename": filename
  })
  
  if not generation:
    return None
  else:
    return generation
  
def getGenerationDocumentsByGenerationId(generationId):
  generations = mongo_generations.find({
    "generation_id": generationId
  })
  
  return generations