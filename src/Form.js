import React, { useEffect, useState } from "react";
import { getDialog } from "./Dialog";
import Status from "./Status";
import "./Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleDown,
	faCircleQuestion,
	faDollarSign,
	faRightLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function Form({ fares, setFares, progress, setProgress }) {
	let [allStations, setAllStations] = useState({});
	let [deptStations, setDeptStations] = useState({});
	let [arrivalStations, setArrivalStations] = useState({});

	useEffect(() => {
		fetch("/api/stations")
			.then((res) => res.json())
			.then((data) => {
				setAllStations({ ...data.stations });
				setDeptStations({ ...data.stations });
				setArrivalStations({ ...data.stations });
			});
	}, []);

	function renderStations(stations) {
		return Object.keys(stations).map((station) => (
			<option key={station} value={station}>
				{station}
			</option>
		));
	}

	function filterStations(routeStation, stations) {
		let filteredStations = {};
		for (const station in stations) {
			const mutualStation = stations[station].routes.some((route) => {
				return stations[routeStation].routes.includes(route);
			});
			if (mutualStation) {
				filteredStations[station] = stations[station];
			}
		}
		return filteredStations;
	}

	const [direct, setDirect] = useState(false);

	const [deptStation, setDeptStation] = useState("");

	if (arrivalStations.hasOwnProperty(deptStation)) {
		if (direct) {
			arrivalStations = filterStations(deptStation, arrivalStations);
		}
		delete arrivalStations[deptStation];
		setArrivalStations(arrivalStations);
	} else if (
		!allStations.hasOwnProperty(deptStation) &&
		Object.keys(arrivalStations).length !== Object.keys(allStations).length
	) {
		setArrivalStations({ ...allStations });
	}

	function handleSwap() {
		setDeptStations({ ...allStations });
		setArrivalStations({ ...allStations });
		const tempArrivalStation = arrivalStation;
		setArrivalStation(deptStation);
		setDeptStation(tempArrivalStation);
	}

	const [arrivalStation, setArrivalStation] = useState("");

	if (deptStations.hasOwnProperty(arrivalStation)) {
		if (direct) {
			deptStations = filterStations(arrivalStation, deptStations);
		}
		delete deptStations[arrivalStation];
		setDeptStations(deptStations);
	} else if (
		!allStations.hasOwnProperty(arrivalStation) &&
		Object.keys(deptStations).length !== Object.keys(allStations).length
	) {
		setDeptStations({ ...allStations });
	}

	function autocorrect(input, stations) {
		for (const station in allStations) {
			if (
				input.toLowerCase().replaceAll(" ", "") ===
					station.toLowerCase().replaceAll(" ", "") ||
				input === allStations[station].code
			) {
				if (
					allStations.hasOwnProperty(station) &&
					!stations.hasOwnProperty(station) &&
					direct &&
					station !== (arrivalStations ? deptStation : arrivalStation)
				) {
					getDialog(
						`Direct routes only enabled, but ${
							stations === deptStations ? station : deptStation
						} to ${
							stations === arrivalStations ? station : arrivalStation
						} is not a direct route. This option can be disabled under "More".`,
						"alert"
					);
					return "";
				}
				return station;
			}
		}
		return input;
	}

	useEffect(() => {
		if (deptStation === "Lorton (VA)") {
			setArrivalStation("Sanford (FL)");
		} else if (deptStation === "Sanford (FL)") {
			setArrivalStation("Lorton (VA)");
		}
	}, [deptStation]);

	useEffect(() => {
		if (arrivalStation === "Lorton (VA)") {
			setDeptStation("Sanford (FL)");
		} else if (arrivalStation === "Sanford (FL)") {
			setDeptStation("Lorton (VA)");
		}
	}, [arrivalStation]);

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [coach, setCoach] = useState(true);
	const [business, setBusiness] = useState(false);
	const [first, setFirst] = useState(false);

	function handleCheapestRoom() {
		setRoomette(false);
		setBedroom(false);
		setFamilyRoom(false);
		setCheapestRoom(!cheapestRoom);
	}

	const [cheapestRoom, setCheapestRoom] = useState(true);

	async function handleRoomType(roomType) {
		if (!direct) {
			if (
				!(await getDialog(
					"Fares for specific room types are only available on direct routes. Filter by direct routes only?",
					"confirm"
				))
			) {
				return;
			}
			setDirect(true);
			setArrivalStations({ ...allStations });
		}
		setCheapestRoom(false);
		switch (roomType) {
			case "roomette":
				setRoomette(!roomette);
				break;
			case "bedroom":
				setBedroom(!bedroom);
				break;
			case "family-room":
				setFamilyRoom(!familyRoom);
				break;
		}
	}

	const [roomette, setRoomette] = useState(false);
	const [bedroom, setBedroom] = useState(false);
	const [familyRoom, setFamilyRoom] = useState(false);

	async function handleDirect() {
		if (direct && (roomette || bedroom || familyRoom)) {
			if (
				!(await getDialog(
					"Fares for specific room types are only available on direct routes. Are you sure you want to disable this option?",
					"confirm"
				))
			) {
				return;
			}
			setRoomette(false);
			setBedroom(false);
			setFamilyRoom(false);
		}
		setDirect(!direct);
		setArrivalStations({ ...allStations });
	}

	const [route, setRoute] = useState("");
	const [mutualRoutes, setMutualRoutes] = useState([]);

	useEffect(() => {
		const tempMutualRoutes = getMutualRoutes();
		setMutualRoutes(tempMutualRoutes);
		if (tempMutualRoutes.length > 1) {
			switchMenu(setRouteExpanded, routeExpanded);
			setRouteExpanded(true);
			setRoute(tempMutualRoutes[0]);
		} else {
			setRoute("");
		}
	}, [deptStation, arrivalStation]);

	useEffect(() => {
		if (route === "Acela") {
			setCoach(false);
			setBusiness(true);
			setCheapestRoom(false);
			setRoomette(false);
			setBedroom(false);
			setFamilyRoom(false);
			setRoomsExpanded(false);
		} else {
			setFirst(false);
			setCoach(true);
			setBusiness(false);
			setCheapestRoom(true);
		}
	}, [route]);

	function getMutualRoutes() {
		const deptStationInfo = allStations[deptStation];
		const arrivalStationInfo = allStations[arrivalStation];
		const routes = [];
		if (deptStationInfo && arrivalStationInfo) {
			deptStationInfo.routes.forEach((route) => {
				if (arrivalStationInfo.routes.includes(route)) {
					routes.push(route);
				}
			});
		}
		return routes;
	}

	const [timeOfDay, setTimeOfDay] = useState("anytime");

	const [travelerQuantity, setTravelerQuantity] = useState("1");
	const [travelerType, setTravelerType] = useState("adult");

	const [share, setShare] = useState(true);

	function renderInputColor(station, stations) {
		if (!stations.hasOwnProperty(station)) {
			return "darkGray";
		}
	}

	function calcMaxStartDate() {
		const maxStartDate = new Date();
		maxStartDate.setFullYear(maxStartDate.getFullYear() + 1);
		return maxStartDate.toISOString().split("T")[0];
	}

	function calcMaxEndDate() {
		if (startDate) {
			const maxEndDate = new Date(startDate);
			maxEndDate.setDate(maxEndDate.getDate() + 29);
			const maxStartDate = new Date(calcMaxStartDate());
			return maxEndDate < maxStartDate
				? maxEndDate.toISOString().split("T")[0]
				: maxStartDate.toISOString().split("T")[0];
		} else {
			return calcMaxStartDate();
		}
	}

	function handleEndDate(endDate) {
		if (
			startDate &&
			!(new Date().getUTCHours() >= 1 && new Date().getUTCHours() < 13) &&
			Math.round(
				(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
			) > 8
		) {
			getDialog(
				"10-30 day searches are only available during off-peak times from 7PM-7AM CST. Consider shortening your search to 9 days or less or try again later.",
				"alert"
			);
			return "";
		} else {
			return endDate;
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!Object.keys(deptStations).includes(deptStation)) {
			getDialog("Please enter a valid departure station.", "alert");
			return;
		} else if (!Object.keys(arrivalStations).includes(arrivalStation)) {
			getDialog("Please enter a valid arrival station.", "alert");
			return;
		} else if (
			(deptStation === "Lorton (VA)" && arrivalStation !== "Sanford (FL)") ||
			(deptStation === "Sanford (FL)" && arrivalStation !== "Lorton (VA)") ||
			(arrivalStation === "Lorton (VA)" && deptStation !== "Sanford (FL)") ||
			(arrivalStation === "Sanford (FL)" && deptStation !== "Lorton (VA)")
		) {
			getDialog(
				"Auto Train is only available between Lorton (VA) and Sanford (FL).",
				"alert"
			);
			return;
		} else if (
			!(
				coach ||
				business ||
				first ||
				cheapestRoom ||
				roomette ||
				bedroom ||
				familyRoom
			)
		) {
			getDialog("Please select at least one seating or room option.", "alert");
			return;
		} else {
			let confirmMsg = "Please confirm the following information:<br><br>";
			confirmMsg += `Stations<br>&emsp;${deptStation} -> ${arrivalStation}<br>`;

			const dates = getDates(startDate, endDate);

			confirmMsg += `Date${dates.length > 1 ? "s" : ""}<br>`;
			confirmMsg += `&emsp;${dates[0]}`;
			confirmMsg += `${
				dates.length > 1 ? ` -> ${dates[dates.length - 1]}` : ""
			}<br>`;

			confirmMsg += "Seats<br>";
			if (!(coach || business || first)) {
				confirmMsg += "&emsp;None selected<br>";
			} else {
				confirmMsg += coach ? "&emsp;Coach<br>" : "";
				confirmMsg += business ? "&emsp;Business<br>" : "";
				confirmMsg += first ? "&emsp;First<br>" : "";
			}

			confirmMsg += "Rooms<br>";
			if (!(cheapestRoom || roomette || bedroom || familyRoom)) {
				confirmMsg += "&emsp;None selected<br>";
			} else {
				confirmMsg += cheapestRoom ? "&emsp;Cheapest available<br>" : "";
				confirmMsg += roomette ? "&emsp;Roomette<br>" : "";
				confirmMsg += bedroom ? "&emsp;Bedroom<br>" : "";
				confirmMsg += familyRoom ? "&emsp;Family Room<br>" : "";
			}

			confirmMsg += `${
				travelerQuantity > 1 ? "Travelers" : "Traveler"
			}<br>&emsp;${travelerQuantity} ${
				travelerType.charAt(0).toUpperCase() + travelerType.slice(1)
			}${travelerQuantity > 1 ? "s" : ""}<br>`;

			confirmMsg += "Route<br>";
			confirmMsg += `&emsp;${route ? route : "N/A"}<br>`;

			confirmMsg += "Time of day<br>";
			confirmMsg += `&emsp;${
				timeOfDay === "anytime" ? "Anytime" : timeOfDay
			}<br>`;

			confirmMsg += `<br>Estimated wait: ~${Math.ceil(
				dates.length / 3
			)} minute${Math.ceil(dates.length / 3) > 1 ? "s" : ""}<br>`;

			confirmMsg +=
				"<br>Requesting fares may take a few minutes and you will not be able to refresh this page.";
			confirmMsg += share
				? ' The results of this search will be shared with others at the bottom of this page. Fare sharing can be disabled under the "More" menu.'
				: "";

			if (!(await getDialog(confirmMsg, "confirm"))) {
				return;
			}
		}

		fetch("/api/status")
			.then((res) => res.json())
			.then((data) => {
				setStatus(data.status);
				if (!data.status) {
					getDialog(
						"Server busy, please wait. Refresh status indicator for updates.",
						"alert"
					);
					return;
				} else {
					setFares({});

					const socket = new WebSocket("wss://railforless.us/ws");

					// Enable the line below during development
					// const socket = new WebSocket("ws://localhost:5001");

					const fareMessage = {
						deptStation: deptStation,
						arrivalStation: arrivalStation,
						deptCode: deptStations[deptStation].code,
						arrivalCode: arrivalStations[arrivalStation].code,
						requestTime: JSON.stringify(new Date()),
						dates: getDates(startDate, endDate),
						coach: coach,
						business: business,
						first: first,
						cheapestRoom: cheapestRoom,
						roomette: roomette,
						bedroom: bedroom,
						familyRoom: familyRoom,
						route: route,
						timeOfDay: timeOfDay,
						travelerQuantity: travelerQuantity,
						travelerType: travelerType,
						share: share,
					};

					socket.onopen = (e) => {
						socket.send(JSON.stringify(fareMessage));
					};

					socket.onmessage = (msg) => {
						const data = JSON.parse(msg.data);
						if (data.progress) {
							setProgress(data.progress);
						} else if (data.fares) {
							socket.close();
							setFares(data.fares);
						}
					};
				}
			});
	}

	function getDates(startDate, endDate) {
		let date = new Date(startDate + "T00:00");
		const dates = [];
		while (date <= new Date(endDate + "T00:00")) {
			dates.push(date.toLocaleString().split(",")[0]);
			date.setDate(date.getDate() + 1);
		}
		return dates;
	}

	function updateStatus() {
		fetch("/api/status")
			.then((res) => res.json())
			.then((data) => {
				setStatus(data.status);
			});
	}

	const [status, setStatus] = useState(false);

	setInterval(() => {
		updateStatus();
	}, 5000);

	useEffect(() => {
		updateStatus();
	}, [fares, progress]);

	const [seatsExpanded, setSeatsExpanded] = useState(false);
	const [roomsExpanded, setRoomsExpanded] = useState(false);
	const [routeExpanded, setRouteExpanded] = useState(false);
	const [travelersExpanded, setTravelersExpanded] = useState(false);
	const [moreExpanded, setMoreExpanded] = useState(false);

	function switchMenu(setMenuExpanded, menuExpanded) {
		setSeatsExpanded(false);
		setRoomsExpanded(false);
		setRouteExpanded(false);
		setTravelersExpanded(false);
		setMoreExpanded(false);
		setMenuExpanded(!menuExpanded);
	}

	async function handleShare() {
		if (share) {
			if (
				!(await getDialog(
					"Sharing fares allows others to view the results of your search without having to make a new request. Are you sure you want to disable this option?",
					"confirm"
				))
			) {
				return;
			}
		}
		setShare(!share);
	}

	return (
		<form
			className="fade-in-translate"
			id="search-form"
			onSubmit={handleSubmit}
		>
			<div className="input-row">
				<datalist id="dept-stations">{renderStations(deptStations)}</datalist>
				<div className="input-column">
					<label htmlFor="from">Departure Station</label>
					{window.matchMedia("(min-width: 481px)").matches && (
						<input
							id="from"
							list="dept-stations"
							name="from"
							onChange={(e) =>
								setDeptStation(autocorrect(e.target.value, deptStations))
							}
							placeholder="name or code"
							required
							style={{ color: renderInputColor(deptStation, deptStations) }}
							type="search"
							value={deptStation}
						/>
					)}
					{window.matchMedia("(max-width: 480px)").matches && (
						<select
							id="from"
							name="from"
							onChange={(e) =>
								setDeptStation(autocorrect(e.target.value, deptStations))
							}
							required
							value={deptStation}
						>
							<option></option>
							{renderStations(deptStations)}
						</select>
					)}
				</div>
				<FontAwesomeIcon icon={faRightLeft} onClick={() => handleSwap()} />
				<datalist id="arrival-stations">
					{renderStations(arrivalStations)}
				</datalist>
				<div className="input-column">
					<label htmlFor="to">Arrival Station</label>
					{window.matchMedia("(min-width: 481px)").matches && (
						<input
							id="to"
							list="arrival-stations"
							name="to"
							onChange={(e) =>
								setArrivalStation(autocorrect(e.target.value, arrivalStations))
							}
							placeholder="name or code"
							required
							style={{
								color: renderInputColor(arrivalStation, arrivalStations),
							}}
							type="search"
							value={arrivalStation}
						/>
					)}
					{window.matchMedia("(max-width: 480px)").matches && (
						<select
							id="to"
							name="to"
							onChange={(e) =>
								setArrivalStation(autocorrect(e.target.value, arrivalStations))
							}
							required
							value={arrivalStation}
						>
							<option></option>
							{renderStations(arrivalStations)}
						</select>
					)}
				</div>
				<div className="input-column">
					<label htmlFor="start-date">Start Date</label>
					<input
						id="start-date"
						max={calcMaxStartDate()}
						min={new Date().toISOString().split("T")[0]}
						name="start-date"
						onChange={(e) => setStartDate(e.target.value)}
						required
						type="date"
						value={startDate}
					/>
				</div>
				<div className="input-column">
					<label htmlFor="end-date">End Date</label>
					<input
						id="end-date"
						max={calcMaxEndDate()}
						min={
							startDate.length > 0
								? startDate
								: new Date().toISOString().split("T")[0]
						}
						name="end-date"
						onChange={(e) => setEndDate(handleEndDate(e.target.value))}
						required
						type="date"
						value={endDate}
					/>
				</div>
				<div className="input-column">
					<input
						id="submit"
						name="submit"
						required
						type="submit"
						value="Get Fares"
					/>
				</div>
			</div>
			<div id="more-options">
				<div id="options-container">
					<div
						className="options-toggle"
						onClick={() => switchMenu(setSeatsExpanded, seatsExpanded)}
					>
						<h3>Seats</h3>
						<FontAwesomeIcon
							className="dropdown"
							icon={faAngleDown}
							style={{
								transform: seatsExpanded ? "rotate(180deg)" : "rotate(0)",
							}}
						/>
					</div>
					<div
						className="options-toggle"
						onClick={() => switchMenu(setRoomsExpanded, roomsExpanded)}
						style={{
							opacity: route === "Acela" ? "0.5" : "1",
							pointerEvents: route === "Acela" ? "none" : "auto",
						}}
					>
						<h3>Rooms</h3>
						<FontAwesomeIcon
							className="dropdown"
							icon={faAngleDown}
							style={{
								transform: roomsExpanded ? "rotate(180deg)" : "rotate(0)",
							}}
						/>
					</div>
					<div
						className="options-toggle"
						onClick={() => switchMenu(setRouteExpanded, routeExpanded)}
					>
						<h3>Route</h3>
						<FontAwesomeIcon
							className="dropdown"
							icon={faAngleDown}
							style={{
								transform: routeExpanded ? "rotate(180deg)" : "rotate(0)",
							}}
						/>
					</div>
					<div
						className="options-toggle"
						onClick={() => switchMenu(setTravelersExpanded, travelersExpanded)}
					>
						<h3>Travelers</h3>
						<FontAwesomeIcon
							className="dropdown"
							icon={faAngleDown}
							style={{
								transform: travelersExpanded ? "rotate(180deg)" : "rotate(0)",
							}}
						/>
					</div>
					<div
						className="options-toggle"
						onClick={() => switchMenu(setMoreExpanded, moreExpanded)}
					>
						<h3>More</h3>
						<FontAwesomeIcon
							className="dropdown"
							icon={faAngleDown}
							style={{
								transform: moreExpanded ? "rotate(180deg)" : "rotate(0)",
							}}
						/>
					</div>
				</div>
				<Status status={status} updateStatus={updateStatus} />
			</div>
			{seatsExpanded && (
				<div className="input-row">
					<div
						className="checkbox"
						style={{
							opacity: route === "Acela" ? "0.5" : "1",
							pointerEvents: route === "Acela" ? "none" : "auto",
						}}
					>
						<input
							checked={coach}
							{...(route === "Acela" && { disabled: true })}
							id="coach"
							name="coach"
							onChange={(e) => setCoach(!coach)}
							type="checkbox"
							value={coach}
						/>
						<FontAwesomeIcon icon={faDollarSign} />
						<label htmlFor="coach">Coach</label>
						<a
							href="https://www.amtrak.com/onboard-the-train-seating-accommodations"
							rel="noopener noreferrer"
							target="_blank"
						>
							<FontAwesomeIcon icon={faCircleQuestion} />
						</a>
					</div>
					<div className="checkbox">
						<input
							id="business"
							checked={business}
							name="business"
							onChange={(e) => setBusiness(!business)}
							type="checkbox"
						/>
						<div>
							<FontAwesomeIcon icon={faDollarSign} />
							<FontAwesomeIcon icon={faDollarSign} />
						</div>
						<label htmlFor="business">Business</label>
						<a
							href="https://www.amtrak.com/onboard-the-train-seating-accommodations"
							rel="noopener noreferrer"
							target="_blank"
						>
							<FontAwesomeIcon icon={faCircleQuestion} />
						</a>
					</div>
					<div
						className="checkbox"
						style={{
							opacity: route !== "Acela" ? "0.5" : "1",
							pointerEvents: route !== "Acela" ? "none" : "auto",
						}}
					>
						<input
							id="first"
							checked={first}
							{...(route !== "Acela" && { disabled: true })}
							name="first"
							onChange={(e) => setFirst(!first)}
							type="checkbox"
						/>
						<div>
							<FontAwesomeIcon icon={faDollarSign} />
							<FontAwesomeIcon icon={faDollarSign} />
							<FontAwesomeIcon icon={faDollarSign} />
						</div>
						<label htmlFor="first">First</label>
						<a
							href="https://www.amtrak.com/onboard-the-train-seating-accommodations"
							rel="noopener noreferrer"
							target="_blank"
						>
							<FontAwesomeIcon icon={faCircleQuestion} />
						</a>
					</div>
				</div>
			)}
			{roomsExpanded && (
				<div className="input-row">
					<div className="checkbox">
						<input
							checked={cheapestRoom}
							id="cheapest-room"
							name="cheapest-room"
							onChange={(e) => handleCheapestRoom()}
							type="checkbox"
						/>
						<label htmlFor="cheapest-room">Cheapest available</label>
					</div>
					<div className="checkbox">
						<input
							checked={roomette}
							id="roomette"
							name="roomette"
							onChange={(e) => handleRoomType("roomette")}
							type="checkbox"
						/>
						<img alt="" src="./images/roomette-white.svg" />
						<label htmlFor="roomette">Roomette</label>
						<a
							href="https://www.amtrak.com/roomette"
							rel="noopener noreferrer"
							target="_blank"
						>
							<FontAwesomeIcon icon={faCircleQuestion} />
						</a>
					</div>
					<div className="checkbox">
						<input
							checked={bedroom}
							id="bedroom"
							name="bedroom"
							onChange={(e) => handleRoomType("bedroom")}
							type="checkbox"
						/>
						<img alt="" src="./images/family-room-white.svg" />
						<label htmlFor="bedroom">Bedroom</label>
						<a
							href="https://www.amtrak.com/bedroom"
							rel="noopener noreferrer"
							target="_blank"
						>
							<FontAwesomeIcon icon={faCircleQuestion} />
						</a>
					</div>
					<div className="checkbox">
						<input
							checked={familyRoom}
							id="family-room"
							name="family-room"
							onChange={(e) => handleRoomType("family-room")}
							type="checkbox"
						/>
						<img alt="" src="./images/bedroom-white.svg" />
						<label htmlFor="family-room">Family Room</label>
						<a
							href="https://www.amtrak.com/family-room"
							rel="noopener noreferrer"
							target="_blank"
						>
							<FontAwesomeIcon icon={faCircleQuestion} />
						</a>
					</div>
				</div>
			)}
			{routeExpanded && (
				<div className="input-row" id="route-row">
					<div
						className="menu-select"
						style={{
							animation: mutualRoutes.length <= 1 ? "none" : "highlight 1s",
							opacity: mutualRoutes.length <= 1 ? "0.5" : "1",
							pointerEvents: mutualRoutes.length <= 1 ? "none" : "auto",
						}}
					>
						<label htmlFor="route">Route</label>
						<select
							{...(mutualRoutes.length <= 1 && { disabled: true })}
							id="route"
							name="route"
							onChange={(e) => setRoute(e.target.value)}
							required
							value={route}
						>
							{mutualRoutes.map((route) => (
								<option key={route} value={route}>
									{route}
								</option>
							))}
						</select>
					</div>
					<div className="menu-select">
						<div style={{ display: "flex", flexShrink: "0", gap: "0.25rem" }}>
							<label htmlFor="time-of-day">Time of day</label>
							<sup>NEW</sup>
						</div>
						<select
							id="time-of-day"
							name="time-of-day"
							onChange={(e) => setTimeOfDay(e.target.value)}
							value={timeOfDay}
						>
							<option key="anytime" value="anytime">
								Anytime
							</option>
							<option key="12a-6a" value="12a-6a">
								12 AM - 6 AM
							</option>
							<option key="6a-12p" value="6a-12p">
								6 AM - 12 PM
							</option>
							<option key="12p-6p" value="12p-6p">
								12 PM - 6 PM
							</option>
							<option key="6p-12a" value="6p-12a">
								6 PM - 12 AM
							</option>
							{["AM", "PM"].map((time) =>
								[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => (
									<option
										key={`${hour}${time[0].toLowerCase()}`}
										value={`${hour}${time[0].toLowerCase()}`}
									>{`${hour} ${time}`}</option>
								))
							)}
							;
						</select>
					</div>
				</div>
			)}
			{travelersExpanded && (
				<div className="input-row">
					<div className="menu-select">
						<label htmlFor="traveler-quantity">Traveler quantity</label>{" "}
						<input
							id="traveler-quantity"
							max="8"
							min="1"
							name="traveler-quantity"
							onChange={(e) => setTravelerQuantity(e.target.value)}
							type="number"
							value={travelerQuantity}
						/>
					</div>
					<div className="menu-select">
						<label htmlFor="traveler-type">Traveler type</label>
						<select
							id="traveler-type"
							name="traveler-type"
							onChange={(e) => setTravelerType(e.target.value)}
							value={travelerType}
						>
							<option value="adult">
								{travelerQuantity > 1 ? "Adults" : "Adult"}
							</option>
							<option value="senior">
								{travelerQuantity > 1 ? "Seniors" : "Senior"}
							</option>
						</select>
					</div>
				</div>
			)}
			{moreExpanded && (
				<div className="input-row">
					<div className="checkbox">
						<input
							checked={direct}
							id="direct"
							name="direct"
							onChange={(e) => handleDirect()}
							type="checkbox"
						/>
						<label htmlFor="direct">Direct routes only</label>
					</div>
					<div className="checkbox">
						<input
							checked={share}
							id="share"
							name="share"
							onChange={(e) => handleShare(!share)}
							type="checkbox"
						/>
						<label htmlFor="share">Share fares</label>
					</div>
				</div>
			)}
		</form>
	);
}
