"""
Test NEW HF router endpoint.
"""
import os
import urllib.request
import urllib.error
import base64
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
HF_TOKEN = os.environ.get("HF_TOKEN", "")  # Set HF_TOKEN in your .env file
TINY_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADklEQVQI12P4z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=="

def post(url, payload):
    print(f"\n==> {url[:80]}")
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json",
        }
    )
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as res:
            ct = res.headers.get("Content-Type", "")
            body = res.read()
            print(f"  200 OK | CT: {ct} | Size: {len(body)}")
            if b'\x89PNG' in body[:8] or body[:3] == b'\xff\xd8\xff' or b'image' in ct.encode():
                print("  ✅ IMAGE!")
                return True
            try:
                print("  JSON:", json.loads(body)[:200] if isinstance(body, bytes) else body[:200])
            except:
                print("  Body:", body[:200])
    except urllib.error.HTTPError as e:
        print(f"  {e.code}: {e.read()[:200]}")
    except Exception as ex:
        print(f"  ERR: {ex}")
    return False

BASE = "https://router.huggingface.co"

# FLUX schnell text2img via router
post(f"{BASE}/hf-inference/models/black-forest-labs/FLUX.1-schnell", {
    "inputs": "kawaii chibi anime character, cat ears, big eyes, cute, pastel colors, white background"
})

# instruct-pix2pix via router
post(f"{BASE}/hf-inference/models/timbrooks/instruct-pix2pix", {
    "inputs": TINY_PNG_B64,
    "parameters": {
        "prompt": "kawaii chibi anime character, cat ears, big eyes, cute",
        "guidance_scale": 7.5,
        "image_guidance_scale": 1.5,
        "num_inference_steps": 20,
    }
})

# stabilityai sd img2img via router
post(f"{BASE}/hf-inference/models/runwayml/stable-diffusion-v1-5", {
    "inputs": "kawaii chibi anime character, cat ears, big eyes, cute, white background"
})
