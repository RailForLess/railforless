import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Status from "./Status";
import "./Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faAngleDown,
	faCircleQuestion,
	faDollarSign,
} from "@fortawesome/free-solid-svg-icons";

export default function Form({ fares, setFares, progress, setProgress }) {
	let [allStations, setAllStations] = useState([]);
	let [deptStations, setDeptStations] = useState([]);
	let [arrivalStations, setArrivalStations] = useState([]);

	useEffect(() => {
		fetch("/api/stations")
			.then((res) => res.json())
			.then((data) => {
				setAllStations([...data.stations]);
				setDeptStations([...data.stations]);
				setArrivalStations([...data.stations]);
			});
	}, []);

	function renderStations(mode) {
		return mode.map((station) => (
			<option key={station} value={station}></option>
		));
	}

	const [deptStation, setDeptStation] = useState("");

	if (arrivalStations.includes(deptStation)) {
		arrivalStations.splice(arrivalStations.indexOf(deptStation), 1);
		setArrivalStations(arrivalStations);
	} else if (
		!allStations.includes(deptStation) &&
		arrivalStations.length !== allStations.length
	) {
		setArrivalStations([...allStations]);
	}

	const [arrivalStation, setArrivalStation] = useState("");

	if (deptStations.includes(arrivalStation)) {
		deptStations.splice(deptStations.indexOf(arrivalStation), 1);
		setDeptStations(deptStations);
	} else if (
		!allStations.includes(arrivalStation) &&
		deptStations.length !== allStations.length
	) {
		setDeptStations([...allStations]);
	}

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const [coach, setCoach] = useState(true);
	const [business, setBusiness] = useState(false);
	const [first, setFirst] = useState(false);

	const [roomette, setRoomette] = useState(false);
	const [bedroom, setBedroom] = useState(false);
	const [familyBedroom, setFamilyBedroom] = useState(false);

	function renderInputColor(station, stations) {
		if (!stations.includes(station)) {
			return "darkGray";
		}
	}

	function calcMaxEndDate() {
		if (startDate) {
			const maxEndDate = new Date(startDate);
			maxEndDate.setDate(maxEndDate.getDate() + 8);
			return maxEndDate.toISOString().split("T")[0];
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		fetch("/api/status")
			.then((res) => res.json())
			.then((data) => {
				setStatus(data.status);
				if (!data.status) {
					alert(
						"Server busy, please wait. Refresh status indicator for updates."
					);
					return;
				} else if (!deptStations.includes(deptStation)) {
					alert("Please enter a valid departure station.");
					return;
				} else if (!arrivalStations.includes(arrivalStation)) {
					alert("Please enter a valid arrival station.");
					return;
				} else if (
					!(coach || business || first) &&
					!(roomette || bedroom || familyBedroom)
				) {
					alert("Please select at least one seating or room option.");
					return;
				}
				setFares({});
				const socket = io.connect("http://localhost:5000");

				let date = new Date(startDate + "T00:00");
				const dates = [];
				while (date <= new Date(endDate + "T00:00")) {
					dates.push(date.toLocaleString().split(",")[0]);
					date.setDate(date.getDate() + 1);
				}

				const fareMessage = {
					deptStation: deptStation,
					arrivalStation: arrivalStation,
					dates: dates,
					coach: coach,
					business: business,
					first: first,
					roomette: roomette,
					bedroom: bedroom,
					familyBedroom: familyBedroom,
				};
				socket.on("connect", function() {
					socket.send(JSON.stringify(fareMessage));
				});

				socket.on("message", function(msg) {
					msg = JSON.parse(msg);
					if (msg.progress) {
						setProgress(msg.progress);
					} else if (msg.fares) {
						socket.disconnect();
						setFares(msg.fares);
					}
				});
			});
	}

	function updateStatus() {
		fetch("/api/status")
			.then((res) => res.json())
			.then((data) => {
				setStatus(data.status);
			});
	}

	const [status, setStatus] = useState(false);

	useEffect(() => {
		updateStatus();
	}, [fares, progress]);

	const [seatsExpanded, setSeatsExpanded] = useState(false);
	const [roomsExpanded, setRoomsExpanded] = useState(false);

	return (
		<form onSubmit={handleSubmit}>
			<datalist id="dept-stations">{renderStations(deptStations)}</datalist>
			<div className="input-row">
				<div className="input-column">
					<label htmlFor="from">Departure Station</label>
					<input
						id="from"
						list="dept-stations"
						name="from"
						onChange={(e) => setDeptStation(e.target.value)}
						required
						style={{ color: renderInputColor(deptStation, deptStations) }}
						type="search"
						value={deptStation}
					/>
				</div>
				<datalist id="arrival-stations">
					{renderStations(arrivalStations)}
				</datalist>
				<div className="input-column">
					<label htmlFor="to">Arrival Station</label>
					<input
						id="to"
						list="arrival-stations"
						name="to"
						onChange={(e) => setArrivalStation(e.target.value)}
						required
						style={{
							color: renderInputColor(arrivalStation, arrivalStations),
						}}
						type="text"
						value={arrivalStation}
					/>
				</div>
				<div className="input-column">
					<label htmlFor="start-date">Start Date</label>
					<input
						id="start-date"
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
						min={startDate}
						name="end-date"
						onChange={(e) => setEndDate(e.target.value)}
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
						onClick={() => setSeatsExpanded(!seatsExpanded)}
					>
						<h3>Seats</h3>
						<FontAwesomeIcon
							icon={faAngleDown}
							style={{
								transform: seatsExpanded ? "rotate(180deg)" : "rotate(0)",
							}}
						/>
					</div>
					<div
						className="options-toggle"
						onClick={() => setRoomsExpanded(!roomsExpanded)}
					>
						<h3>Rooms</h3>
						<FontAwesomeIcon
							icon={faAngleDown}
							style={{
								transform: roomsExpanded ? "rotate(180deg)" : "rotate(0)",
							}}
						/>
					</div>
				</div>
				<Status status={status} updateStatus={updateStatus} />
			</div>
			{seatsExpanded && (
				<div className="input-row">
					<div className="checkbox">
						<input
							checked={coach}
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
					<div className="checkbox">
						<input
							id="first"
							checked={first}
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
							checked={roomette}
							id="roomette"
							name="roomette"
							onChange={(e) => setRoomette(!roomette)}
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
							onChange={(e) => setBedroom(!bedroom)}
							type="checkbox"
						/>
						<img alt="" src="./images/family-bedroom-white.svg" />
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
							checked={familyBedroom}
							id="family-bedroom"
							name="family-bedroom"
							onChange={(e) => setFamilyBedroom(!familyBedroom)}
							type="checkbox"
						/>
						<img alt="" src="./images/bedroom-white.svg" />
						<label htmlFor="family-bedroom">Family Bedroom</label>
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
		</form>
	);
}
