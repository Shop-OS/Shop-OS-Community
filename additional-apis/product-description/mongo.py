import os
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv('MONGO_URI')
client = MongoClient(uri)
db = client['hom']