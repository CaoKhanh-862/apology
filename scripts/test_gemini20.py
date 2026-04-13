import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

API_KEY = "AIzaSyBtxMCEWHByFa2-Y3tohWG5JDFeqfUem_4"

def test_model(model):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    req = urllib.request.Request(
        url,
        data=json.dumps({
            "contents": [{"parts": [{"text": "Generate a picture of a cute chibi cat."}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]}
        }).encode('utf-8'),
        method='POST',
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"SUCCESS {model}")
            # print snippet
            if 'candidates' in data:
                parts = data['candidates'][0]['content']['parts']
                for p in parts:
                    if 'inlineData' in p or 'inline_data' in p:
                        print("  Found image in response!")
                        return True
            print("  No image found.")
    except Exception as e:
        print(f"FAILED {model}: {e}")
        try:
            print("  " + e.read().decode('utf-8')[:200])
        except:
            pass

if __name__ == "__main__":
    test_model("gemini-2.0-flash")
    test_model("gemini-2.5-flash")
    test_model("imagen-4.0-generate-001")
    test_model("gemini-2.0-flash-lite")
