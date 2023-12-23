import { useState } from "react";
import * as d3 from "d3";
import "./Map.css";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

export default function Map({
	stationsJSON,
	origin,
	setOrigin,
	route,
	setRoute,
}) {
	const [isLoaded, setIsLoaded] = useState(false);

	function zoomToStation() {
		if (origin) {
			setTimeout(() => {
				d3.select(`#${origin.id}`).dispatch("click");
			}, 500);
		}
	}

	zoomToStation();

	let mapContainer, width, height, scaleExtent, zoom;

	function disableStation(routeString, station) {
		if (!routeString) {
			return false;
		}
		if (routeString === "Silver-Service_Palmetto") {
			return !["Palmetto", "Silver-Meteor", "Silver-Star"].some((train) =>
				station.routes.includes(train)
			);
		} else {
			return !station.routes.includes(routeString);
		}
	}

	setTimeout(() => {
		mapContainer = document.querySelector("#map-container");
		width = mapContainer.clientWidth - 32;
		height = mapContainer.clientHeight - 52;
		scaleExtent = 20;
		zoom = d3
			.zoom()
			.scaleExtent([1, scaleExtent])
			.on("zoom", ({ transform }) => {
				const zoomOutButton = document.querySelector("#zoom-out-button");
				zoomOutButton.style.cursor = transform.k === 1 ? "default" : "pointer";
				zoomOutButton.style.opacity = transform.k === 1 ? 0 : 1;
				zoomOutButton.style.pointerEvents = transform.k === 1 ? "none" : "auto";
				const station = d3.select(".station[origin='true']");
				let duration = 0;
				if (!station.empty() && station.attr("time")) {
					if (new Date().getTime() - Number(station.attr("time")) > 2000) {
						station.attr("time", null);
					} else {
						duration = 500;
					}
				} else if (transform.k <= 1.1) {
					station.attr("time", new Date().getTime());
					duration = 500;
				}
				d3.selectAll("#routes, #states, .station")
					.transition()
					.duration(duration)
					.attr(
						"transform",
						`translate(${[
							Math.min(0, Math.max(transform.x, width - width * transform.k)),
							Math.min(0, Math.max(transform.y, height - height * transform.k)),
						]})scale(${transform.k})`
					);
				d3.selectAll(".state")
					.transition()
					.duration(duration)
					.attr("stroke-width", transform.k <= 1.1 ? 0.5 : 2 / transform.k);
				const routeElement = d3.select(".route[route='true'");
				let routeString = "";
				if (!routeElement.empty()) {
					routeString = routeElement.attr("id");
				}
				d3.selectAll(".route[selected='false']")
					.transition()
					.duration(duration)
					.attr("stroke", "red")
					.attr("stroke-width", transform.k <= 1.1 ? 2 : 5 / transform.k);
				d3.selectAll(".route[selected='true']")
					.transition()
					.duration(duration)
					.attr("stroke", "#89B3F7")
					.attr("stroke-width", transform.k <= 1.1 ? 2 : 10 / transform.k);
				d3.selectAll(".station").each((station) => {
					if (!disableStation(routeString, station)) {
						d3.select(`#${station.id}`).raise();
					}
				});
				d3.selectAll(".station[selected='false'] circle")
					.transition()
					.duration(duration)
					.attr("r", (d) =>
						transform.k <= 1.1 || disableStation(routeString, d)
							? 3 / transform.k
							: 15 / transform.k
					)
					.attr("stroke-width", (d) =>
						transform.k <= 1.1 || disableStation(routeString, d)
							? 0.5 / transform.k
							: 2 / transform.k
					);
				d3.selectAll(".station[selected='true'] circle")
					.transition()
					.duration(duration)
					.attr("r", (d) =>
						transform.k <= 1.1 || disableStation(routeString, d)
							? 3 / transform.k
							: 30 / transform.k
					)
					.attr("stroke-width", (d) =>
						transform.k <= 1.1 || disableStation(routeString, d)
							? 0.5 / transform.k
							: 4 / transform.k
					);
				d3.selectAll(".station[selected='false'] text")
					.transition()
					.duration(duration)
					.attr("font-size", (d) =>
						transform.k <= 1.1 || disableStation(routeString, d)
							? 0
							: 10 / transform.k
					);
				d3.selectAll(".station[selected='true'] text")
					.transition()
					.duration(duration)
					.attr("font-size", (d) =>
						transform.k <= 1.1 || disableStation(routeString, d)
							? 0
							: 20 / transform.k
					);
			});
	}, 0);

	function routeMouseout(d) {
		const prevRoute = d3.select(`#${d.id}`);
		if (prevRoute.attr("route") === "false") {
			prevRoute
				.attr("stroke", "red")
				.attr("stroke-width", prevRoute.attr("stroke-width") / 2)
				.attr("selected", "false");
		}
	}

	function stationMouseout(d) {
		const prevStation = d3.select(`#${d.id}`);
		if (prevStation.attr("origin") === "false") {
			prevStation.attr("selected", "false");
			const circle = prevStation.selectChild("circle");
			const text = prevStation.selectChild("text");
			circle
				.attr("r", circle.attr("r") / 2)
				.attr("stroke-width", circle.attr("stroke-width") / 2);
			text.attr("font-size", text.attr("font-size") / 2);
		}
	}

	if (!isLoaded && stationsJSON.length > 0) {
		setIsLoaded(true);

		const projection = d3.geoAlbersUsa();

		d3.json("/json/states.json").then((states) => {
			projection.fitSize([width, height], states);
			const geoGenerator = d3.geoPath(projection);

			function clicked(e, d) {
				const element = d3.select(this);
				if (element.attr("class") === "route") {
					if (element.attr("route") === "true") {
						return;
					}
					const prevRoute = d3.select(".route[route='true']");
					if (!prevRoute.empty()) {
						prevRoute.attr("route", "false");
						routeMouseout({ id: prevRoute.attr("id") });
					}
					element.attr("selected", "true").attr("route", "true");
					setRoute(d.id);
				} else {
					if (element.attr("origin") === "true") {
						return;
					}
					const prevStation = d3.select(".station[origin='true']");
					if (!prevStation.empty()) {
						prevStation.attr("origin", "false");
						stationMouseout({ id: prevStation.attr("id") });
					}
					element.attr("selected", "true").attr("origin", "true").raise();
					setOrigin(stationsJSON.find((station) => station.id === d.id));
				}

				const [[x0, y0], [x1, y1]] = geoGenerator.bounds(d);
				e.stopPropagation();
				svg
					.transition()
					.duration(2000)
					.call(
						zoom.transform,
						d3.zoomIdentity
							.translate(width / 2, height / 2)
							.scale(
								Math.min(
									scaleExtent / 2,
									0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)
								)
							)
							.translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
					);
			}

			const svg = d3.select("#map-svg").call(zoom);
			svg
				.append("g")
				.attr("id", "states")
				.selectAll("path")
				.data(states.features)
				.join("path")
				.attr("d", geoGenerator)
				.attr("fill", "rgb(54, 55, 58)")
				.attr("stroke", "rgba(255, 255, 255, 0.25)")
				.attr("class", "state")
				.attr("id", (d) => d.id);

			d3.json("/json/routes.json").then((routes) => {
				svg
					.append("g")
					.attr("id", "routes")
					.selectAll("path")
					.data(routes.features)
					.join("path")
					.attr("d", geoGenerator)
					.attr("fill", "transparent")
					.attr("stroke", "red")
					.attr("stroke-width", 2)
					.attr("cursor", "pointer")
					.attr("route", "false")
					.attr("selected", "false")
					.attr("class", "route")
					.attr("id", (d) => d.id)
					.on("mouseover", (e, d) => {
						const newRoute = d3.select(`#${d.id}`);
						if (newRoute.attr("selected") === "false") {
							newRoute.attr("selected", "true");
							newRoute
								.attr("stroke", "#89B3F7")
								.attr("stroke-width", newRoute.attr("stroke-width") * 2);
						}
					})
					.on("mouseout", (e, d) => routeMouseout(d))
					.on("click", clicked);

				const stationsGeoJSON = {
					type: "FeatureCollection",
					features: [],
				};
				for (const station of stationsJSON) {
					stationsGeoJSON.features.push({
						type: "Feature",
						geometry: {
							type: "Point",
							coordinates: [station.lon, station.lat],
						},
						id: station.id,
						routes: JSON.stringify(station.routes),
					});
				}
				const station = svg
					.append("g")
					.attr("id", "stations")
					.selectAll("g")
					.data(stationsGeoJSON.features)
					.join("g")
					.attr("cursor", "pointer")
					.attr("origin", "false")
					.attr("routes", (d) => d.routes)
					.attr("selected", "false")
					.attr("class", "station")
					.attr("id", (d) => d.id)
					.on("click", clicked);
				station
					.append("circle")
					.attr("cx", (d) => projection(d.geometry.coordinates)[0])
					.attr("cy", (d) => projection(d.geometry.coordinates)[1])
					.attr("r", 3)
					.attr("fill", "#89B3F7")
					.attr("stroke", "white")
					.attr("stroke-width", 0.5)
					.on("mouseover", (e, d) => {
						const station = d3.select(`#${d.id}`);
						if (station.attr("selected") === "false") {
							station.attr("selected", "true").raise();
							const circle = station.selectChild("circle");
							const text = station.selectChild("text");
							circle
								.attr("r", circle.attr("r") * 2)
								.attr("stroke-width", circle.attr("stroke-width") * 2);
							text.attr("font-size", text.attr("font-size") * 2);
						}
					})
					.on("mouseout", (e, d) => stationMouseout(d));
				station
					.append("text")
					.attr("x", (d) => projection(d.geometry.coordinates)[0])
					.attr("y", (d) => projection(d.geometry.coordinates)[1])
					.attr("dy", ".35em")
					.attr("text-anchor", "middle")
					.attr("font-size", 0)
					.attr("font-weight", "bold")
					.attr("pointer-events", "none")
					.text((d) => d.id);

				zoomToStation();
			});
		});
	}

	function reset() {
		if (origin) {
			setOrigin(null);
			const station = d3.select(".station[origin='true']");
			station.attr("origin", "false");
			stationMouseout({ id: station.attr("id") });
		}
		if (route) {
			setRoute("");
			const prevRoute = d3.select(".route[route='true']");
			prevRoute.attr("route", "false");
			routeMouseout({ id: prevRoute.attr("id") });
		}
		d3.select("#map-svg").call(zoom.transform, d3.zoomIdentity.scale(1));
	}

	return (
		<div id="map-container">
			<svg id="map-svg"></svg>
			{route && (
				<div id="route-box">{route.replace(/-/g, " ").replace(/_/g, "/")}</div>
			)}
			<ZoomOutMapIcon id="zoom-out-button" onClick={reset} />
		</div>
	);
}
