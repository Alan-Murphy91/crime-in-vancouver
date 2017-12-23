import pandas as pd
from shapely.geometry import Point, shape

from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

def get_location(longitude, latitude, provinces_json):
    
    point = Point(longitude, latitude)

    for record in provinces_json['features']:
        polygon = shape(record['geometry'])
        if polygon.contains(point):
            return record['properties']['name']
    return 'other'


with open('input/geojson/vancouver.json') as data_file:    
    provinces_json = json.load(data_file)



app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'vancouver'
COLLECTION_NAME = 'crime'
FIELDS = {'_id': False, 'TYPE': True, 'YEAR': True, 'MONTH': True, 'DAY': True, 'HOUR': True, 'NEIGHBOURHOOD': True, 'X': True, 'Y': True, 'Latitude': True, 'Longitude': True} 

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data_function():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS, limit=600000)
    json_projects = []
    for project in projects:
        json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects

def panda():
    df['location'] = df.apply(lambda row: get_location(row['longitude'], row['latitude'], provinces_json), axis=1)
    cols_to_keep = ['longitude', 'latitude', 'location']
    df_clean = df[cols_to_keep].dropna()
    return df_clean.to_json(orient='records')    
    
if __name__ == "__main__":
    app.run()
