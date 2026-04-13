from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import urllib.request
import urllib.error
import base64
import json
import ssl
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load env
HF_TOKEN = os.environ.get("HF_TOKEN", "")  # Set HF_TOKEN in your .env file

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

PROMPT = (
    "kawaii chibi anime character, fluffy cat ears on head, oversized round head, "
    "big glossy sparkly eyes, rosy blushing cheeks, tiny nose, stubby hands, "
    "cozy pastel hoodie, soft pastel color palette, clean black outlines, "
    "anime cell-shading, simple white background, high quality sticker style, "
    "no text, no watermark"
)

NEGATIVE_PROMPT = (
    "realistic, photo, 3d, ugly, deformed, bad anatomy, extra limbs, "
    "watermark, text, nsfw, blurry"
)

class ImgReq(BaseModel):
    base64Jpeg: str  # base64 của ảnh gốc từ camera

def hf_post(url: str, payload: dict) -> bytes:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json",
            "X-Use-Cache": "0",
        }
    )
    with urllib.request.urlopen(req, context=ctx, timeout=60) as res:
        return res.read()

@app.post("/api/generate")
def generate_image(req: ImgReq):
    """
    Endpoint nhận ảnh base64 từ camera, gọi HF instruct-pix2pix để biến 
    thành chibi mèo. Nếu model đang load, fallback sang FLUX text2img.
    """
    try:
        # ── Thử img2img: instruct-pix2pix (giữ khuôn mặt gốc, biến thành chibi) ──
        img_b64 = req.base64Jpeg
        
        img_payload = {
            "inputs": img_b64,
            "parameters": {
                "prompt": PROMPT,
                "negative_prompt": NEGATIVE_PROMPT,
                "guidance_scale": 8.0,
                "image_guidance_scale": 1.3,
                "num_inference_steps": 25,
                "strength": 0.75,
            }
        }
        
        try:
            img_bytes = hf_post(
                "https://router.huggingface.co/hf-inference/models/timbrooks/instruct-pix2pix",
                img_payload
            )
            b64 = base64.b64encode(img_bytes).decode()
            return {"result": f"data:image/jpeg;base64,{b64}", "model": "instruct-pix2pix"}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode()
            # Model đang load hoặc không hỗ trợ → fallback
            if e.code in (503, 404):
                raise ValueError(f"instruct-pix2pix unavailable: {err_body}")
            raise
            
    except Exception as e1:
        # ── Fallback: FLUX.1-schnell text2img (luôn hoạt động, không cần ảnh gốc) ──
        try:
            flux_payload = {
                "inputs": PROMPT,
                "parameters": {
                    "guidance_scale": 3.5,
                    "num_inference_steps": 4,
                    "width": 512,
                    "height": 512,
                }
            }
            img_bytes = hf_post(
                "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
                flux_payload
            )
            b64 = base64.b64encode(img_bytes).decode()
            return {"result": f"data:image/jpeg;base64,{b64}", "model": "flux-schnell"}
        except Exception as e2:
            raise HTTPException(
                status_code=500,
                detail=f"Both models failed. img2img: {e1}. FLUX: {e2}"
            )
