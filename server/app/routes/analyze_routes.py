from flask import Blueprint, request, jsonify
from ..services.vision_service import classify_image_with_vision_api
from ..services.gemini_service import analyze_with_gemini


bp = Blueprint("analyze_bp", __name__)

@bp.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        image_url = data.get("image_url")
        if not image_url:
            return jsonify({"error": "Missing image URL"}), 400

        # Use vision first to classify
        from ..services.vision_service import classify_image_with_vision_api
        from ..services.gemini_service import analyze_with_gemini

        labels = classify_image_with_vision_api(image_url)
        description = ", ".join(labels)
        result = analyze_with_gemini(description)

        return jsonify({"labels": labels, "result": result})
    except Exception as e:
        print("❌ Error in /api/analyze:", str(e))
        return jsonify({"error": str(e)}), 500

