import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

API_KEY = "AIzaSyBtxMCEWHByFa2-Y3tohWG5JDFeqfUem_4"

def test_model(model):
    print(f"\n--- Testing {model} ---")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    req = urllib.request.Request(
        url,
        data=json.dumps({
            "contents": [{"parts": [{"text": "A tiny cute cat."}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]}
        }).encode('utf-8'),
        method='POST',
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            print("SUCCESS")
            # Limit output length
            print(str(data)[:200])
    except urllib.error.HTTPError as e:
        print(f"FAILED: {e.code}")
        try:
            err_data = json.loads(e.read().decode('utf-8'))
            print("  " + err_data.get('error', {}).get('message', str(err_data)))
        except:
            pass

if __name__ == "__main__":
    test_model("gemini-2.5-flash-image")
    test_model("gemini-3-pro-image-preview")
    test_model("gemini-3.1-flash-image-preview")
