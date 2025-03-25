from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['ewaste_db']

class DeviceModel:
    def __init__(self, data):
        self.data = data

    def save(self):
        db.devices.insert_one(self.data)