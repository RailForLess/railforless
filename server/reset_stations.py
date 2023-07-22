from bs4 import BeautifulSoup
import requests
import sqlite3

url = "https://en.wikipedia.org/wiki/List_of_Amtrak_stations"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

stations = list()
names = list()
for row in soup.findAll('table')[1].tbody.findAll('tr')[1:]:
    name = row.findAll("td")[0].findAll("a")[0].contents[0]
    code = row.findAll("td")[1].contents[0].rstrip()
    state = row.findAll("td")[3].findAll("a")[0].contents[0]
    name += f" ({state})"
    routes_html = row.findAll("td")[4].findAll("a")
    routes = ""
    for route in routes_html:
        route = route.contents
        formatted_routes = ""
        for route_component in route:
            try:
                route_component = route_component.contents[0]
            except:
                pass
            formatted_routes += route_component
        formatted_routes = formatted_routes.split(" and ")
        for formatted_route in formatted_routes:
            routes += formatted_route + ","
    stations.append([name, code, routes])

conn = sqlite3.connect("./stations.db")
c = conn.cursor()
c. execute(""" CREATE TABLE IF NOT EXISTS stations (
    name text,
    code text,
    routes text
);""")
c.execute("DELETE FROM stations")
for station in stations:
    c.execute(
        f'INSERT INTO stations VALUES ("{station[0]}", "{station[1]}", "{station[2]}")')
conn.commit()
conn.close()
