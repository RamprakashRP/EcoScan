import os
import google.generativeai as genai

def analyze_with_gemini(device_description):
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 2048,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    chat_session = model.start_chat(history=[])

    prompt = f"""
Given this device description: {device_description}

Analyze it for e-waste potential and return the analysis strictly in the following JSON format (fill in all fields dynamically):

{{
  "device_info": {{
    "name": "Name of the device or object in the image (e.g., smartphone, microwave, printer)",
    "estimated_age": "Estimated age or generation of the device (e.g., 3-5 years, vintage, latest)",
    "type": "Type or category of device (e.g., electronics, home appliance, gadget)",
    "image_url": "Public URL of the uploaded image"
  }},
  "eco_score": {{
    "score": "Overall eco-score from 0 to 100 based on repairability, recyclability, and toxicity",
    "repairability": "Score (0–100) showing how easy it is to repair this device",
    "recyclability": "Score (0–100) indicating how much of the device can be safely recycled",
    "toxicity": "Score (0–100) showing how toxic or harmful the components are",
    "resale_value": "Estimated resale potential or second-hand market value (0–100)",
    "environmental_impact": "Overall environmental burden caused if not disposed properly"
  }},
  "components": [
    {{
      "name": "Name of the component (e.g., battery, motherboard)",
      "material": "Material used in this part (e.g., lithium, copper, plastic)",
      "percentage": "Estimated % of device volume this part occupies (used for visual charts)"
    }}
  ],
  "toxic_components": [
    {{
      "name": "Toxic element (e.g., lead, mercury)",
      "risk_level": "Risk level (Low, Moderate, High)",
      "found_in": "Component where this is found (e.g., display, solder)"
    }}
  ],
  "recommendations": {{
    "repair": "true/false — Whether it's repairable",
    "reuse": "true/false — Whether parts are reusable",
    "recycle": "true/false — Whether it should be recycled",
    "repair_notes": "Short reason why repair is or isn't recommended",
    "reuse_notes": "Reason why reuse is possible or not",
    "recycle_notes": "Instructions for safe recycling"
  }},
  "disposal_guidelines": {{
    "battery": "How to safely dispose of batteries in this device",
    "plastic": "How to handle the plastic parts",
    "general": "Other critical safety/disposal instructions"
  }},
  "ai_summary": "One-paragraph natural language summary explaining what the user should know and do about the uploaded device."
}}
"""

    response = chat_session.send_message(prompt)
    print("Gemini API Response:", response.text)
    return response.text
