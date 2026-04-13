import os
import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# We know the API key from script.js
API_KEY = "AIzaSyBtxMCEWHByFa2-Y3tohWG5JDFeqfUem_4"

def list_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
    req = urllib.request.Request(url, method='GET')
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            print("Successfully fetched models.")
            for m in data.get('models', []):
                name = m.get('name')
                print(f"Model Name: {name}")
    except Exception as e:
        print(f"Error: {e}")
        try:
            print(e.read().decode('utf-8'))
        except:
            pass

if __name__ == "__main__":
    list_models()
