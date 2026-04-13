import urllib.request
import json
import ssl
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

API_KEY = "AIzaSyBtxMCEWHByFa2-Y3tohWG5JDFeqfUem_4"

def test_model(model):
    print(f"\n--- Testing {model} ---")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    # Small 1x1 base64 GIF or PNG just to test vision
    pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" 
    req = urllib.request.Request(
        url,
        data=json.dumps({
            "contents": [{"parts": [
                {"inlineData": {"mimeType": "image/png", "data": pixel}},
                {"text": "Describe the contents of this image."}
            ]}]
        }).encode('utf-8'),
        method='POST',
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            print("SUCCESS")
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(text)
    except urllib.error.HTTPError as e:
        print(f"FAILED: {e.code}")
        try:
            print(e.read().decode('utf-8'))
        except:
            pass

if __name__ == "__main__":
    test_model("gemini-2.5-flash")
    test_model("gemini-2.0-flash")
