import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

models_to_check = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-image-preview"
]

for model_name in models_to_check:
    print(f"\n--- Checking {model_name} ---")
    try:
        model = client.models.get(model=model_name)
        # Try to access attributes safely
        methods = getattr(model, 'supported_generation_methods', 'N/A')
        modalities = getattr(model, 'output_modalities', 'N/A')
        print(f"Supported methods: {methods}")
        print(f"Output modalities: {modalities}")
    except Exception as e:
        print(f"Error checking {model_name}: {e}")
