import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import FormControlLabel from "@mui/material/FormControlLabel";
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
	setDateTimeRequested,
	showTurnstile,
	setShowTurnstile,
	searchAnimationsBool,
	setSearchAnimationsBool,
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
				setOrigin(stations.find((station) => station.id === cached.origin));
				setDestination(
					stations.find((station) => station.id === cached.destination)
				);
				setDateRangeStart(dayjs(cached.startDate).utc());
				setDateRangeEnd(dayjs(cached.endDate).utc());
				setDateRangeStartSearch(dayjs(cached.startDate).utc());
				setDateRangeEndSearch(dayjs(cached.endDate).utc());
				setDateTimeRequested(dayjs.utc(cached.dateTimeRequested));
				setFares(cached.trips);
			}
		} else if (mode === "search") {
			if (stations.length > 0 && checkSearchId()) {
				setRoundTrip(id.split("_").length === 2);
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
						setShowTurnstile(true);
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

	const [remindAddAccommsBool, setRemindAddAccommsBool] = useState(
		localStorage.getItem("remind-add-accomms")
			? JSON.parse(localStorage.getItem("remind-add-accomms"))
			: true
	);

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
		let res = await fetch(`${process.env.REACT_APP_API_DOMAIN}/geolocate`);
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
					Math.sqrt((a.lon - res.lon) ** 2 + (a.lat - res.lat) ** 2) -
					Math.sqrt((b.lon - res.lon) ** 2 + (b.lat - res.lat) ** 2)
			)
			.slice(0, 5)
			.map((station) => ({ ...station, group: "Nearby" }))
			.concat(stationsData);
		if (
			Math.sqrt(
				(sortedStationsData[0].lon - res.lon) ** 2 +
					(sortedStationsData[0].lat - res.lat) ** 2
			) >= 4
		) {
			return;
		}
		setStations(sortedStationsData);
		setOrigin(sortedStationsData[0]);
		setUpdateMap((updateMap) => !updateMap);
	}

	const [devDialog, setDevDialog] = useState(false);

	function startup() {
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
			setSearching(false);
			setTimeout(() => {
				setUpdateMap((updateMap) => !updateMap);
			}, 500);
		} else if (errorType === 1) {
			setShowSearchErrors(false);
			setTimeout(() => {
				setShowSearchErrors(true);
			}, 0);
		} else if (
			remindAddAccommsBool &&
			!bedrooms &&
			!familyRooms &&
			!["First", "Roomette"].includes(fareClass)
		) {
			setSleeperOpen(true);
		} else {
			setShowTurnstile(true);
		}
	}

	function getTurnstileToken() {
		return new Promise((res, rej) => {
			const turnstileId = window.turnstile.render("#turnstile", {
				callback: (token) => {
					setShowTurnstile(false);
					window.turnstile.remove(turnstileId);
					return res(token);
				},
				"refresh-expired": "never",
				sitekey: "0x4AAAAAAAQXqospSaYctMbi",
			});
		});
	}

	const wsRef = useRef();

	async function search() {
		setProgressPercent(0);
		setProgressText("Connecting...");
		setSearching(true);

		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			if (!Cookies.get("token")) {
				const tokenResponse = await fetch(
					`${process.env.REACT_APP_API_DOMAIN}/authorize`,
					{
						headers: process.env.REACT_APP_AUTH_KEY
							? { "railforless-auth": process.env.REACT_APP_AUTH_KEY }
							: { "auth-turnstile": await getTurnstileToken() },
					}
				);
				if (tokenResponse.status !== 200) {
					setProgressText(
						tokenResponse.status === 401
							? "Turnstile validation failed"
							: `API connection failed with HTTP status ${tokenResponse.status}`
					);
					setSearchError(true);
					return;
				}
				const cookie = await tokenResponse.json();
				Cookies.set("token", cookie.access_token, {
					expires: cookie.expires_in / (60 * 60 * 24),
					secure: true,
					sameSite: "strict",
				});
			}
			wsRef.current = new WebSocket(
				`${process.env.REACT_APP_API_DOMAIN.replace(
					/^http(s)?:\/\//,
					"ws$1://"
				)}/connect?token=${Cookies.get("token")}`
			);
		}
		setShowTurnstile(false);

		const wsSearch = JSON.stringify({
			origin: origin.code,
			destination: destination.code,
			startDate: dateRangeStart.toISOString(),
			endDate: dateRangeEnd.toISOString(),
			roundTrip,
			bedrooms,
			familyRooms,
		});

		if (wsRef.current.readyState !== WebSocket.OPEN) {
			wsRef.current.onopen = () => wsRef.current.send(wsSearch);
		} else {
			wsRef.current.send(wsSearch);
		}

		let cacheId = 0;
		wsRef.current.onmessage = (event) => {
			if (typeof event.data !== "string") {
				return;
			}
			const data = JSON.parse(event.data);
			if (data.event === "status") {
				setProgressText(data.message.message);
				setProgressPercent(data.message.percentComplete);
			} else if (data.event === "cache-id") {
				cacheId = data.message;
			} else if (data.event === "result") {
				setSearching(false);
				setFares(data.message);
				setTimeout(() => navigate(`/cached/${cacheId}`), 100);
				document.getElementById("root").style.height = "auto";
				return;
			} else {
				setProgressText(data.message);
				setSearchError(true);
			}
		};
	}

	useEffect(() => {
		if (showTurnstile) {
			search();
		}
	}, [showTurnstile]);

	function handleRemindAddAccomms() {
		setRemindAddAccommsBool(!remindAddAccommsBool);
		localStorage.setItem(
			"remind-add-accomms",
			JSON.stringify(!remindAddAccommsBool)
		);
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
							setBedrooms={setBedrooms}
							setFamilyRooms={setFamilyRooms}
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
						remindAddAccommsBool={remindAddAccommsBool}
						handleRemindAddAccomms={handleRemindAddAccomms}
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
						searchAnimationsBool={searchAnimationsBool}
						setSearchAnimationsBool={setSearchAnimationsBool}
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
						fixedDates={false}
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
						setBedrooms={setBedrooms}
						setFamilyRooms={setFamilyRooms}
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
						fixedDates={true}
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
						backgroundColor:
							fares.length === 0 && !searchError && searching
								? "red"
								: "#89B3F7",
						bottom: `-${
							!searching &&
							fares.length === 0 &&
							(errorType > 1 || (showSearchErrors && errorType === 1))
								? "2.5"
								: "1.75"
						}rem`,
						transition: "0.5s bottom",
						":hover": {
							bgcolor:
								fares.length === 0 && !searchError && searching
									? "red"
									: "primary.hover",
						},
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
						? "New search"
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
							<FormControlLabel
								control={
									<Checkbox
										checked={!remindAddAccommsBool}
										onChange={handleRemindAddAccomms}
									/>
								}
								label="Don't ask me again"
							/>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => {
									setSleeperOpen(false);
									setShowTurnstile(true);
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
