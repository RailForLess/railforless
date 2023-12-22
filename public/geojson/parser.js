const { readFileSync, writeFileSync } = require("fs");

function parseStates() {
	const states = JSON.parse(readFileSync("states.geojson"));
	for (const state of states.features) {
		state.id = state.properties.NAME;
		delete state.properties;
	}
	writeFileSync("statesTest.geojson", JSON.stringify(states));
}

function parseRoutes() {
	const routes = JSON.parse(readFileSync("routes.geojson"));
	for (const route of routes.features) {
		route.id = route.properties.NAME;
		delete route.properties;
	}
	writeFileSync("routesTest.geojson", JSON.stringify(routes));
}

parseRoutes();
