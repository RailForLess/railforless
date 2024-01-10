import { useEffect, useState } from "react";
import * as d3 from "d3";
import "./Map.css";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

export default function Map({
	stationsJSON,
	origin,
	setOrigin,
	destination,
	setDestination,
	updateMap,
	route,
	setRoute,
}) {
	const [loaded, setLoaded] = useState(false);
	const silverService = ["Palmetto", "Silver-Meteor", "Silver-Star"];

	const getRouteID = (route) =>
		silverService.includes(route) ? "Silver-Service_Palmetto" : route;

	useEffect(() => {
		setTimeout(() => {
			if (route && route !== "Any-route") {
				d3.select(`#${getRouteID(route)}`).dispatch("click");
			}
		}, 400);
	}, []);

	useEffect(() => {
		const prevOriginElement = d3.select(".station[origin='true']");
		const prevDestinationElement = d3.select(".station[destination='true']");
		if (origin) {
			if (!prevOriginElement.empty()) {
				if (prevOriginElement.id !== origin.id) {
					if (!prevDestinationElement.empty()) {
						prevDestinationElement.dispatch("click");
					}
					prevOriginElement.dispatch("click");
					d3.select(`#${origin.id}`).dispatch("click");
					prevDestinationElement.dispatch("click");
				}
			} else {
				d3.select(`#${origin.id}`).dispatch("click");
			}
			if (destination) {
				if (!prevDestinationElement.empty()) {
					if (prevDestinationElement.id !== destination.id) {
						prevDestinationElement.dispatch("click");
					}
				}
				d3.select(`#${destination.id}`).dispatch("click");
			}
		}
	}, [updateMap]);

	let mapContainer, width, height, scaleExtent, zoom;

	function disableStation(routeString, station) {
		if (routeString === "Any-route") {
			return false;
		}
		if (routeString === "Silver-Service_Palmetto") {
			return !silverService.some((route) => station.routes.includes(route));
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
				if (!zoomOutButton) {
					return;
				}
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
				} else if (transform.k === 1) {
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
					.attr("stroke-width", transform.k === 1 ? 0.5 : 2 / transform.k);
				const routeElement = d3.select(".route[route='true']");
				let routeString = "Any-route";
				if (!routeElement.empty()) {
					routeString = routeElement.attr("id");
				}
				d3.selectAll(".route[selected='false']")
					.transition()
					.duration(duration)
					.attr("stroke", "red")
					.attr("stroke-width", transform.k === 1 ? 2 : 5 / transform.k);
				d3.selectAll(".route[selected='true']")
					.transition()
					.duration(duration)
					.attr("stroke", "#89B3F7")
					.attr("stroke-width", transform.k === 1 ? 2 : 10 / transform.k);
				d3.selectAll(".station[selected='true']").each((station) => {
					const stationElement = d3.select(`#${station.id}`);
					if (
						stationElement.attr("origin") === "false" &&
						stationElement.attr("destination") === "false"
					) {
						stationElement.attr("selected", "false");
					}
				});
				d3.selectAll(".station").each((station) => {
					if (!disableStation(routeString, station)) {
						d3.select(`#${station.id}`).raise();
					}
				});
				d3.selectAll(".station[selected='false'] circle")
					.transition()
					.duration(duration)
					.attr("r", (d) =>
						transform.k === 1 || disableStation(routeString, d)
							? 3 / transform.k
							: 15 / transform.k
					)
					.attr("stroke", "black")
					.attr("stroke-width", (d) =>
						transform.k === 1 || disableStation(routeString, d)
							? 0.5 / transform.k
							: 2 / transform.k
					);
				d3.selectAll(".station[selected='true'] circle")
					.transition()
					.duration(duration)
					.attr("r", (d) =>
						transform.k === 1 || disableStation(routeString, d)
							? 3 / transform.k
							: 30 / transform.k
					)
					.attr("stroke", "white")
					.attr("stroke-width", (d) =>
						transform.k === 1 || disableStation(routeString, d)
							? 0.5 / transform.k
							: 4 / transform.k
					);
				d3.selectAll(".station[selected='false'] text")
					.transition()
					.duration(duration)
					.attr("font-size", (d) =>
						transform.k === 1 || disableStation(routeString, d)
							? 0
							: 10 / transform.k
					);
				d3.selectAll(".station[selected='true'] text")
					.transition()
					.duration(duration)
					.attr("font-size", (d) =>
						transform.k === 1 || disableStation(routeString, d)
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
		prevStation.attr("selected", "false");
		const circle = prevStation.selectChild("circle");
		const text = prevStation.selectChild("text");
		circle
			.attr("r", circle.attr("r") / 2)
			.attr("stroke", "black")
			.attr("stroke-width", circle.attr("stroke-width") / 2);
		text.attr("font-size", text.attr("font-size") / 2);
	}

	function getRouteBounds(originElement, destinationElement) {
		const x0 = Number(originElement.selectChild("circle").attr("cx"));
		const y0 = Number(originElement.selectChild("circle").attr("cy"));
		const x1 = Number(destinationElement.selectChild("circle").attr("cx"));
		const y1 = Number(destinationElement.selectChild("circle").attr("cy"));
		return [
			[x0, y0],
			[x1, y1],
		];
	}

	if (!loaded && stationsJSON.length > 0) {
		setLoaded(true);

		const projection = d3.geoAlbersUsa();

		d3.json("/json/states.json").then((states) => {
			projection.fitSize([width, height], states);
			const geoGenerator = d3.geoPath(projection);

			function clicked(e, d) {
				let x0, y0, x1, y1;
				const element = d3.select(this);
				if (element.attr("class") === "route") {
					if (element.attr("route") === "true") {
						setRoute("Any-route");
						element.attr("route", "false");
						routeMouseout({ id: element.attr("id") });
						d3.select("#map-svg").call(
							zoom.transform,
							d3.zoomIdentity.scale(1)
						);
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
						setOrigin(null);
						element.attr("origin", "false").attr("selected", "false");
						return;
					} else if (element.attr("destination") === "true") {
						setDestination(null);
						element.attr("destination", "false").attr("selected", "false");
						return;
					}
					const station = stationsJSON.find((station) => station.id === d.id);
					const prevRoute = d3.select(".route[route='true']");
					if (
						!prevRoute.empty() &&
						!station.routes.includes(prevRoute.attr("id"))
					) {
						setRoute("Any-route");
						prevRoute.attr("route", "false");
						routeMouseout({ id: prevRoute.attr("id") });
					}
					const originElement = d3.select(".station[origin='true']");
					const destinationElement = d3.select(".station[destination='true']");
					if (!originElement.empty()) {
						if (!destinationElement.empty()) {
							destinationElement.attr("destination", "false");
							stationMouseout({ id: destinationElement.attr("id") });
						}
						element
							.attr("selected", "true")
							.attr("destination", "true")
							.raise();
						setDestination(station);
						const mutualRoutes = JSON.parse(
							originElement.attr("routes")
						).filter((route) => station.routes.includes(route));
						if (mutualRoutes.length === 1) {
							console.log(mutualRoutes[0]);
							setRoute(mutualRoutes[0]);
							const prevRoute = d3.select(".route[route='true']");
							if (!prevRoute.empty()) {
								prevRoute.attr("route", "false");
								routeMouseout({ id: prevRoute.attr("id") });
							}
							console.log(getRouteID(mutualRoutes[0]));
							d3.select(`#${getRouteID(mutualRoutes[0])}`)
								.attr("selected", "true")
								.attr("route", "true");
						}
						[[x0, y0], [x1, y1]] = getRouteBounds(originElement, element);
					} else {
						element.attr("selected", "true").attr("origin", "true").raise();
						setOrigin(station);
						if (!destinationElement.empty()) {
							[[x0, y0], [x1, y1]] = getRouteBounds(
								element,
								destinationElement
							);
						}
					}
				}
				e.stopPropagation();
				if (!x0) {
					[[x0, y0], [x1, y1]] = geoGenerator.bounds(d);
				}
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
									0.8 /
										Math.max(
											Math.abs(x1 - x0) / width,
											Math.abs(y1 - y0) / height
										)
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
					.attr("destination", "false")
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
					.attr("stroke", "black")
					.attr("stroke-width", 0.5)
					.on("mouseover", (e, d) => {
						const station = d3.select(`#${d.id}`);
						if (station.attr("selected") === "false") {
							station.attr("selected", "true").raise();
							const circle = station.selectChild("circle");
							const text = station.selectChild("text");
							circle
								.attr("r", circle.attr("r") * 2)
								.attr("stroke", "white")
								.attr("stroke-width", circle.attr("stroke-width") * 2);
							text.attr("font-size", text.attr("font-size") * 2);
						}
					})
					.on("mouseout", (e, d) => {
						const station = d3.select(`#${d.id}`);
						if (
							station.attr("origin") === "false" &&
							station.attr("destination") === "false"
						)
							stationMouseout(d);
					});
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
		if (destination) {
			setDestination(null);
			const station = d3.select(".station[destination='true']");
			station.attr("destination", "false");
			stationMouseout({ id: station.attr("id") });
		}
		if (route && route !== "Any-route") {
			setRoute("Any-route");
			const prevRoute = d3.select(".route[route='true']");
			prevRoute.attr("route", "false");
			routeMouseout({ id: prevRoute.attr("id") });
		}
		d3.select("#map-svg").call(zoom.transform, d3.zoomIdentity.scale(1));
	}

	return (
		<div id="map-container">
			<svg id="map-svg"></svg>
			{route && route !== "Any-route" && (
				<div id="route-box">{route.replace(/-/g, " ").replace(/_/g, "/")}</div>
			)}
			<ZoomOutMapIcon id="zoom-out-button" onClick={reset} />
		</div>
	);
}
