import google.generativeai as genai
import os
from PIL import Image
import io

# Configure API Key
API_KEY = "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"

# Using the requested model
MODEL_NAME = "gemini-2.0-flash-exp" # Assuming 'gemini-2.0-flash' maps to the experimental flash model or similar available. 
# Note: The user said "gemini 2.0 flash". The exact model string in the API might differ (e.g. gemini-2.0-flash-exp). 
# I will try to use a standard looking model name or list models if needed. 
# For now let's use "gemini-pro-vision" or "gemini-1.5-flash" as fallback references 
# but since user specifically asked for gemini 2.0 flash, I'll attempt using that name or closest available.
# Actually, the user provided an OpenAI-compatible key format 'sk-or-v1...' which looks like OpenRouter? 
# OR maybe it's a specific key format. 
# Wait, "sk-or-v1..." looks like OpenRouter. 
# "google-genai" library expects a Google AI Studio key.
# If the user provided an OpenRouter key, I might need to use `openai` client pointed to OpenRouter base URL.
# However, the user said "gemini 2.0 flash api key... use this model".
# Verification: "sk-or-" prefix is definitely OpenRouter.
# So I should use `openai` library or `requests` to hit OpenRouter API for Gemini 2.0 Flash.

import requests
import base64

OPENROUTER_API_KEY = API_KEY
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def verify_garbage(image_bytes):
    """
    Verifies if the image contains garbage/clean site using Gemini 2.0 Flash via OpenRouter.
    """
    base64_image = base64.b64encode(image_bytes).decode('utf-8')

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "google/gemini-2.0-flash-exp:free", # Using common OpenRouter ID for Gemini 2 Flash. Or just 'google/gemini-2.0-flash-exp'
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Answer with only YES or NO. Does this image show a clean street or a cleaned garbage point? If it shows a pile of garbage, answer NO. If it is clean, answer YES."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    }

    # Attempting to use the specific model requested
    # The user said "gemini 2.0 flash". On OpenRouter it's usually `google/gemini-2.0-flash-exp:free` or similar.
    # I'll try `google/gemini-2.0-flash-exp:free`.
    
    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        content = result['choices'][0]['message']['content'].strip().upper()
        return "YES" in content
    except Exception as e:
        print(f"AI Verification Failed: {e}")
        # Fallback to True in case of AI error to not block operations, or False? 
        # User wants verification. Safe fail might be True for demo or False. 
        # Let's return False and log error.
        return False
