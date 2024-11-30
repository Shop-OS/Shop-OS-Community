import os
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv

load_dotenv()

# username = os.getenv('MONGO_USERNAME')
# password = os.getenv('MONGO_PASSWORD')
# url = os.getenv('MONGO_URL')
uri = os.getenv('MONGO_URI')
client = MongoClient(uri)
db = client['hom']