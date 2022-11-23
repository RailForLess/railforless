from bs4 import BeautifulSoup
import requests
import sqlite3

url = "https://en.wikipedia.org/wiki/List_of_Amtrak_stations"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

station_info = list()
for row in soup.findAll('table')[1].tbody.findAll('tr')[1:]:
    station_name = row.findAll("td")[0].findAll("a")[0].contents[0]
    station_code = row.findAll("td")[1].contents[0].rstrip()
    station_state = row.findAll("td")[3].findAll("a")[0].contents[0]
    station_info.append((station_name, station_code, station_state))

conn = sqlite3.connect("./stations.db")
c = conn.cursor()
c. execute(""" CREATE TABLE IF NOT EXISTS stations (
    name text,
    code text,
    state text
);""")
c.execute("DELETE FROM stations")
for info in station_info:
    c.execute(
        f'INSERT INTO stations VALUES ("{info[0]}", "{info[1]}", "{info[2]}")')
conn.commit()
conn.close()
