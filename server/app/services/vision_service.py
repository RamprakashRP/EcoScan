import os
import requests

def classify_image_with_vision_api(image_url):
    api_key = os.environ.get("GOOGLE_VISION_API_KEY")

    endpoint = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"

    body = {
        "requests": [
            {
                "image": {"source": {"imageUri": image_url}},
                "features": [{"type": "LABEL_DETECTION", "maxResults": 5}]
            }
        ]
    }

    response = requests.post(endpoint, json=body)

    if response.status_code != 200 or 'error' in response.json():
        raise Exception(f"Vision API error: {response.json()}")

    labels = response.json()['responses'][0]['labelAnnotations']
    label_descriptions = [label['description'] for label in labels]

    print("Vision Labels:", label_descriptions)
    return label_descriptions
