from flask import Flask
# uncomment the line below when developing on Windows
# from flask_cors import CORS
import sqlite3
import pickle

app = Flask(__name__)
# uncomment the line below when developing on Windows
# CORS(app)


@app.route("/api/stations")
def stations():
    conn = sqlite3.connect(
        "./stations.db")
    c = conn.cursor()
    c.execute("SELECT name, state from stations")
    rows = c.fetchall()
    stations = list(map(lambda row: row[0], rows))
    station_info = list()
    for row in rows:
        data = ""
        data = row[0]
        if (stations.count(row[0]) > 1):
            data += f' ({row[1]})'
        station_info.append(data)
    conn.close()
    return {"stations": station_info}


@app.route("/api/status")
def status():
    with open("./status.pk", "rb") as pk:
        return {"status": pickle.load(pk)}


app.run()
