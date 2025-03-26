from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB config
app.config['MONGO_URI'] = 'mongodb://localhost:27017/ewaste_db'
client = MongoClient(app.config['MONGO_URI'])
db = client['ewaste_db']

# Register API routes
from .routes import analyze_routes
app.register_blueprint(analyze_routes.bp, url_prefix="/api")
