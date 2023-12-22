import { useState } from "react";
import * as d3 from "d3";
import "./Map.css";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";

export default function Map({ stationsJSON, origin, setOrigin }) {
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
				const station = d3.select("#stations g[origin='true']");
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
				d3.selectAll("#routes, #states, #stations g")
					.transition()
					.duration(duration)
					.attr(
						"transform",
						`translate(${[
							Math.min(0, Math.max(transform.x, width - width * transform.k)),
							Math.min(0, Math.max(transform.y, height - height * transform.k)),
						]})scale(${transform.k})`
					);
				d3.selectAll("#states path")
					.transition()
					.duration(duration)
					.attr("stroke-width", transform.k <= 1.1 ? 0.5 : 2 / transform.k);
				d3.selectAll("#routes path")
					.transition()
					.duration(duration)
					.attr("stroke-width", transform.k <= 1.1 ? 2 : 5 / transform.k);
				d3.selectAll("#stations .not-selected circle")
					.transition()
					.duration(duration)
					.attr("stroke-width", transform.k <= 1.1 ? 0.5 : 2 / transform.k);
				d3.selectAll("#stations .selected circle")
					.transition()
					.duration(duration)
					.attr("stroke-width", transform.k <= 1.1 ? 0.5 : 4 / transform.k);
				d3.selectAll("#stations .not-selected circle")
					.transition()
					.duration(duration)
					.attr("r", transform.k <= 1.1 ? 3 : 15 / transform.k);
				d3.selectAll("#stations .selected circle")
					.transition()
					.duration(duration)
					.attr("r", transform.k <= 1.1 ? 3 : 30 / transform.k);
				d3.selectAll("#stations .not-selected text")
					.transition()
					.duration(duration)
					.attr("font-size", transform.k <= 1.1 ? 0 : 10 / transform.k);
				d3.selectAll("#stations .selected text")
					.transition()
					.duration(duration)
					.attr("font-size", transform.k <= 1.1 ? 0 : 20 / transform.k);
			});
	}, 0);

	function mouseout(d) {
		const station = d3.select(`#${d.id}`);
		if (station.attr("origin") === "false") {
			station.attr("class", "not-selected");
			const circle = station.selectChild("circle");
			const text = station.selectChild("text");
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
				if (d3.select(this).attr("origin") === "true") {
					return;
				}
				const station = d3.select("#stations g[origin='true']");
				if (!station.empty()) {
					station.attr("origin", "false");
					mouseout({ id: station.attr("id") });
				}
				d3.select(this)
					.attr("class", "selected")
					.attr("origin", "true")
					.raise();
				setOrigin(stationsJSON.find((station) => station.id === d.id));
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
				.attr("stroke", "#FFF")
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
					.attr("id", (d) => d.id);

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
					});
				}
				const station = svg
					.append("g")
					.attr("id", "stations")
					.selectAll("g")
					.data(stationsGeoJSON.features)
					.join("g")
					.attr("id", (d) => d.id)
					.attr("class", "not-selected")
					.attr("origin", "false")
					.attr("cursor", "pointer")
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
						if (station.attr("class") === "not-selected") {
							station.attr("class", "selected").raise();
							const circle = station.selectChild("circle");
							const text = station.selectChild("text");
							circle
								.attr("r", circle.attr("r") * 2)
								.attr("stroke-width", circle.attr("stroke-width") * 2);
							text.attr("font-size", text.attr("font-size") * 2);
						}
					})
					.on("mouseout", (e, d) => mouseout(d));
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
			const station = d3.select("#stations g[origin='true']");
			station.attr("origin", "false");
			mouseout({ id: station.attr("id") });
		}
		d3.select("#map-svg").call(zoom.transform, d3.zoomIdentity.scale(1));
	}

	return (
		<div id="map-container">
			<svg id="map-svg"></svg>
			<ZoomOutMapIcon id="zoom-out-button" onClick={reset} />
		</div>
	);
}
