# server/app/__init__.py
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/ewaste_db'

client = MongoClient(app.config['MONGO_URI'])
db = client['ewaste_db']

from .routes import analyze_routes  # Use relative import
app.register_blueprint(analyze_routes.bp)

if __name__ == '__main__':
    app.run(debug=True)