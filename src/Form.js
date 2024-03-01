import Ably from "ably/promises";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import pako from "pako";
import DateRangeSelect from "./DateRangeSelect";
import FareClassSelect from "./FareClassSelect";
import RouteSelect from "./RouteSelect";
import Settings from "./Settings";
import StationSelect from "./StationSelect";
import TravelerTypeSelect from "./TravelerTypeSelect";
import TripTypeSelect from "./TripTypeSelect";
import "./Form.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
dayjs.extend(utc);

export default function Form({
	tripType,
	setTripType,
	travelerTypes,
	setTravelerTypes,
	fareClass,
	setFareClass,
	fareClasses,
	setFareClasses,
	stations,
	setStations,
	origin,
	setOrigin,
	destination,
	setDestination,
	tab,
	setTab,
	anyDuration,
	setAnyDuration,
	weeks,
	setWeeks,
	weeksSelected,
	setWeeksSelected,
	days,
	setDays,
	daysSelected,
	setDaysSelected,
	weekdays,
	setWeekdays,
	weekends,
	setWeekends,
	month,
	setMonth,
	dateRangeStart,
	setDateRangeStart,
	dateRangeEnd,
	setDateRangeEnd,
	maxDateRangeEnd,
	setMaxDateRangeEnd,
	updateMap,
	setUpdateMap,
	searching,
	setSearching,
	route,
	setRoute,
	mutualRoutes,
	setMutualRoutes,
	setProgressPercent,
	setProgressText,
	searchError,
	setSearchError,
	fares,
	setFares,
}) {
	const [geolocateBool, setGeolocateBool] = useState(
		localStorage.getItem("geolocate")
			? JSON.parse(localStorage.getItem("geolocate"))
			: true
	);

	const [nearbyCitiesBool, setNearbyCitiesBool] = useState(
		localStorage.getItem("nearbyCities")
			? JSON.parse(localStorage.getItem("nearbyCities"))
			: true
	);

	const [stationFormat, setStationFormat] = useState(
		localStorage.getItem("stationFormat")
			? localStorage.getItem("stationFormat")
			: "name-and-code"
	);

	async function geolocate(stationsData) {
		if (localStorage.getItem("geolocate") === "false" || origin) {
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

	let wakeRes;
	async function wake() {
		wakeRes = await fetch(
			`https://${process.env.REACT_APP_API_SUBDOMAIN}.railsave.rs/wake`
		);
	}
	const [wakeError, setWakeError] = useState(false);
	const [browserDialog, setBrowserDialog] = useState(false);

	function startup() {
		wake();
		setTimeout(() => {
			if (!wakeRes || wakeRes.status !== 200) {
				setWakeError(true);
			}
		}, 10000);

		if (!localStorage.getItem("geolocate")) {
			localStorage.setItem("geolocate", "true");
			localStorage.setItem("stationFormat", "name-and-code");
		}

		fetch("/json/stations.json")
			.then((res) => res.json())
			.then((data) => {
				data = data
					.sort((a, b) => a.stateLong.localeCompare(b.stateLong))
					.map((station) => ({ ...station, group: station.stateLong }));
				setStations(data);
				setTimeout(() => geolocate(data), 500);
			});
	}

	useEffect(() => {
		if (
			navigator.userAgent.includes("Firefox") &&
			!localStorage.getItem("browserWarning")
		) {
			setBrowserDialog(true);
		} else {
			startup();
		}
	}, []);

	function setBrowserWarning() {
		localStorage.setItem("browserWarning", "true");
		window.location.reload();
	}

	const [bedrooms, setBedrooms] = useState(false);
	const [familyRooms, setFamilyRooms] = useState(false);

	const [swapped, setSwapped] = useState(false);

	function swapStations() {
		setSwapped(!swapped);
		setDestination(origin);
		setOrigin(destination);
		setUpdateMap(!updateMap);
	}

	useEffect(() => {
		const maxDate = dayjs.utc().startOf("d").add(11, "M").subtract(2, "d");
		if (tripType === "round-trip") {
			setMaxDateRangeEnd(
				maxDate.isBefore(dateRangeStart.add(44, "d"))
					? maxDate
					: dateRangeStart.add(44, "d")
			);
			if (dateRangeEnd.diff(dateRangeStart, "d") > 44) {
				setDateRangeEnd(dateRangeStart.add(44, "d"));
			}
		} else {
			setMaxDateRangeEnd(
				maxDate.isBefore(dateRangeStart.add(89, "d"))
					? maxDate
					: dateRangeStart.add(89, "d")
			);
		}
	}, [tripType]);

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
		!origin.routes.some((route) => destination.routes.includes(route))
	) {
		errorText = "Transfer required";
		errorType = 2;
	}
	const [showSearchErrors, setShowSearchErrors] = useState(false);

	useEffect(() => {
		setShowSearchErrors(false);
		if (origin && destination) {
			const newMutualRoutes = origin.routes.filter((route) =>
				destination.routes.includes(route)
			);
			if (newMutualRoutes.length > 1) {
				newMutualRoutes.unshift("Any-route");
			}
			setMutualRoutes(newMutualRoutes);
		}
	}, [origin, destination]);

	const [sleeperOpen, setSleeperOpen] = useState(false);

	function handleSearch() {
		if (fares.length > 0 || searchError) {
			setFares([]);
			document.getElementById("root").style.height = "100vh";
			localStorage.setItem("fares", "[]");
			setFareClasses([
				"Any class",
				"Coach",
				"Business",
				"First",
				"Sleeper",
				"Roomette",
				"Bedroom",
				"Family Room",
			]);
			setTimeout(() => {
				setUpdateMap(!updateMap);
			}, 500);
			setSearching(false);
			setSearchError(false);
		} else if (searching) {
			if (clientState) {
				clientState.close();
			}
			setSearching(false);
			setTimeout(() => {
				setUpdateMap(!updateMap);
			}, 500);
		} else {
			if (errorType === 1) {
				setShowSearchErrors(false);
				setTimeout(() => {
					setShowSearchErrors(true);
				}, 0);
			} else if (!bedrooms && !familyRooms) {
				setSleeperOpen(true);
			} else {
				checkIP();
			}
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

	function getCaptchaToken() {
		return new Promise((res, rej) => {
			window.grecaptcha.ready(() => {
				window.grecaptcha
					.execute("6Lfpbj4pAAAAALNTCxTBOH-OdifJBosvFNDjBHbl", {
						action: "submit",
					})
					.then((token) => {
						return res(token);
					});
			});
		});
	}

	const [clientState, setClientState] = useState(null);

	async function search() {
		setProgressPercent(0);
		setProgressText("Connecting...");
		setSearching(true);

		const dates = [];
		let date = dateRangeStart.subtract(1, "d");
		do {
			date = date.add(1, "d");
			dates.push(`dates[]=${date.format("YYYY-MM-DDTHH:mm:ss")}`);
		} while (!date.isSame(dateRangeEnd, "D"));

		const response = await fetch(
			`https://${
				process.env.REACT_APP_API_SUBDOMAIN
			}.railsave.rs/token?origin=${origin.code}&destination=${
				destination.code
			}&${dates.join(
				"&"
			)}&bedrooms=${bedrooms}&familyRooms=${familyRooms}&roundtrip=${
				tripType === "round-trip"
			}`,
			{ headers: { "captcha-token": await getCaptchaToken() } }
		);

		if (response.status !== 200) {
			setProgressText(
				`API connection failed with HTTP status ${response.status}`
			);
			setSearchError(true);
			return;
		}

		const tokenRequest = await response.json();

		const channelName = tokenRequest.channel;

		const client = Ably.Realtime.Promise({
			authCallback: async (tokenParams, callback) => {
				callback(null, tokenRequest.tokenDetails);
			},
		});
		setClientState(client);

		let resultBytes = new Uint8Array([]);

		client.connection.on("connected", () => {
			const channel = client.channels.get(channelName);
			channel.subscribe((message) => {
				if (message.name === "status" || message.name === "warning") {
					setProgressText(message.data.message);
					setProgressPercent(message.data.percentComplete);
				} else if (message.name === "result") {
					resultBytes = new Uint8Array([
						...resultBytes,
						...new Uint8Array(message.data),
					]);
				} else if (message.name === "result-last") {
					resultBytes = new Uint8Array([
						...resultBytes,
						...new Uint8Array(message.data),
					]);
					client.close();
					setSearching(false);
					const fares = pako.inflate(resultBytes, { to: "string" });
					setFares(JSON.parse(fares));
					document.getElementById("root").style.height = "auto";
					localStorage.setItem("fares", JSON.stringify(fares));
					localStorage.setItem("tripType", JSON.stringify(tripType));
					localStorage.setItem("travelerTypes", JSON.stringify(travelerTypes));
					localStorage.setItem("origin", JSON.stringify(origin));
					localStorage.setItem("destination", JSON.stringify(destination));
					localStorage.setItem("tab", JSON.stringify(tab));
					localStorage.setItem("weeks", JSON.stringify(weeks));
					localStorage.setItem("weeksSelected", JSON.stringify(weeksSelected));
					localStorage.setItem("days", JSON.stringify(days));
					localStorage.setItem("daysSelected", JSON.stringify(daysSelected));
					localStorage.setItem("weekdays", JSON.stringify(weekdays));
					localStorage.setItem("weekends", JSON.stringify(weekends));
					localStorage.setItem("month", JSON.stringify(month));
					localStorage.setItem(
						"dateRangeStart",
						JSON.stringify(dateRangeStart)
					);
					localStorage.setItem("dateRangeEnd", JSON.stringify(dateRangeEnd));
					localStorage.setItem(
						"maxDateRangeEnd",
						JSON.stringify(maxDateRangeEnd)
					);
					localStorage.setItem("route", JSON.stringify(route));
					return;
				} else {
					setProgressText(message.data);
					setSearchError(true);
				}
			});
		});
	}

	return (
		<form id="form" style={{ marginBottom: fares.length === 0 ? "2rem" : 0 }}>
			<div className="input-row secondary-input">
				{!searching && fares.length === 0 ? (
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
							values={fareClasses}
							searching={searching}
						/>
					</div>
				) : (
					<div id="search-info">
						<span>{`${origin.name} (${origin.code})`}</span>
						{tripType === "round-trip" ? (
							<SyncAltIcon />
						) : (
							<ArrowRightAltIcon />
						)}
						<span>{`${destination.name} (${destination.code})`}</span>
					</div>
				)}
				{!searching && fares.length === 0 && (
					<Settings
						bedrooms={bedrooms}
						setBedrooms={setBedrooms}
						familyRooms={familyRooms}
						setFamilyRooms={setFamilyRooms}
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
				)}
			</div>
			{!searching && fares.length === 0 ? (
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
						stationFormat={stationFormat}
					/>
					<DateRangeSelect
						tripType={tripType}
						tab={tab}
						setTab={setTab}
						anyDuration={anyDuration}
						setAnyDuration={setAnyDuration}
						weeks={weeks}
						setWeeks={setWeeks}
						weeksSelected={weeksSelected}
						setWeeksSelected={setWeeksSelected}
						days={days}
						setDays={setDays}
						daysSelected={daysSelected}
						setDaysSelected={setDaysSelected}
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
						searching={searching}
						fares={fares}
					/>
				</div>
			) : (
				<div className="input-row" id="primary-input">
					<TravelerTypeSelect
						value={travelerTypes}
						setValue={setTravelerTypes}
						searching={searching || fares.length > 1}
					/>
					<FareClassSelect
						value={fareClass}
						setValue={setFareClass}
						values={fareClasses}
						searching={searching || fares.length > 1}
					/>
					{mutualRoutes.length > 2 && (
						<RouteSelect
							value={route}
							setValue={setRoute}
							values={mutualRoutes}
						/>
					)}
					<DateRangeSelect
						tripType={tripType}
						tab={tab}
						setTab={setTab}
						anyDuration={anyDuration}
						setAnyDuration={setAnyDuration}
						weeks={weeks}
						setWeeks={setWeeks}
						weeksSelected={weeksSelected}
						setWeeksSelected={setWeeksSelected}
						days={days}
						setDays={setDays}
						daysSelected={daysSelected}
						setDaysSelected={setDaysSelected}
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
						searching={searching}
						fares={fares}
					/>
				</div>
			)}
			{!searching &&
				fares.length === 0 &&
				(errorType > 1 || (showSearchErrors && errorType === 1)) &&
				(errorType === 1 ? (
					<div className="error-text error-1">
						<ErrorIcon fontSize="small" />
						<span>{errorText}</span>
					</div>
				) : (
					<div className="error-text">
						<RailwayAlertIcon fontSize="small" />
						<span>{errorText}</span>
					</div>
				))}
			<div style={{ height: 0 }}>
				<Fab
					color="primary"
					id={searching ? "cancel-search" : ""}
					onClick={handleSearch}
					variant="extended"
					size="medium"
					sx={{
						backgroundColor: fares.length > 0 || searching ? "red" : "#89B3F7",
						bottom: `-${
							!searching &&
							fares.length === 0 &&
							(errorType > 1 || (showSearchErrors && errorType === 1))
								? "2.5"
								: "1.75"
						}rem`,
						transition: "0.5s bottom",
						":hover": { bgcolor: !searching ? "primary.hover" : "red" },
					}}
				>
					{fares.length > 0 || searchError ? (
						<ArrowBackIcon sx={{ mr: 1 }} />
					) : searching ? (
						<CancelIcon sx={{ mr: 1 }} />
					) : (
						<TravelExploreIcon sx={{ mr: 1 }} />
					)}
					{fares.length > 0 || searchError
						? "Back"
						: searching
						? "Cancel"
						: "Search"}
				</Fab>
				{errorType !== 1 && (
					<Dialog onClose={() => setSleeperOpen(false)} open={sleeperOpen}>
						<DialogTitle>Sleeper Accommodation Pricing</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{`Sleeper accommodations may be available on your trip between ${origin.city} and ${destination.city}. Do you need Bedroom or Family Room prices?`}
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
				<Dialog onClose={setBrowserWarning} open={browserDialog}>
					<DialogTitle>Browser Compatibility Warning</DialogTitle>
					<DialogContent>
						<DialogContentText>
							It looks like you're using Firefox. There is a known bug with
							Amtrak booking which only occurs in Firefox, consider using
							another browser if you need this functionality.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={setBrowserWarning}>OK</Button>
					</DialogActions>
				</Dialog>
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
				<Snackbar open={wakeError}>
					<Alert severity="error" variant="filled">
						<AlertTitle sx={{ textAlign: "left" }}>
							API Connection Failed
						</AlertTitle>
						Could not reach https://api.railsave.rs/wake
					</Alert>
				</Snackbar>
			</div>
		</form>
	);
}
