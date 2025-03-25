# server/app/routes/analyze_routes.py
from flask import Blueprint, request, jsonify

bp = Blueprint('analyze_routes', __name__)

@bp.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to EcoScan API'}), 200

@bp.route('/api/devices', methods=['POST'])
def add_device():
    data = request.get_json()
    image_url = data.get('image_url')
    analysis_results = analyze_device(image_url)
    if 'error' in analysis_results:
        return jsonify({'message': 'Failed to analyze device', 'error': analysis_results['error']}), 500
    device = DeviceModel(analysis_results)
    device.save()
    return jsonify({'message': 'Device added successfully', 'analysis': analysis_results}), 201