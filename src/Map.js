import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { routesInfo } from "./routesInfo";
import "./Map.css";
import ClearIcon from "@mui/icons-material/Clear";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

export default function Map({
	stationsJSON,
	origin,
	setOrigin,
	destination,
	setDestination,
	updateMap,
	setUpdateMap,
	route,
	setRoute,
}) {
	const width = useRef();
	const height = useRef();
	const zoom = useRef();
	const geoGenerator = useRef();
	const svg = useRef();
	const transformRef = useRef(d3.zoomIdentity);
	const originRef = useRef(origin);
	const startTime = useRef(Date.now());
	const [loaded, setLoaded] = useState(false);
	const silverService = ["Palmetto", "Silver-Meteor"];

	const getRouteID = (route) =>
		silverService.includes(route) ? "Silver-Meteor_Palmetto" : route;

	useEffect(() => {
		originRef.current = origin;
		if (Date.now() - startTime.current < 1000) {
			setTimeout(() => setUpdateMap((updateMap) => !updateMap), 1000);
			return;
		}
		const prevOriginElement = d3.select(".station[origin='true']");
		if (!prevOriginElement.empty()) {
			handleStationClick(prevOriginElement.attr("id"), false, false);
		}
		const prevDestinationElement = d3.select(".station[destination='true']");
		if (!prevDestinationElement.empty()) {
			handleStationClick(prevDestinationElement.attr("id"), false, true);
		}
		if (origin && !origin.thruway) {
			handleStationClick(origin.id, false, false);
		}
		if (destination && !destination.thruway) {
			handleStationClick(destination.id, false, true);
		}
		drawMap();
	}, [updateMap]);

	let scaleExtent = 20;

	function disableStation(routeString, station) {
		if (routeString === "Any-route") {
			return false;
		}
		if (routeString === "Silver-Meteor_Palmetto") {
			return !silverService.some((route) => station.routes.includes(route));
		} else {
			return !station.routes.includes(routeString);
		}
	}

	function drawMap() {
		const zoomOutButton = document.querySelector("#zoom-out-button");
		if (!zoomOutButton) {
			return;
		}
		zoomOutButton.style.cursor =
			transformRef.current.k === 1 ? "default" : "pointer";
		zoomOutButton.style.opacity = transformRef.current.k === 1 ? 0 : 1;
		zoomOutButton.style.pointerEvents =
			transformRef.current.k === 1 ? "none" : "auto";
		const station = d3.select(".station[origin='true']");
		let duration = 0;
		if (!station.empty() && station.attr("time")) {
			if (new Date().getTime() - Number(station.attr("time")) > 2000) {
				station.attr("time", null);
			} else {
				duration = 500;
			}
		} else if (transformRef.current.k === 1) {
			station.attr("time", new Date().getTime());
			duration = 500;
		}
		d3.selectAll("#routes, #states, .station")
			.transition()
			.duration(duration)
			.attr(
				"transform",
				`translate(${[
					Math.min(
						0,
						Math.max(
							transformRef.current.x,
							width.current - width.current * transformRef.current.k
						)
					),
					Math.min(
						0,
						Math.max(
							transformRef.current.y,
							height.current - height.current * transformRef.current.k
						)
					),
				]})scale(${transformRef.current.k})`
			);
		d3.selectAll(".state")
			.transition()
			.duration(duration)
			.attr(
				"stroke-width",
				transformRef.current.k === 1 ? 0.5 : 2 / transformRef.current.k
			);
		const routeElement = d3.select(".route[route='true']");
		let routeString = "Any-route";
		if (!routeElement.empty()) {
			routeString = routeElement.attr("id");
		}
		d3.selectAll(".route[selected='false']")
			.transition()
			.duration(duration)
			.attr("stroke", "red")
			.attr(
				"stroke-width",
				transformRef.current.k === 1 ? 2 : 5 / transformRef.current.k
			);
		d3.selectAll(".route[selected='true']")
			.transition()
			.duration(duration)
			.attr("stroke", "#89B3F7")
			.attr(
				"stroke-width",
				transformRef.current.k === 1 ? 2 : 10 / transformRef.current.k
			);
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
				transformRef.current.k === 1 || disableStation(routeString, d)
					? 3 / transformRef.current.k
					: 15 / transformRef.current.k
			)
			.attr("stroke", "black")
			.attr("stroke-width", (d) =>
				transformRef.current.k === 1 || disableStation(routeString, d)
					? 0.5 / transformRef.current.k
					: 2 / transformRef.current.k
			);
		d3.selectAll(".station[selected='true'] circle")
			.transition()
			.duration(duration)
			.attr("r", (d) =>
				transformRef.current.k === 1 || disableStation(routeString, d)
					? 3 / transformRef.current.k
					: 30 / transformRef.current.k
			)
			.attr("stroke", "white")
			.attr("stroke-width", (d) =>
				transformRef.current.k === 1 || disableStation(routeString, d)
					? 0.5 / transformRef.current.k
					: 4 / transformRef.current.k
			);
		d3.selectAll(".station[selected='false'] text")
			.transition()
			.duration(duration)
			.attr("font-size", (d) =>
				transformRef.current.k === 1 || disableStation(routeString, d)
					? 0
					: 10 / transformRef.current.k
			);
		d3.selectAll(".station[selected='true'] text")
			.transition()
			.duration(duration)
			.attr("font-size", (d) =>
				transformRef.current.k === 1 || disableStation(routeString, d)
					? 0
					: 20 / transformRef.current.k
			);
	}

	setTimeout(() => {
		const mapContainer = document.querySelector("#map-container");
		width.current = mapContainer.clientWidth - 32;
		height.current = mapContainer.clientHeight - 52;
		zoom.current = d3
			.zoom()
			.scaleExtent([1, scaleExtent])
			.on("zoom", ({ transform }) => {
				transformRef.current = transform;
				drawMap();
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
		const originElement = d3.select(".station[origin='true']");
		if (!originElement.empty()) {
			originElement.raise();
		}
		const destinationElement = d3.select(".station[destination='true']");
		if (!destinationElement.empty()) {
			destinationElement.raise();
		}
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

	function handleStationClick(id, click = true, isDestination = null) {
		let x0, y0, x1, y1;
		const element = d3.select(`#${id}`);
		if (element.empty()) {
			return;
		}
		if (element.attr("origin") === "true") {
			if (click) {
				setOrigin(null);
				originRef.current = null;
			}
			element.attr("origin", "false").attr("selected", "false");
			return;
		} else if (element.attr("destination") === "true") {
			if (click) {
				setDestination(null);
			}
			element.attr("destination", "false").attr("selected", "false");
			return;
		}
		const station = stationsJSON.find((station) => station.id === id);
		const prevRoute = d3.select(".route[route='true']");
		if (!prevRoute.empty() && !station.routes.includes(prevRoute.attr("id"))) {
			setRoute("Any-route");
			prevRoute.attr("route", "false");
			routeMouseout({ id: prevRoute.attr("id") });
		}
		const originElement = d3.select(".station[origin='true']");
		const destinationElement = d3.select(".station[destination='true']");
		if (isDestination || (originRef.current && isDestination === null)) {
			if (!destinationElement.empty()) {
				destinationElement.attr("destination", "false");
				stationMouseout({ id: destinationElement.attr("id") });
			}
			element.attr("selected", "true").attr("destination", "true").raise();
			if (click) {
				setDestination(station);
			}
			if (!originElement.empty()) {
				const mutualRoutes = JSON.parse(originElement.attr("routes")).filter(
					(route) => station.routes.includes(route)
				);
				if (mutualRoutes.length === 1) {
					setRoute(mutualRoutes[0]);
					const prevRoute = d3.select(".route[route='true']");
					if (!prevRoute.empty()) {
						prevRoute.attr("route", "false");
						routeMouseout({ id: prevRoute.attr("id") });
					}
					d3.select(`#${getRouteID(mutualRoutes[0])}`)
						.attr("selected", "true")
						.attr("route", "true");
				}
				[[x0, y0], [x1, y1]] = getRouteBounds(originElement, element);
			}
		} else {
			element.attr("selected", "true").attr("origin", "true").raise();
			if (click) {
				setOrigin(station);
				originRef.current = station;
			}
			if (!destinationElement.empty()) {
				[[x0, y0], [x1, y1]] = getRouteBounds(element, destinationElement);
			}
		}
		zoomToCords(x0, y0, x1, y1, element.datum());
	}

	function zoomToCords(x0, y0, x1, y1, data) {
		if (!x0) {
			[[x0, y0], [x1, y1]] = geoGenerator.current.bounds(data);
		}
		svg.current
			.transition()
			.duration(
				window.matchMedia("(prefers-reduced-motion)").matches ? 0 : 2000
			)
			.call(
				zoom.current.transform,
				d3.zoomIdentity
					.translate(width.current / 2, height.current / 2)
					.scale(
						Math.min(
							scaleExtent / 2,
							0.8 /
								Math.max(
									Math.abs(x1 - x0) / width.current,
									Math.abs(y1 - y0) / height.current
								)
						)
					)
					.translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
			);
	}

	function clicked(e, d) {
		let x0, y0, x1, y1;
		const element = d3.select(this);
		if (element.attr("class") === "route") {
			if (element.attr("route") === "true") {
				setRoute("Any-route");
				element.attr("route", "false");
				routeMouseout({ id: element.attr("id") });
				d3.select("#map-svg").call(
					zoom.current.transform,
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
			handleStationClick(d.id);
		}
		e.stopPropagation();
		if (element.attr("class") === "route") {
			zoomToCords(x0, y0, x1, y1, d);
		}
	}

	if (!loaded && stationsJSON.length > 0) {
		setLoaded(true);

		const projection = d3.geoAlbersUsa();

		d3.json("/json/states.geojson").then((states) => {
			projection.fitSize([width.current, height.current], states);
			geoGenerator.current = d3.geoPath(projection);

			svg.current = d3.select("#map-svg").call(zoom.current);
			svg.current
				.append("g")
				.attr("id", "states")
				.selectAll("path")
				.data(states.features)
				.join("path")
				.attr("d", geoGenerator.current)
				.attr("fill-rule", "evenodd")
				.attr("fill", "rgb(54, 55, 58)")
				.attr("stroke", "rgba(255, 255, 255, 0.25)")
				.attr("class", "state")
				.attr("id", (d) => d.id);

			d3.json("/json/routes.geojson").then((routes) => {
				svg.current
					.append("g")
					.attr("id", "routes")
					.selectAll("path")
					.data(routes.features)
					.join("path")
					.attr("d", geoGenerator.current)
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
				for (const station of stationsJSON.filter(
					(station) => !station.thruway
				)) {
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
				const station = svg.current
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

	const routeInfo = routesInfo[route.replaceAll("-", " ").replace("_", "/")];

	return (
		<div id="map-container">
			<svg id="map-svg"></svg>
			{route && route !== "Any-route" && (
				<div id="route-box">
					<span>{routeInfo.icon}</span>
					<a
						href={`https://www.amtrak.com/routes/${routeInfo.link}-train.html`}
						rel="noreferrer"
						target="_blank"
					>
						{route.replaceAll("-", " ").replace("_", "/")}
					</a>
					<ClearIcon
						onClick={() => d3.select(".route[route='true']").dispatch("click")}
						sx={{ cursor: "pointer" }}
					/>
				</div>
			)}
			<ZoomOutMapIcon
				id="zoom-out-button"
				onClick={() =>
					d3
						.select("#map-svg")
						.call(zoom.current.transform, d3.zoomIdentity.scale(1))
				}
			/>
		</div>
	);
}
