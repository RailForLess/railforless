import Ably from "ably/promises";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import pako from "pako";
import DateRangePopover from "./DateRangePopover";
import FareClassSelect from "./FareClassSelect";
import Settings from "./Settings";
import StationSelect from "./StationSelect";
import TravelerTypeSelect from "./TravelerTypeSelect";
import RoundTripSelect from "./RoundTripSelect";
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
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function Form({
	roundTrip,
	setRoundTrip,
	travelerTypes,
	setTravelerTypes,
	fareClass,
	setFareClass,
	fareClasses,
	strict,
	setStrict,
	stations,
	setStations,
	origin,
	setOrigin,
	destination,
	setDestination,
	flexible,
	setFlexible,
	tripDuration,
	setTripDuration,
	dateRangeStart,
	setDateRangeStart,
	dateRangeEnd,
	setDateRangeEnd,
	dateRangeStartSearch,
	setDateRangeStartSearch,
	dateRangeEndSearch,
	setDateRangeEndSearch,
	setUpdateMap,
	searching,
	setSearching,
	setProgressPercent,
	setProgressText,
	searchError,
	setSearchError,
	fares,
	setFares,
	newSearch,
	setNotFound,
}) {
	const location = useLocation();
	const navigate = useNavigate();

	const { mode, "*": id } = useParams();

	function checkCacheId() {
		if (!id) {
			setNotFound(true, "Missing cache id");
			return false;
		}
		const split = id.split("_");
		if (split.length !== 2) {
			setNotFound(true, "Invalid cache id format");
			return false;
		}
		const stationCodes = split[0].split("-");
		if (
			stationCodes.length !== 2 ||
			!stations.find((station) => station.id === stationCodes[0]) ||
			!stations.find((station) => station.id === stationCodes[1])
		) {
			setNotFound(true, "Invalid station codes");
			return false;
		}
		const timestamp = Number(split[1]);
		if (
			!timestamp ||
			!dayjs(timestamp * 1000).isValid() ||
			!dayjs(timestamp * 1000).isBefore(dayjs())
		) {
			setNotFound(true, "Invalid timestamp");
			return false;
		}
		return true;
	}

	function checkSearchId() {
		if (!id) {
			setNotFound(true, "Missing search id");
			return false;
		}
		const split = id.split("_");
		if (split.length !== 2 && split.length !== 3) {
			setNotFound(true, "Invalid search id format");
			return false;
		}
		const stationCodes = split[0].split("-");
		if (
			stationCodes.length !== 2 ||
			!stations.find((station) => station.id === stationCodes[0]) ||
			!stations.find((station) => station.id === stationCodes[1])
		) {
			setNotFound(true, "Invalid station codes");
			return false;
		}
		const dates = split[1].split("-");
		if (
			dates.length !== 2 ||
			!dayjs(dates[0], "M/D/YY", true).isValid() ||
			!dayjs(dates[0], "M/D/YY", true)
				.utc()
				.isSameOrAfter(dayjs.utc().startOf("d").add(1, "d"), "d") ||
			!dayjs(dates[1], "M/D/YY", true).isValid() ||
			!dayjs(dates[0], "M/D/YY", true)
				.utc()
				.isSameOrBefore(
					dayjs.utc().startOf("d").add(11, "M").subtract(2, "d"),
					"d"
				) ||
			!dayjs(dates[1], "M/D/YY", true)
				.utc()
				.isSameOrAfter(dayjs(dates[0], "M/D/YY", true).utc(), "d")
		) {
			setNotFound(true, "Invalid dates");
			return false;
		}
		if (split.length === 3 && split[2] !== "oneWay") {
			setNotFound(true, "Invalid trip type");
		}
		return true;
	}

	const [searchSnackbar, setSearchSnackbar] = useState(false);
	const [searchSnackbarTime, setSearchSnackbarTime] = useState(5);
	const timerRef = useRef();

	function handleCancelSearch() {
		setSearchSnackbar(false);
		clearInterval(timerRef.current);
	}

	async function updatePage() {
		if (mode === "cached") {
			if (stations.length > 0 && fares.length === 0 && checkCacheId()) {
				let res = await fetch(
					`${process.env.REACT_APP_API_DOMAIN}/cached/${id}`
				);
				if (res.status !== 200) {
					setNotFound(true, "Cached search not found");
					return;
				}
				const cached = await res.json();
				if (!window.location.pathname.includes("cached")) {
					return;
				}

				document.getElementById("root").style.height = "auto";
				setRoundTrip(cached.roundTrip);
				//setTravelerTypes(JSON.parse(localStorage.getItem("travelerTypes")));
				setOrigin(stations.find((station) => station.id === cached.origin));
				setDestination(
					stations.find((station) => station.id === cached.destination)
				);
				//setFlexible(JSON.parse(localStorage.getItem("flexible")));
				//setTripDuration(JSON.parse(localStorage.getItem("tripDuration")));
				setDateRangeStart(dayjs(cached.dates[0]).utc());
				setDateRangeEnd(dayjs(cached.dates[cached.dates.length - 1]).utc());
				setDateRangeStartSearch(dayjs(cached.dates[0]).utc());
				setDateRangeEndSearch(
					dayjs(cached.dates[cached.dates.length - 1]).utc()
				);
				setFares(cached.trips);
			}
		} else if (mode === "search") {
			if (stations.length > 0 && checkSearchId()) {
				setRoundTrip(id.split("_").length === 2);
				//setTravelerTypes(JSON.parse(localStorage.getItem("travelerTypes")));
				setOrigin(
					stations.find(
						(station) => station.id === id.split("_")[0].split("-")[0]
					)
				);
				setDestination(
					stations.find(
						(station) => station.id === id.split("_")[0].split("-")[1]
					)
				);
				//setFlexible(JSON.parse(localStorage.getItem("flexible")));
				//setTripDuration(JSON.parse(localStorage.getItem("tripDuration")));
				setDateRangeStart(
					dayjs(id.split("_")[1].split("-")[0], "M/D/YY", true).utc()
				);
				setDateRangeEnd(
					dayjs(id.split("_")[1].split("-")[1], "M/D/YY", true).utc()
				);
				setDateRangeStartSearch(
					dayjs(id.split("_")[1].split("-")[0], "M/D/YY", true).utc()
				);
				setDateRangeEndSearch(
					dayjs(id.split("_")[1].split("-")[1], "M/D/YY", true).utc()
				);

				setSearchSnackbar(true);
			}
		} else if (mode) {
			setNotFound(true, "Invalid URL");
		}
	}

	useEffect(() => {
		if (searchSnackbar) {
			timerRef.current = setInterval(() => {
				setSearchSnackbarTime((prevSearchSnackbarTime) => {
					if (prevSearchSnackbarTime === 1) {
						clearInterval(timerRef.current);
						setSearchSnackbar(false);
						search();
					}
					return prevSearchSnackbarTime - 1;
				});
			}, 1000);
		}
	}, [searchSnackbar]);

	useEffect(() => {
		updatePage();
	}, [location, stations]);

	useEffect(() => {
		if (location.pathname === "/") {
			setFares([]);
		}
	}, [location]);

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
		if (window.location.pathname !== "/") {
			return;
		}
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
		setUpdateMap((updateMap) => !updateMap);
	}

	let wakeRes;
	async function wake() {
		wakeRes = await fetch(`${process.env.REACT_APP_API_DOMAIN}/wake`);
	}
	const [wakeError, setWakeError] = useState(false);
	const [devDialog, setDevDialog] = useState(false);

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
				if (window.location.pathname === "/") {
					setTimeout(() => geolocate(data), 500);
				}
			});
	}

	useEffect(() => {
		if (process.env.REACT_APP_API_DOMAIN.includes("dev")) {
			setDevDialog(true);
		} else {
			startup();
		}
	}, []);

	const [bedrooms, setBedrooms] = useState(false);
	const [familyRooms, setFamilyRooms] = useState(false);

	const [swapped, setSwapped] = useState(false);

	function swapStations() {
		setSwapped(!swapped);
		setDestination(origin);
		setOrigin(destination);
		setUpdateMap((updateMap) => !updateMap);
	}

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
	}, [origin, destination]);

	const [sleeperOpen, setSleeperOpen] = useState(false);

	function handleSearch() {
		if (fares.length > 0 || searchError) {
			newSearch();
		} else if (searching) {
			if (clientState) {
				clientState.close();
			}
			setSearching(false);
			setTimeout(() => {
				setUpdateMap((updateMap) => !updateMap);
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
				search();
			}
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
			`${process.env.REACT_APP_API_DOMAIN}/token?origin=${
				origin.code
			}&destination=${destination.code}&${dates.join(
				"&"
			)}&bedrooms=${bedrooms}&familyRooms=${familyRooms}&roundTrip=${roundTrip}`,
			{
				headers: process.env.REACT_APP_AUTH_STRING
					? { "railsavers-auth": process.env.REACT_APP_AUTH_STRING }
					: { "captcha-token": await getCaptchaToken() },
			}
		);

		if (response.status !== 200) {
			setProgressText(
				response.status === 401
					? "reCAPTCHA validation failed"
					: `API connection failed with HTTP status ${response.status}`
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

		let cacheId = 0;
		let resultBytes = new Uint8Array([]);

		client.connection.on("connected", () => {
			const channel = client.channels.get(channelName);
			channel.subscribe((message) => {
				if (message.name === "status" || message.name === "warning") {
					setProgressText(message.data.message);
					setProgressPercent(message.data.percentComplete);
				} else if (message.name === "cache-id") {
					cacheId = message.data;
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
					setTimeout(() => navigate(`/cached/${cacheId}`), 100);
					document.getElementById("root").style.height = "auto";
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
						<RoundTripSelect value={roundTrip} setValue={setRoundTrip} />
						<TravelerTypeSelect
							value={travelerTypes}
							setValue={setTravelerTypes}
							searching={searching}
						/>
						<FareClassSelect
							value={fareClass}
							setValue={setFareClass}
							values={fareClasses}
							strict={strict}
							setStrict={setStrict}
							searching={searching}
						/>
					</div>
				) : (
					<div id="search-info">
						<span>{`${origin.name} (${origin.code})`}</span>
						{roundTrip ? <SyncAltIcon /> : <ArrowRightAltIcon />}
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
						setUpdateMap={setUpdateMap}
						stations={stations}
						nearbyCitiesBool={nearbyCitiesBool}
						stationFormat={stationFormat}
					/>
					<DateRangePopover
						roundTrip={roundTrip}
						flexible={flexible}
						setFlexible={setFlexible}
						tripDuration={tripDuration}
						setTripDuration={setTripDuration}
						dateRangeStart={dateRangeStart}
						setDateRangeStart={setDateRangeStart}
						dateRangeEnd={dateRangeEnd}
						setDateRangeEnd={setDateRangeEnd}
						minDate={dayjs.utc().startOf("d").add(1, "d")}
						maxDate={dayjs.utc().startOf("d").add(11, "M").subtract(2, "d")}
						setDateRangeStartSearch={setDateRangeStartSearch}
						setDateRangeEndSearch={setDateRangeEndSearch}
						fares={fares}
						searching={searching}
						newSearch={newSearch}
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
						strict={strict}
						setStrict={setStrict}
						searching={searching || fares.length > 1}
					/>
					<DateRangePopover
						roundTrip={roundTrip}
						flexible={flexible}
						setFlexible={setFlexible}
						tripDuration={tripDuration}
						setTripDuration={setTripDuration}
						dateRangeStart={dateRangeStartSearch}
						setDateRangeStart={setDateRangeStartSearch}
						dateRangeEnd={dateRangeEndSearch}
						setDateRangeEnd={setDateRangeEndSearch}
						minDate={dateRangeStart}
						maxDate={dateRangeEnd}
						setDateRangeStartSearch={setDateRangeStartSearch}
						setDateRangeEndSearch={setDateRangeEndSearch}
						fares={fares}
						searching={searching}
						newSearch={newSearch}
					/>
				</div>
			)}
			{!searching &&
				fares.length === 0 &&
				(errorType > 1 || (showSearchErrors && errorType === 1)) &&
				(errorType === 1 ? (
					<div className="error-critical error-text">
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
						<DialogTitle>Additional Accommodations</DialogTitle>
						<DialogContent>
							<DialogContentText>
								{`Include Bedrooms and/or Family Rooms in search? This may lengthen wait times, especially for round trip and/or multi-leg trips.`}
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => {
									setSleeperOpen(false);
									search();
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
				<Dialog open={devDialog}>
					<DialogTitle>Are you sure you're at the right place?</DialogTitle>
					<DialogContent>
						<DialogContentText>
							This is the development site, here you'll find the latest features
							under development. Most users should use the main site at{" "}
							<a href="https://railforless.us">railforless.us</a>.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => (window.location.href = "https://railforless.us")}
						>
							Take me to railforless.us
						</Button>
						<Button
							onClick={() => {
								setDevDialog(false);
								startup();
							}}
						>
							Continue to dev site
						</Button>
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
				<Snackbar
					action={
						<Button onClick={handleCancelSearch} variant="contained">
							Cancel
						</Button>
					}
					message={`Searching in ${searchSnackbarTime} second${
						searchSnackbarTime !== 1 ? "s" : ""
					}...`}
					onClose={() => setSearchSnackbar(false)}
					open={searchSnackbar}
				/>
			</div>
		</form>
	);
}
