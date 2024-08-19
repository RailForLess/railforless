import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Home.css";
import Form from "./Form";
import Hero from "./Hero";
import Loading from "./Loading";
import Map from "./Map";
import NotFound from "./NotFound";
import Progress from "./Progress";
import Fares from "./Fares";

export default function Home({
	searching,
	setSearching,
	searchError,
	setSearchError,
}) {
	const navigate = useNavigate();

	const { mode, "*": id } = useParams();

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

	const routeLinks = {
		Acela: "acela",
		Adirondack: "adirondack",
		"Auto Train": "auto",
		"Blue Water": "michigan-services",
		Borealis: "borealis",
		"California Zephyr": "california-zephyr",
		"Capitol Limited": "capitol-limited",
		Cardinal: "cardinal",
		Cascades: "cascades",
		"Lincoln Service": "lincoln-service-missouri-river-runner",
		"Coast Starlight": "coast-starlight",
		"Empire Builder": "empire-builder",
		"Empire Service": "empire-service",
		"Ethan Allen-Express": "ethan-allen-express",
		"Heartland Flyer": "heartland-flyer",
		Hiawatha: "hiawatha",
		Saluki: "illinois-services",
		"Illinois Zephyr": "illinois-services",
		"Keystone Service": "keystone-service",
		"Lake Shore Limited": "lake-shore-limited",
		"Maple Leaf": "maple-leaf",
		"Hartford Line": "amtrak-hartford-line",
		"Pacific Surfliner": "pacific-surfliner",
		Pennsylvanian: "pennsylvanian",
		"Northeast Regional": "northeast-regional",
		"San Joaquins": "san-joaquins",
		"Silver Service/Palmetto": "silver-service-palmetto",
		"Southwest Chief": "southwest-chief",
		"Sunset Limited": "sunset-limited",
		Downeaster: "downeaster",
		"City Of New Orleans": "city-of-new-orleans",
		Crescent: "crescent",
		"Missouri River Runner": "lincoln-service-missouri-river-runner",
		"Texas Eagle": "texas-eagle",
		"Pere Marquette": "michigan-services",
		Wolverine: "michigan-services",
		"Capitol Corridor": "capitol-corridor",
		Vermonter: "vermonter",
		Carolinian: "carolinian-piedmont",
		Piedmont: "carolinian-piedmont",
	};

	const [notFound, setNotFoundState] = useState(false);
	const [msg, setMsg] = useState(null);

	function setNotFound(notFound, msg = null) {
		setNotFoundState(notFound);
		setMsg(msg);
	}

	function newSearch() {
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
		setTimeout(() => {
			setUpdateMap((updateMap) => !updateMap);
		}, 500);
		setSearching(false);
		setSearchError(false);
		setTripDuration({ type: null, val: null });
		setFlexible(true);
		setDateRangeStart(dayjs.utc().startOf("d").add(1, "M").startOf("M"));
		setDateRangeEnd(dayjs.utc().startOf("d").add(1, "M").endOf("M"));
		setDateRangeStartSearch(dayjs.utc().startOf("d").add(1, "M").startOf("M"));
		setDateRangeEndSearch(dayjs.utc().startOf("d").add(1, "M").endOf("M"));
	}

	const [dateTimeRequested, setDateTimeRequested] = useState(null);

	return !notFound ? (
		<div className="main-container">
			<Hero />
			<div id="hero-container">
				<div className="fade-in-translate" id="hero-text">
					<h1>
						RailForLess.us<span>v2</span>
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
						routeLinks={routeLinks}
						dateTimeRequested={dateTimeRequested}
					/>
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
						route={route}
						setRoute={setRoute}
						routeLinks={routeLinks}
					/>
				)}
			</div>
		</div>
	) : (
		<NotFound msg={msg} />
	);
}
