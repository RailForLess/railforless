import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Home.css";
import Fares from "./Fares";
import Form from "./Form";
import Hero from "./Hero";
import Loading from "./Loading";
import Map from "./Map";
import NotFound from "./NotFound";
import Progress from "./Progress";
import Turnstile from "./Turnstile";

export default function Home({
	searching,
	setSearching,
	searchError,
	setSearchError,
	showTurnstile,
	setShowTurnstile,
	searchAnimationsBool,
	setSearchAnimationsBool,
}) {
	const navigate = useNavigate();

	const { mode } = useParams();

	const [roundTrip, setRoundTrip] = useState(true);
	const [travelerTypes, setTravelerTypes] = useState({
		numAdults: 1,
		numSeniors: 0,
		numYouth: 0,
		numChildren: 0,
		numInfants: 0,
	});
	const [fareClass, setFareClass] = useState("Any class");
	const [fareClasses, setFareClasses] = useState([
		"Any class",
		"Coach",
		"Business",
		"First",
		"Sleeper",
		"Roomette",
		"Bedroom",
		"Family Room",
	]);
	const [strict, setStrict] = useState(false);

	const [stations, setStations] = useState([]);
	const [origin, setOrigin] = useState(null);
	const [destination, setDestination] = useState(null);
	const [tripDuration, setTripDuration] = useState({ type: null, val: null });
	const [flexible, setFlexible] = useState(true);
	const [dateRangeStart, setDateRangeStart] = useState(
		dayjs.utc().startOf("d").add(1, "M").startOf("M")
	);
	const [dateRangeEnd, setDateRangeEnd] = useState(
		dayjs.utc().startOf("d").add(1, "M").endOf("M")
	);
	const [dateRangeStartSearch, setDateRangeStartSearch] =
		useState(dateRangeStart);
	const [dateRangeEndSearch, setDateRangeEndSearch] = useState(dateRangeEnd);

	const [updateMap, setUpdateMap] = useState(false);
	const [route, setRoute] = useState("Any-route");
	const [progressPercent, setProgressPercent] = useState(0);
	const [progressText, setProgressText] = useState("");
	const [fares, setFares] = useState([]);

	const [notFound, setNotFoundState] = useState(false);
	const [msg, setMsg] = useState(null);

	function setNotFound(notFound, msg = null) {
		setNotFoundState(notFound);
		setMsg(msg);
	}

	const [refreshCount, setRefreshCount] = useState(0);

	function newSearch(refresh) {
		setDateTimeRequested(null);
		setFares([]);
		navigate("/");
		document.getElementById("root").style.height = "100vh";
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
		setUpdateMap((updateMap) => !updateMap);
		setSearching(false);
		setSearchError(false);
		if (dateRangeStart.isBefore(dayjs.utc().startOf("d").add(1, "d"))) {
			setTripDuration({ type: null, val: null });
			setFlexible(true);
			setDateRangeStart(dayjs.utc().startOf("d").add(1, "M").startOf("M"));
			setDateRangeEnd(dayjs.utc().startOf("d").add(1, "M").endOf("M"));
			setDateRangeStartSearch(
				dayjs.utc().startOf("d").add(1, "M").startOf("M")
			);
			setDateRangeEndSearch(dayjs.utc().startOf("d").add(1, "M").endOf("M"));
		}
		if (refresh) {
			setRefreshCount(refreshCount + 1);
		}
	}

	useEffect(() => {
		if (refreshCount) {
			setShowTurnstile(true);
		}
	}, [refreshCount]);

	const [dateTimeRequested, setDateTimeRequested] = useState(null);

	const [swapped, setSwapped] = useState(false);

	function swapStations() {
		setSwapped(!swapped);
		setDestination(origin);
		setOrigin(destination);
		setUpdateMap((updateMap) => !updateMap);
	}

	return !notFound ? (
		<div className="main-container">
			<Hero />
			<div id="hero-container">
				<div className="fade-in-translate" id="hero-text">
					<h1>
						RailForLess.us<span>v3</span>
					</h1>
				</div>
				<Form
					roundTrip={roundTrip}
					setRoundTrip={setRoundTrip}
					travelerTypes={travelerTypes}
					setTravelerTypes={setTravelerTypes}
					fareClass={fareClass}
					setFareClass={setFareClass}
					fareClasses={fareClasses}
					strict={strict}
					setStrict={setStrict}
					stations={stations}
					setStations={setStations}
					origin={origin}
					setOrigin={setOrigin}
					destination={destination}
					setDestination={setDestination}
					flexible={flexible}
					setFlexible={setFlexible}
					tripDuration={tripDuration}
					setTripDuration={setTripDuration}
					dateRangeStart={dateRangeStart}
					setDateRangeStart={setDateRangeStart}
					dateRangeEnd={dateRangeEnd}
					setDateRangeEnd={setDateRangeEnd}
					dateRangeStartSearch={dateRangeStartSearch}
					setDateRangeStartSearch={setDateRangeStartSearch}
					dateRangeEndSearch={dateRangeEndSearch}
					setDateRangeEndSearch={setDateRangeEndSearch}
					setUpdateMap={setUpdateMap}
					searching={searching}
					setSearching={setSearching}
					setProgressPercent={setProgressPercent}
					setProgressText={setProgressText}
					searchError={searchError}
					setSearchError={setSearchError}
					fares={fares}
					setFares={setFares}
					newSearch={newSearch}
					setNotFound={setNotFound}
					setDateTimeRequested={setDateTimeRequested}
					showTurnstile={showTurnstile}
					setShowTurnstile={setShowTurnstile}
					searchAnimationsBool={searchAnimationsBool}
					setSearchAnimationsBool={setSearchAnimationsBool}
					swapped={swapped}
					swapStations={swapStations}
				/>
				{fares.length > 0 && stations.length > 0 ? (
					<Fares
						roundTrip={roundTrip}
						flexible={flexible}
						travelerTypes={travelerTypes}
						fareClass={fareClass}
						setFareClasses={setFareClasses}
						strict={strict}
						stations={stations}
						origin={origin}
						destination={destination}
						tripDuration={tripDuration}
						dateRangeStart={dateRangeStartSearch}
						dateRangeEnd={dateRangeEndSearch}
						fares={fares}
						dateTimeRequested={dateTimeRequested}
					/>
				) : showTurnstile ? (
					<Turnstile />
				) : searching ? (
					<Progress
						progressPercent={progressPercent}
						progressText={progressText}
						searchError={searchError}
					/>
				) : mode && mode === "cached" ? (
					<Loading />
				) : (
					<Map
						stationsJSON={stations}
						origin={origin}
						setOrigin={setOrigin}
						destination={destination}
						setDestination={setDestination}
						updateMap={updateMap}
						setUpdateMap={setUpdateMap}
						route={route}
						setRoute={setRoute}
					/>
				)}
			</div>
		</div>
	) : (
		<NotFound msg={msg} />
	);
}
