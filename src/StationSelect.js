import { useState } from "react";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import ErrorIcon from "@mui/icons-material/Error";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import TextField from "@mui/material/TextField";

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
}) {
	function filterStations(options, state) {
		const nearbyCitiesStations = [];
		const input = state.inputValue.toLowerCase();
		if (input && nearbyCitiesBool) {
			for (const option of options) {
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
				option.stateLong.toLowerCase().includes(input) ||
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
			);
	}

	const [open, setOpen] = useState(false);

	function autocompleteCode(e, code) {
		const match = stations.find((option) => option.code === code);
		if (match) {
			departing ? setOrigin(match) : setDestination(match);
			setUpdateMap((updateMap) => !updateMap);
			setOpen(false);
		}
	}

	const getStationIcon = (option, station) =>
		option.id === station.id ? (
			<ErrorIcon fontSize="small" />
		) : option.routes.some((route) => station.routes.includes(route)) ? (
			<DirectionsRailwayIcon fontSize="small" />
		) : (
			<RailwayAlertIcon fontSize="small" />
		);

	const getStationLabels = (station) =>
		stationFormat === "name-and-code"
			? `${station.name} (${station.code})`
			: stationFormat === "name-only"
			? station.name
			: station.code;

	function handleChange(e, v) {
		departing ? setOrigin(v) : setDestination(v);
		if (["LOR", "SFA"].includes(v.id)) {
			const oppStation = stations.find(
				(station) => station.id === (v.id === "LOR" ? "SFA" : "LOR")
			);
			departing ? setDestination(oppStation) : setOrigin(oppStation);
		}
		setUpdateMap((updateMap) => !updateMap);
	}

	return (
		<Autocomplete
			disableClearable
			disabled={!departing && !origin}
			filterOptions={filterStations}
			getOptionLabel={
				window.innerWidth > 480 ? getStationLabels : (option) => option.code
			}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			loadingText="Getting stations..."
			noOptionsText="No stations found"
			onChange={handleChange}
			onClose={() => setOpen(false)}
			onInputChange={autocompleteCode}
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
					placeholder="name/code/state/city"
				/>
			)}
			renderOption={(props, option) => {
				const oppStation = departing ? destination : origin;
				return (
					<Box
						component="li"
						sx={{
							paddingLeft: oppStation ? "0.5rem !important" : "",
							"& > svg": { margin: "0 0.5rem" },
						}}
						{...props}
					>
						{oppStation && getStationIcon(option, oppStation)}
						{getStationLabels(option)}
					</Box>
				);
			}}
			groupBy={(station) => station.group}
			value={departing ? origin : destination}
		/>
	);
}
