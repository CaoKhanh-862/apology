import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"

try:
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        models = data.get('models', [])
        print(f"Total models: {len(models)}")
        
        image_models = []
        for m in models:
            # Check supported modalities if listed
            name = m.get('name', '')
            output_modalities = m.get('supportedOutputModalities', [])
            if 'IMAGE' in output_modalities:
                image_models.append(m)
        
        print(f"Models supporting IMAGE output: {len(image_models)}")
        for m in image_models:
            print(f"- {m.get('name')} ({m.get('displayName')})")
            print(f"  Version: {m.get('version')}")
            print(f"  Description: {m.get('description')}")
            
    else:
        print(f"Error: {res.status_code} - {res.text}")
except Exception as e:
    print(f"Exception: {e}")
