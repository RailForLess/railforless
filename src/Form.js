import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DateRangeSelect from "./DateRangeSelect";
import FareClassSelect from "./FareClassSelect";
import RouteSelect from "./RouteSelect";
import Settings from "./Settings";
import StationSelect from "./StationSelect";
import TravelerTypeSelect from "./TravelerTypeSelect";
import TripTypeSelect from "./TripTypeSelect";
import "./Form.css";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import BedIcon from "@mui/icons-material/Bed";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";

export default function Form({
	stations,
	setStations,
	origin,
	setOrigin,
	destination,
	setDestination,
	updateMap,
	setUpdateMap,
	searching,
	setSearching,
	route,
	setRoute,
}) {
	const [tripType, setTripType] = useState("round-trip");

	const [travelerTypes, setTravelerTypes] = useState({
		numAdults: 1,
		numSeniors: 0,
		numYouth: 0,
		numChildren: 0,
		numInfants: 0,
	});

	const [fareClass, setFareClass] = useState("coach");

	const [geolocateBool, setGeolocateBool] = useState(
		localStorage.getItem("geolocate")
			? JSON.parse(localStorage.getItem("geolocate"))
			: true
	);

	const [nearbyCitiesBool, setNearbyCitiesBool] = useState(
		localStorage.getItem("nearby-cities")
			? JSON.parse(localStorage.getItem("nearby-cities"))
			: true
	);

	const [stationFormat, setStationFormat] = useState(
		localStorage.getItem("station-format")
			? localStorage.getItem("station-format")
			: "name-and-code"
	);

	async function geolocate(stationsData) {
		if (localStorage.getItem("geolocate") === "false") {
			return;
		}
		let res = await fetch("https://freeipapi.com/api/json");
		if (res.status !== 200) {
			return;
		}
		res = await res.json();
		let sortedStationsData = [...stationsData]
			.sort(
				(a, b) =>
					Math.sqrt(
						(a.lon - res.longitude) ** 2 + (a.lat - res.latitude) ** 2
					) -
					Math.sqrt((b.lon - res.longitude) ** 2 + (b.lat - res.latitude) ** 2)
			)
			.slice(0, 5)
			.map((station) => ({ ...station, group: "Nearby" }))
			.concat(stationsData);
		if (
			Math.sqrt(
				(sortedStationsData[0].lon - res.longitude) ** 2 +
					(sortedStationsData[0].lat - res.latitude) ** 2
			) >= 4
		) {
			return;
		}
		setStations(sortedStationsData);
		setOrigin(sortedStationsData[0]);
		setUpdateMap(!updateMap);
	}

	useEffect(() => {
		if (!localStorage.getItem("geolocate")) {
			localStorage.setItem("geolocate", "true");
			localStorage.setItem("station-format", "name-and-code");
		}

		fetch("/json/stations.json")
			.then((res) => res.json())
			.then((data) => {
				data = data
					.sort((a, b) => a.stateLong.localeCompare(b.stateLong))
					.map((station) => ({ ...station, group: station.stateLong }));
				setStations(data);
				setTimeout(() => geolocate(data), 100);
			});
	}, []);

	const [sleeper, setSleeper] = useState(false);
	const [bedrooms, setBedrooms] = useState(false);
	const [familyRooms, setFamilyRooms] = useState(false);

	const [swapped, setSwapped] = useState(false);

	function swapStations() {
		setSwapped(!swapped);
		setDestination(origin);
		setOrigin(destination);
		setUpdateMap(!updateMap);
	}

	const [tab, setTab] = useState(1);
	const [weeks, setWeeks] = useState(1);
	const [days, setDays] = useState(5);
	const [weekdays, setWeekdays] = useState(false);
	const [weekends, setWeekends] = useState(false);
	const [month, setMonth] = useState(dayjs().startOf("d").get("M"));
	const [dateRangeStart, setDateRangeStart] = useState(dayjs().startOf("d"));
	const [dateRangeEnd, setDateRangeEnd] = useState(
		dayjs().startOf("d").add(30, "d")
	);
	const [maxDateRangeEnd, setMaxDateRangeEnd] = useState(
		dayjs().startOf("d").add(30, "d")
	);

	const sleeperRoutes = [
		"Auto-Train",
		"California-Zephyr",
		"Capitol-Limited",
		"Cardinal",
		"Coast-Starlight",
		"Crescent",
		"Empire-Builder",
		"Lake-Shore-Limited",
		"Silver-Meteor",
		"Silver-Star",
		"Southwest-Chief",
		"Sunset-Limited",
		"Texas-Eagle",
	];

	let errorType = 0;
	let errorText = "";
	if (origin && destination && origin.id === destination.id) {
		errorText = "Origin and destination must be different";
		errorType = 1;
	} else if (!origin && !destination) {
		errorText = "Please select an origin and destination station";
		errorType = 1;
	} else if (origin && !destination) {
		errorText = "Please select a destination station";
		errorType = 1;
	} else if (!origin && destination) {
		errorText = "Please select an origin station";
		errorType = 1;
	} else if (
		origin &&
		destination &&
		origin.routes
			.concat(destination.routes)
			.some((route) => sleeperRoutes.includes(route)) &&
		!origin.routes.some((route) => destination.routes.includes(route))
	) {
		errorText = "Some accommodation prices unavailable";
		errorType = 2;
	} else if (sleeper) {
		errorText = "Sleeper accommodations available";
		errorType = 3;
	}
	const [warningOpen, setWarningOpen] = useState(false);
	const [showSearchErrors, setShowSearchErrors] = useState(false);

	const [mutualRoutes, setMutualRoutes] = useState([]);

	useEffect(() => {
		const newSleeper =
			origin &&
			destination &&
			origin.routes
				.filter((route) => destination.routes.includes(route))
				.some((route) => sleeperRoutes.includes(route));
		setSleeper(newSleeper);
		if (!newSleeper) {
			setBedrooms(false);
			setFamilyRooms(false);
		}
		setShowSearchErrors(false);
	}, [origin, destination]);

	const [sleeperOpen, setSleeperOpen] = useState(false);

	function handleSearch() {
		if (!searching) {
			if (errorType === 1) {
				setShowSearchErrors(false);
				setTimeout(() => {
					setShowSearchErrors(true);
				}, 0);
			} else if (sleeper && !bedrooms && !familyRooms) {
				setSleeperOpen(true);
			} else {
				checkIP();
			}
		} else {
			setSearching(false);
			setTimeout(() => {
				setUpdateMap(!updateMap);
			}, 500);
		}
	}

	const [ipOpen, setIpOpen] = useState(false);

	async function checkIP() {
		let ip_res = await fetch("https://freeipapi.com/api/json");
		if (ip_res.status !== 200) {
			setIpOpen(true);
		}
		ip_res = await ip_res.json();
		let validate_res = await fetch("https://railforless.us/api/validate-IP", {
			method: "POST",
			body: JSON.stringify(ip_res),
		});
		if (validate_res.status !== 200) {
			setIpOpen(true);
		}
		validate_res = await validate_res.json();
		if (validate_res.isValid) {
			search();
		} else {
			setIpOpen(true);
		}
	}

	function search() {
		const mutualRoutesTemp = origin.routes.filter((route) =>
			destination.routes.includes(route)
		);
		if (mutualRoutesTemp.length > 1) {
			mutualRoutesTemp.unshift("Any-route");
		}
		setMutualRoutes(mutualRoutesTemp);
		setSearching(true);
	}

	return (
		<form>
			{!searching ? (
				<div className="input-row secondary-input">
					<div>
						<TripTypeSelect value={tripType} setValue={setTripType} />
						<TravelerTypeSelect
							value={travelerTypes}
							setValue={setTravelerTypes}
							searching={searching}
						/>
						<FareClassSelect
							value={fareClass}
							setValue={setFareClass}
							searching={searching}
						/>
					</div>
					<Settings
						bedrooms={bedrooms}
						setBedrooms={setBedrooms}
						familyRooms={familyRooms}
						setFamilyRooms={setFamilyRooms}
						sleeper={sleeper}
						geolocateBool={geolocateBool}
						setGeolocateBool={setGeolocateBool}
						geolocate={geolocate}
						stations={stations}
						setStations={setStations}
						nearbyCitiesBool={nearbyCitiesBool}
						setNearbyCitiesBool={setNearbyCitiesBool}
						stationFormat={stationFormat}
						setStationFormat={setStationFormat}
					/>
				</div>
			) : (
				<div className="input-row secondary-input" id="search-info">
					<span>{`${origin.name} (${origin.code})`}</span>
					{tripType === "round-trip" ? <SyncAltIcon /> : <ArrowRightAltIcon />}
					<span>{`${destination.name} (${destination.code})`}</span>
				</div>
			)}
			{!searching ? (
				<div className="input-row" id="primary-input">
					<StationSelect
						departing={true}
						origin={origin}
						setOrigin={setOrigin}
						destination={destination}
						setDestination={setDestination}
						updateMap={updateMap}
						setUpdateMap={setUpdateMap}
						stations={stations}
						nearbyCitiesBool={nearbyCitiesBool}
						sleeperRoutes={sleeperRoutes}
						stationFormat={stationFormat}
					/>
					<IconButton
						disabled={!destination}
						disableRipple
						onClick={swapStations}
						style={{ transform: `rotate(${swapped ? 180 : 0}deg)` }}
					>
						<SwapHorizIcon size="large" />
					</IconButton>
					<StationSelect
						departing={false}
						origin={origin}
						setOrigin={setOrigin}
						destination={destination}
						setDestination={setDestination}
						updateMap={updateMap}
						setUpdateMap={setUpdateMap}
						stations={stations}
						nearbyCitiesBool={nearbyCitiesBool}
						sleeperRoutes={sleeperRoutes}
						stationFormat={stationFormat}
					/>
					<DateRangeSelect
						tab={tab}
						setTab={setTab}
						weeks={weeks}
						setWeeks={setWeeks}
						days={days}
						setDays={setDays}
						weekdays={weekdays}
						setWeekdays={setWeekdays}
						weekends={weekends}
						setWeekends={setWeekends}
						month={month}
						setMonth={setMonth}
						dateRangeStart={dateRangeStart}
						setDateRangeStart={setDateRangeStart}
						dateRangeEnd={dateRangeEnd}
						setDateRangeEnd={setDateRangeEnd}
						maxDateRangeEnd={maxDateRangeEnd}
						setMaxDateRangeEnd={setMaxDateRangeEnd}
						tripType={tripType}
					/>
				</div>
			) : (
				<div className="input-row" id="primary-input">
					<TravelerTypeSelect
						value={travelerTypes}
						setValue={setTravelerTypes}
						searching={searching}
					/>
					<FareClassSelect
						value={fareClass}
						setValue={setFareClass}
						searching={searching}
					/>
					{mutualRoutes.length > 1 && (
						<RouteSelect
							value={route}
							setValue={setRoute}
							mutualRoutes={mutualRoutes}
						/>
					)}
					<DateRangeSelect
						tab={tab}
						setTab={setTab}
						weeks={weeks}
						setWeeks={setWeeks}
						days={days}
						setDays={setDays}
						weekdays={weekdays}
						setWeekdays={setWeekdays}
						weekends={weekends}
						setWeekends={setWeekends}
						month={month}
						setMonth={setMonth}
						dateRangeStart={dateRangeStart}
						setDateRangeStart={setDateRangeStart}
						dateRangeEnd={dateRangeEnd}
						setDateRangeEnd={setDateRangeEnd}
						maxDateRangeEnd={maxDateRangeEnd}
						setMaxDateRangeEnd={setMaxDateRangeEnd}
						tripType={tripType}
					/>
				</div>
			)}
			{!searching &&
				(errorType > 1 || (showSearchErrors && errorType === 1)) && (
					<div className={`error-text error-text-${errorType}`}>
						<div>
							{errorType === 1 ? (
								<ErrorIcon fontSize="small" />
							) : errorType === 2 ? (
								<RailwayAlertIcon fontSize="small" />
							) : (
								<BedIcon fontSize="small" />
							)}
							{errorType === 3 ? (
								<span
									className="error-link"
									onClick={() =>
										document.querySelector("#settings-button").click()
									}
								>
									{errorText}
								</span>
							) : (
								<span>{errorText}</span>
							)}
							{errorType === 2 && (
								<span
									className="error-link"
									onClick={() => setWarningOpen(true)}
								>
									Learn more
								</span>
							)}
							{errorType === 2 && (
								<Dialog
									onClose={() => setWarningOpen(false)}
									open={warningOpen}
								>
									<DialogTitle>Limited Accommodation Pricing</DialogTitle>
									<DialogContent>
										<DialogContentText>
											{`Your trip between ${origin.city} and ${destination.city} requires one or more transfers, and so we cannot provide Bedroom and Family Room accommodation pricing. Consider a direct route if you need these accommodations.`}
										</DialogContentText>
									</DialogContent>
									<DialogActions>
										<Button onClick={() => setWarningOpen(false)}>OK</Button>
									</DialogActions>
								</Dialog>
							)}
						</div>
					</div>
				)}
			<div style={{ height: 0 }}>
				<Fab
					color="primary"
					id={searching ? "cancel-search" : ""}
					onClick={handleSearch}
					variant="extended"
					size="medium"
					sx={{
						backgroundColor: !searching ? "#89B3F7" : "red",
						bottom: `-${
							!searching &&
							(errorType > 1 || (showSearchErrors && errorType === 1))
								? "2.5"
								: "1.75"
						}rem`,
						transition: "0.5s bottom",
						":hover": { bgcolor: !searching ? "primary.hover" : "red" },
					}}
				>
					{!searching ? (
						<TravelExploreIcon className="button" sx={{ mr: 1 }} />
					) : (
						<CancelIcon className="button" sx={{ mr: 1 }} />
					)}
					{!searching ? "Search" : "Cancel"}
				</Fab>
				{errorType !== 1 && (
					<Dialog onClose={() => setSleeperOpen(false)} open={sleeperOpen}>
						<DialogTitle>Sleeper Accommodation Pricing</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{`Sleeper accommodations are available on your trip between ${origin.city} and ${destination.city}. Do you need Bedroom and/or Family Room prices?`}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => {
									setSleeperOpen(false);
									checkIP();
								}}
							>
								No
							</Button>
							<Button
								onClick={() => {
									setSleeperOpen(false);
									document.querySelector("#settings-button").click();
								}}
							>
								Yes
							</Button>
						</DialogActions>
					</Dialog>
				)}
				<Dialog onClose={() => setIpOpen(false)} open={ipOpen}>
					<DialogContent>
						<DialogContentText>
							Sorry, we are restricting access to this feature until testing is
							complete. Check back soon for updates!
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setIpOpen(false)}>OK</Button>
					</DialogActions>
				</Dialog>
			</div>
		</form>
	);
}
