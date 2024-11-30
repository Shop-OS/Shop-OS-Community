from flask import Blueprint
from bs4 import BeautifulSoup
import requests

scrape = Blueprint('scrape', __name__)

@scrape.route('/api/scrape', methods=['GET'])
def getNameAndDescription():
    response = requests.get('https://www.flipkart.com/p/p/p?pid=MOBGWH8STKHPCKGN')
    soup = BeautifulSoup(response.text, 'html.parser')
    # print(response.text)

    nameElements = soup.find_all(class_='B_NuCI')
    name = nameElements[0].text
    
    descriptionElements = soup.find_all(class_='_1mXcCf')
    description = descriptionElements[0].text
    
    images = soup.select('._2FHWw4 img')
    unique_images = set()    
    print(f'Total Images: {len(images)}')
    for img in images:
        unique_images.add(img['src'].split('?')[0].replace('/128/128/', '/2048/2048/'))

    return {
        'name': name,
        'description': description,
        'images': list(unique_images)
    }