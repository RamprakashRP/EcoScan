# server/app/routes/recycler_routes.py
from flask import Blueprint, request, jsonify
from ..services.maps_services import find_nearby_recyclers

bp_recyclers = Blueprint("recyclers", __name__)

@bp_recyclers.route("/nearby_recyclers", methods=["POST"])
def nearby_recyclers():
    data = request.get_json()
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({"error": "Missing latitude or longitude"}), 400

    try:
        recyclers = find_nearby_recyclers(latitude, longitude)
        return jsonify({"recyclers": recyclers})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
