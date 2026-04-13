import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

models_to_try = [
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-image-preview",
    "gemini-2.0-flash",
    "gemini-1.5-flash"
]

def test_model(model_name):
    print(f"\n>>>> Testing {model_name} <<<<")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    body = {
        "contents": [{
            "parts": [
                {"text": "A cute chibi cat."}
            ]
        }],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "temperature": 1
        }
    }
    
    try:
        res = requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(body))
        print(f"Status Code: {res.status_code}")
        if res.status_code == 200:
            print(f"SUCCESS: {model_name} works for image generation!")
            return True
        else:
            print(f"FAILED: {res.status_code}")
            # print(res.text)
    except Exception as e:
        print(f"EXCEPTION: {e}")
    return False

for m in models_to_try:
    if test_model(m):
        break
