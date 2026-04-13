import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

model_name = "gemini-2.5-flash-image"
url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}?key={api_key}"

try:
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        print(json.dumps(data, indent=2))
    else:
        print(f"Error: {res.status_code} - {res.text}")
except Exception as e:
    print(f"Exception: {e}")
