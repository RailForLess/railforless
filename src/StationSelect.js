import { useState } from "react";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

export default function StationSelect({
	departing,
	origin,
	setOrigin,
	destination,
	setDestination,
	setUpdateMap,
	stations,
	nearbyCitiesBool,
	stationFormat,
	swapStations,
}) {
	function filterStations(options, state) {
		if (state.inputValue.trim() === "") {
			return options.filter((option) => option.group === "Nearby");
		}
		const nearbyCitiesStations = [];
		const input = state.inputValue.toLowerCase();
		if (input && nearbyCitiesBool) {
			for (const option of options.filter((option) => option.nearbyCities)) {
				for (const nearbyCity of option.nearbyCities.filter((city) =>
					city.toLowerCase().includes(input)
				)) {
					nearbyCitiesStations.push({
						...option,
						group: nearbyCity,
					});
				}
			}
		}
		const filteredOptions = options.filter(
			(option) =>
				option.name.toLowerCase().includes(input) ||
				option.code.toLowerCase().includes(input) ||
				option.city.toLowerCase().includes(input)
		);
		const nearbyStations = filteredOptions.filter(
			(option) => option.group === "Nearby"
		);
		const codeMatch = options.find(
			(option) => option.code.toLowerCase() === input
		);
		return (codeMatch ? [codeMatch] : [])
			.concat(nearbyStations)
			.concat(
				[
					...new Map(
						nearbyCitiesStations.map((station) => [
							JSON.stringify([station.id, station.group]),
							station,
						])
					).values(),
				]
					.filter((option) => option.code.toLowerCase() !== input)
					.sort((a, b) => a.name.localeCompare(b.name))
					.sort((a, b) => a.group.localeCompare(b.group))
			)
			.concat(
				filteredOptions.filter(
					(option) =>
						option.group !== "Nearby" && option.code.toLowerCase() !== input
				)
			)
			.slice(0, 100);
	}

	const [input, setInput] = useState("");
	const [open, setOpen] = useState(false);

	function handleChange(id) {
		setInput(id);
		if (id === "") {
			return;
		} else if (!id) {
			departing ? setOrigin(null) : setDestination(null);
			setUpdateMap((updateMap) => !updateMap);
			return;
		} else if (typeof id === "object") {
			id = id.id;
		}
		const match = stations.find((option) => option.code === id);
		if (!match) {
			return;
		}
		setOpen(false);
		if (["LOR", "SFA"].includes(id)) {
			departing ? setOrigin(match) : setDestination(match);
			const oppStation = stations.find(
				(station) => station.id === (id === "LOR" ? "SFA" : "LOR")
			);
			departing ? setDestination(oppStation) : setOrigin(oppStation);
		} else if (
			(departing && destination && id === destination.id) ||
			(!departing && origin && id === origin.id)
		) {
			swapStations();
		} else {
			departing ? setOrigin(match) : setDestination(match);
		}
		setUpdateMap((updateMap) => !updateMap);
	}

	const getStationIcon = (option, oppStation) => (
		<Tooltip
			title={
				option.id === oppStation.id
					? "Swap stations"
					: option.thruway || oppStation.thruway
					? "Bus connection"
					: option.routes.some((route) => oppStation.routes.includes(route))
					? "Direct route"
					: "Transfer required"
			}
		>
			{option.id === oppStation.id ? (
				<SwapHorizIcon fontSize="small" />
			) : option.thruway ? (
				<DirectionsBusIcon fontSize="small" />
			) : option.routes.some((route) => oppStation.routes.includes(route)) ? (
				<DirectionsRailwayIcon fontSize="small" />
			) : (
				<RailwayAlertIcon fontSize="small" />
			)}
		</Tooltip>
	);

	const getStationLabels = (station) =>
		stationFormat === "name-and-code"
			? `${station.name} (${station.code})`
			: stationFormat === "name-only"
			? station.name
			: station.code;

	const oppStation = departing ? destination : origin;
	const showIcons = oppStation && !oppStation.thruway;

	return (
		<Autocomplete
			disableClearable={window.innerWidth <= 480}
			disabled={!departing && !origin}
			filterOptions={filterStations}
			getOptionLabel={
				window.innerWidth > 480 ? getStationLabels : (option) => option.code
			}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			loadingText="Getting stations..."
			noOptionsText={input ? "No stations found" : "Enter a station"}
			onChange={(e, v) => handleChange(v)}
			onClose={() => setOpen(false)}
			onInputChange={(e, v) => handleChange(v)}
			open={open}
			options={stations}
			PopperComponent={(props) => (
				<Popper
					{...props}
					placement="bottom-start"
					sx={{ width: window.innerWidth <= 480 ? "80% !important" : "" }}
				/>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					label={departing ? "Departing" : "Arriving"}
					onFocus={() => setOpen(true)}
					placeholder="name/code/city"
				/>
			)}
			renderOption={(props, option) => {
				return (
					<Box
						component="li"
						sx={{
							paddingLeft: showIcons ? "0.5rem !important" : "",
							"& > svg": { margin: "0 0.5rem" },
						}}
						{...props}
					>
						{showIcons && getStationIcon(option, oppStation)}
						{getStationLabels(option)}
					</Box>
				);
			}}
			groupBy={(station) => station.group}
			value={departing ? origin : destination}
		/>
	);
}
