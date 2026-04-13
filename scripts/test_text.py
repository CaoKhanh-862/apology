import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

model_name = "gemini-2.0-flash"
url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"

body = {
    "contents": [{
        "parts": [
            {"text": "Hello, are you there?"}
        ]
    }]
}

try:
    res = requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(body))
    print(f"Status Code: {res.status_code}")
    if res.status_code == 200:
        print("Success! Response:")
        print(res.json())
    else:
        print(f"Error: {res.text}")
except Exception as e:
    print(f"Exception: {e}")
