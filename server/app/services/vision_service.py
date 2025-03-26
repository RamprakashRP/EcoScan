import os
import base64
import requests

def classify_image_with_vision_api(image_path_or_url):
    """
    Classify an image using Google Vision API. 
    If image_path_or_url is a URL (starts with "http"), uses the imageUri field.
    Otherwise, treats it as a local file path, encodes it in base64, and sends it via the content field.
    
    Returns a list of label descriptions from the image, 
    but only the second half of the labels generated (out of the 10 results).
    """
    api_key = os.environ.get("GOOGLE_VISION_API_KEY")
    if not api_key:
        raise Exception("Missing GOOGLE_VISION_API_KEY environment variable")
    
    endpoint = f"https://vision.googleapis.com/v1/images:annotate?key={api_key}"
    
    # Check if input is a URL or a local file path.
    if image_path_or_url.startswith("http"):
        image_request = {"source": {"imageUri": image_path_or_url}}
    else:
        with open(image_path_or_url, "rb") as image_file:
            encoded_content = base64.b64encode(image_file.read()).decode("utf-8")
        image_request = {"content": encoded_content}
    
    body = {
        "requests": [
            {
                "image": image_request,
                "features": [{"type": "LABEL_DETECTION", "maxResults": 10}]
            }
        ]
    }
    
    response = requests.post(endpoint, json=body)
    response_data = response.json()
    
    if response.status_code != 200 or 'error' in response_data:
        raise Exception(f"Vision API error: {response_data}")
    
    labels = response_data['responses'][0].get('labelAnnotations', [])
    # Calculate the halfway index and extract the second half of the labels
    half_index = len(labels) // 2
    second_half_labels = labels[half_index:]
    label_descriptions = [label['description'] for label in second_half_labels]
    
    print("Vision Labels (Second Half):", label_descriptions)
    return label_descriptions
