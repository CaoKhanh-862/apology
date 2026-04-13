import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

API_KEY = "sk-ecnZLy75XzRYpWmUp4dZQUqGJbIWFsDNoyMRgSZTFsxWoEr5"

def send_req(url, body):
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode('utf-8'),
        method='POST',
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            print(f"{url} -> {res.status}")
            print(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"{url} -> {e.code}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"Error {url} -> {e}")

print("Testing OpenAI format...")
send_req("https://api.ai.cc/v1/chat/completions", {
    "model": "gemini-2.5-flash-image",
    "messages": [{"role": "user", "content": "Hello"}]
})

print("\nTesting Google format via proxy...")
send_req("https://api.ai.cc/v1beta/models/gemini-2.5-flash:generateContent", {
    "contents": [{"parts": [{"text": "Hello"}]}]
})
