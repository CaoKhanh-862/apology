import os
import argparse
import sys
from dotenv import load_dotenv

# Try to import libraries, but handle if they are missing
try:
    from google import genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

try:
    import anthropic
    HAS_ANTHROPIC = True
except ImportError:
    HAS_ANTHROPIC = False

def check_gemini(api_key):
    if not HAS_GEMINI:
        print("Error: 'google-genai' library not installed.")
        return
    
    if not api_key:
        print("Error: Gemini API key not found in environment or .env file.")
        return

    print(f"Checking Gemini models with key: {api_key[:5]}...{api_key[-5:]}")
    try:
        client = genai.Client(api_key=api_key, http_options={'api_version': 'v1beta'})
        print("\nAvailable Gemini Models:")
        for model in client.models.list():
            print(f"- {model.name}")
    except Exception as e:
        print(f"Error checking Gemini models: {e}")

def check_openai(api_key):
    if not HAS_OPENAI:
        print("Error: 'openai' library not installed.")
        return
    
    if not api_key:
        print("Error: OpenAI API key not found in environment or .env file.")
        return

    print(f"Checking OpenAI models with key: {api_key[:5]}...{api_key[-5:]}")
    try:
        client = openai.OpenAI(api_key=api_key)
        models = client.models.list()
        print("\nAvailable OpenAI Models:")
        for m in models:
            print(f"- {m.id}")
    except Exception as e:
        print(f"Error checking OpenAI models: {e}")

def check_anthropic(api_key):
    if not HAS_ANTHROPIC:
        print("Error: 'anthropic' library not installed.")
        return
    
    if not api_key:
        print("Error: Anthropic API key not found in environment or .env file.")
        return

    print(f"Checking Anthropic models with key: {api_key[:5]}...{api_key[-5:]}")
    try:
        client = anthropic.Anthropic(api_key=api_key)
        models = client.models.list()
        print("\nAvailable Anthropic Models:")
        for m in models.data:
            print(f"- {m.id}")
    except Exception as e:
        print(f"Error checking Anthropic models: {e}")

def main():
    load_dotenv()
    
    parser = argparse.ArgumentParser(description="Check available AI models for different providers.")
    parser.add_argument("--provider", choices=["gemini", "openai", "anthropic", "all"], default="gemini",
                        help="The AI provider to check (default: gemini)")
    args = parser.parse_args()

    if args.provider == "gemini" or args.provider == "all":
        gemini_key = os.getenv("GEMINI_API_KEY")
        check_gemini(gemini_key)
        print("-" * 30)

    if args.provider == "openai" or args.provider == "all":
        openai_key = os.getenv("OPENAI_API_KEY")
        check_openai(openai_key)
        print("-" * 30)

    if args.provider == "anthropic" or args.provider == "all":
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        check_anthropic(anthropic_key)
        print("-" * 30)

if __name__ == "__main__":
    main()
