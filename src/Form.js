import { useEffect, useState } from "react";
import "./Form.css";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Fab from "@mui/material/Fab";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Form({ fares, setFares, progress, setProgress }) {
	const [tripType, setTripType] = useState("round-trip");
	const [travelerTypes, setTravelerTypes] = useState({
		numAdults: 1,
		numSeniors: 0,
		numYouth: 0,
		numChildren: 0,
		numInfants: 0,
	});
	const [travelerTypesEdit, setTravelerTypesEdit] = useState(travelerTypes);
	const travelerTypesAddInfo = {
		numAdults: "16+",
		numSeniors: "55+",
		numYouth: "13 - 15",
		numChildren: "2 - 12",
		numInfants: "Under 2",
	};
	const [numTravelersEdit, setNumTravelersEdit] = useState(1);

	useEffect(() => {
		setNumTravelersEdit(
			Object.values(travelerTypesEdit).reduce((a, b) => a + b, 0)
		);
	}, [travelerTypesEdit]);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	function handleTravelerTypesEdit(travelerType, increment) {
		const newTravelerTypesEdit = { ...travelerTypesEdit };
		newTravelerTypesEdit[travelerType] += increment ? 1 : -1;
		setTravelerTypesEdit(newTravelerTypesEdit);
	}

	const [fareClass, setFareClass] = useState("coach");

	const [stations, setStations] = useState([]);

	async function geolocate(stationsData) {
		const res = await fetch("https://freeipapi.com/api/json");
		if (res.status !== 200) {
			return;
		}
		const ip = await res.json();
		let sortedStationsData = [...stationsData]
			.sort(
				(a, b) =>
					Math.sqrt((a.lon - ip.longitude) ** 2 + (a.lat - ip.latitude) ** 2) -
					Math.sqrt((b.lon - ip.longitude) ** 2 + (b.lat - ip.latitude) ** 2)
			)
			.slice(0, 5)
			.map((station) => ({ ...station, group: "Nearby stations" }))
			.concat(stationsData);
		setStations(sortedStationsData);
		setOrigin(sortedStationsData[0]);
	}

	useEffect(() => {
		fetch("https://api.railsave.rs/stations")
			.then((res) => res.json())
			.then((data) => {
				data = data
					.sort((a, b) => a.stateLong.localeCompare(b.stateLong))
					.map((station) => ({ ...station, group: station.stateLong }));
				setStations(data);
				geolocate(data);
			});
	}, []);

	const [origin, setOrigin] = useState(null);
	const [destination, setDestination] = useState(null);

	return (
		<form>
			<div className="input-row">
				<Select
					className="secondary-input secondary-select"
					disableUnderline={true}
					value={tripType}
					variant="standard"
					onChange={(e) => setTripType(e.target.value)}
					onClose={() => {
						document.querySelector(
							".secondary-select:first-child"
						).style.backgroundColor = "transparent";
						document.querySelector(
							".secondary-select:first-child div"
						).style.backgroundColor = "transparent";
					}}
					onOpen={() =>
						(document.querySelector(
							".secondary-select:first-child"
						).style.backgroundColor = "#4C5667")
					}
				>
					<MenuItem key="round-trip" value="round-trip">
						<div
							style={{ alignItems: "center", display: "flex", gap: "0.5rem" }}
						>
							<SyncAltIcon />
							<div>Round trip</div>
						</div>
					</MenuItem>
					<MenuItem key="one-way" value="one-way">
						<div style={{ alignItems: "center", display: "flex", gap: "1rem" }}>
							<ArrowRightAltIcon />
							<div>One way</div>
						</div>
					</MenuItem>
				</Select>
				<Button
					className="secondary-input"
					disableRipple
					endIcon={<ArrowDropDownIcon />}
					onClick={(e) => {
						document.querySelector(
							"form > div:first-child button"
						).style.backgroundColor = "#4C5667";
						document.querySelector(
							"form > div:first-child button svg:last-child"
						).style.transform = "rotate(180deg)";
						setAnchorEl(e.currentTarget);
					}}
				>
					<PersonOutlineIcon sx={{ mr: 1 }} />
					{Object.values(travelerTypes).reduce((a, b) => a + b, 0)}
				</Button>
				<Menu
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					onClose={() => {
						document.querySelector(
							"form > div:first-child button svg:last-child"
						).style.transform = "rotate(0)";
						document.querySelector(
							"form > div:first-child button"
						).style.backgroundColor = "transparent";
						setAnchorEl(null);
					}}
					open={open}
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
				>
					{Object.keys(travelerTypesEdit).map((travelerType) => (
						<MenuItem
							className="number-row"
							disableRipple
							id={travelerType}
							key={travelerType}
							onClick={(e) => e.stopPropagation()}
						>
							<div>
								<span>{travelerType.slice(3)}</span>
								<span>{travelerTypesAddInfo[travelerType]}</span>
							</div>
							<div>
								<button
									onClick={() => handleTravelerTypesEdit(travelerType, false)}
									className={`number-button-${
										travelerType === "numAdults" ||
										travelerType === "numSeniors"
											? travelerTypesEdit.numAdults +
													travelerTypesEdit.numSeniors ===
											  1
												? "disabled"
												: travelerTypesEdit[travelerType] === 0
												? "disabled"
												: "enabled"
											: travelerTypesEdit[travelerType] === 0
											? "disabled"
											: "enabled"
									}`}
								>
									<RemoveIcon />
								</button>
								<span>{travelerTypesEdit[travelerType]}</span>
								<button
									onClick={() => handleTravelerTypesEdit(travelerType, true)}
									className={`number-button-${
										numTravelersEdit === 8 ? "disabled" : "enabled"
									}`}
								>
									<AddIcon />
								</button>
							</div>
						</MenuItem>
					))}
					<div id="number-options">
						<Button
							disableRipple
							onClick={() => {
								document.querySelector(
									"form > div:first-child button svg:last-child"
								).style.transform = "rotate(0)";
								document.querySelector(
									"form > div:first-child button"
								).style.backgroundColor = "transparent";
								setAnchorEl(null);
								setTravelerTypesEdit(travelerTypes);
							}}
							variant="text"
						>
							Cancel
						</Button>
						<Button
							disableRipple
							onClick={() => {
								document.querySelector(
									"form > div:first-child button svg:last-child"
								).style.transform = "rotate(0)";
								document.querySelector(
									"form > div:first-child button"
								).style.backgroundColor = "transparent";
								setTravelerTypes(travelerTypesEdit);
								setAnchorEl(null);
							}}
							variant="text"
						>
							Done
						</Button>
					</div>
				</Menu>
				<Select
					className="secondary-input secondary-select"
					disableUnderline={true}
					value={fareClass}
					variant="standard"
					onChange={(e) => setFareClass(e.target.value)}
					onClose={() => {
						document.querySelector(
							".secondary-select:last-child"
						).style.backgroundColor = "transparent";
						document.querySelector(
							".secondary-select:last-child div"
						).style.backgroundColor = "transparent";
					}}
					onOpen={() =>
						(document.querySelector(
							".secondary-select:last-child"
						).style.backgroundColor = "#4C5667")
					}
				>
					<MenuItem key="coach" value="coach">
						Coach
					</MenuItem>
					<MenuItem key="business" value="business">
						Business
					</MenuItem>
					<MenuItem key="first" value="first">
						First
					</MenuItem>
					<MenuItem key="sleeper" value="sleeper">
						Sleeper
					</MenuItem>
				</Select>
			</div>
			<div className="input-row" id="middle-row">
				<Autocomplete
					getOptionLabel={(station) => `${station.name} (${station.code})`}
					noOptionsText="No stations found"
					onChange={(e, v) => setOrigin(v)}
					options={stations}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Departing"
							placeholder="name or code"
						/>
					)}
					groupBy={(station) => station.group}
					value={origin}
				/>
				<IconButton>
					<SwapHorizIcon size="large" />
				</IconButton>
				<Autocomplete
					getOptionLabel={(station) => `${station.name} (${station.code})`}
					noOptionsText="No stations found"
					onChange={(e, v) => setDestination(v)}
					options={stations}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Arriving"
							placeholder="name or code"
						/>
					)}
					groupBy={(station) => station.group}
					value={destination}
				/>
				<DatePicker label="Start Date" />
				<DatePicker label="End Date" />
			</div>
			<div style={{ height: 0 }}>
				<Fab
					color="primary"
					variant="extended"
					size="medium"
					sx={{
						bottom: "-1.75rem",
						":hover": { bgcolor: "primary.hover" },
					}}
				>
					<TravelExploreIcon className="button" sx={{ mr: 1 }} />
					Search
				</Fab>
			</div>
		</form>
	);
}
