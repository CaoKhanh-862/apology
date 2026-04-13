import os
import base64
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Create a small blank image (1x1 red pixel) to use as input if needed
# But for image generation (Imagen style), usually it's just prompt or prompt + image
# Gemni 2.0 Flash supports generating images from text prompts when output modalities are set.

def test_gen(model_name):
    print(f"\nTesting {model_name}...")
    try:
        response = client.models.generate_content(
            model=model_name,
            contents="Generate a simple drawing of a pink heart.",
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            )
        )
        
        has_image = False
        if response.candidates:
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    print(f"Found image data in response! Mime type: {part.inline_data.mime_type}")
                    has_image = True
        
        if not has_image:
            print("No image data found in response.")
            # print(response)
            
    except Exception as e:
        print(f"Error with {model_name}: {e}")

test_gen("gemini-2.0-flash")
test_gen("gemini-3-pro-image-preview")
