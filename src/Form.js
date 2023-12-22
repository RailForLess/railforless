import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./Form.css";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsIcon from "@mui/icons-material/Settings";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

export default function Form({ stations, setStations, origin, setOrigin }) {
	const [tripType, setTripType] = useState("round-trip");
	const [tripTypeSelected, setTripTypeSelected] = useState(false);

	const [travelerTypes, setTravelerTypes] = useState({
		numAdults: 1,
		numSeniors: 0,
		numYouth: 0,
		numChildren: 0,
		numInfants: 0,
	});
	const [travelerTypesEdit, setTravelerTypesEdit] = useState(travelerTypes);
	const [travelerTypesSelected, setTravelerTypesSelected] = useState(false);
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

	const [travelersAnchor, setTravelersAnchor] = useState(null);
	const travelersOpen = Boolean(travelersAnchor);

	function handleTravelerTypesEdit(travelerType, increment) {
		const newTravelerTypesEdit = { ...travelerTypesEdit };
		newTravelerTypesEdit[travelerType] += increment ? 1 : -1;
		setTravelerTypesEdit(newTravelerTypesEdit);
	}

	const [fareClass, setFareClass] = useState("coach");
	const [fareClassSelected, setFareClassSelected] = useState(false);

	const [settingsAnchor, setSettingsAnchor] = useState(null);
	const settingsOpen = Boolean(settingsAnchor);
	const [geolocateBool, setGeolocateBool] = useState(
		localStorage.getItem("geolocate")
			? localStorage.getItem("geolocate") === "true"
				? true
				: false
			: true
	);

	function handleGeolocate() {
		setGeolocateBool(!geolocateBool);
		localStorage.setItem("geolocate", JSON.stringify(!geolocateBool));
		if (!geolocateBool) {
			geolocate(stations);
		} else {
			setStations(stations.slice(5));
		}
	}

	const [stationFormat, setStationFormat] = useState(
		localStorage.getItem("station-format")
			? localStorage.getItem("station-format")
			: "name-and-code"
	);

	function handleStationFormat(newStationFormat) {
		localStorage.setItem("station-format", newStationFormat);
		setStationFormat(newStationFormat);
	}

	async function geolocate(stationsData) {
		if (localStorage.getItem("geolocate") === "false") {
			return;
		}
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
			.map((station) => ({ ...station, group: "Nearby" }))
			.concat(stationsData);
		setStations(sortedStationsData);
		setOrigin(sortedStationsData[0]);
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
				geolocate(data);
			});
	}, []);

	const stationsLabels = (station) =>
		stationFormat === "name-and-code"
			? `${station.name} (${station.code})`
			: stationFormat === "name-only"
			? station.name
			: station.code;

	const [swapped, setSwapped] = useState(false);

	function swapStations() {
		setSwapped(!swapped);
		setDestination(origin);
		setOrigin(destination);
	}

	const [destination, setDestination] = useState(null);

	const [dateRangeAnchor, setDateRangeAnchor] = useState(null);
	const dateRangeOpen = Boolean(dateRangeAnchor);
	const [dateRangeWidth, setDateRangeWidth] = useState(0);
	const [dateRangeTab, setDateRangeTab] = useState(1);
	const [dateRangeTabEdit, setDateRangeTabEdit] = useState(dateRangeTab);

	function handleDateRangeTab(i) {
		removeDialogActions(i);
		setDateRangeTabEdit(i);
	}

	const [weeks, setWeeks] = useState(1);
	const [weeksEdit, setWeeksEdit] = useState(weeks);
	const [weeksSelected, setWeeksSelected] = useState(true);
	const [weeksSelectedEdit, setWeeksSelectedEdit] = useState(weeksSelected);
	const [days, setDays] = useState(5);
	const [daysEdit, setDaysEdit] = useState(days);
	const [daysSelected, setDaysSelected] = useState(false);
	const [daysSelectedEdit, setDaysSelectedEdit] = useState(daysSelected);
	const [weekdays, setWeekdays] = useState(false);
	const [weekdaysEdit, setWeekdaysEdit] = useState(weekdays);
	const [weekends, setWeekends] = useState(false);
	const [weekendsEdit, setWeekendsEdit] = useState(weekends);

	function clearDuration() {
		setWeeksSelectedEdit(false);
		setDaysSelectedEdit(false);
		setWeekdaysEdit(false);
		setWeekendsEdit(false);
	}

	const [month, setMonth] = useState(dayjs().startOf("d").get("M"));
	const [monthEdit, setMonthEdit] = useState(month);

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	function getMonths() {
		const maxMonth = dayjs()
			.startOf("d")
			.add(11, "M")
			.subtract(2, "d")
			.get("M");
		let curMonth = dayjs().startOf("d").get("M");
		const months = [];
		do {
			months.push({
				name: monthNames[curMonth],
				year:
					curMonth < dayjs().startOf("d").get("M")
						? dayjs().startOf("d").get("y") + 1
						: dayjs().startOf("d").get("y"),
				value: curMonth,
			});
			curMonth++;
			curMonth %= 12;
		} while ((curMonth - 1) % 12 !== maxMonth);
		return months;
	}

	const [dateRangeStart, setDateRangeStart] = useState(dayjs().startOf("d"));
	const [dateRangeStartEdit, setDateRangeStartEdit] = useState(dateRangeStart);
	const [dateRangeEnd, setDateRangeEnd] = useState(
		dayjs().startOf("d").add(30, "d")
	);
	const [dateRangeEndEdit, setDateRangeEndEdit] = useState(dateRangeEnd);

	useEffect(() => {
		const year = dayjs().startOf("d").get("y");
		const monthDate = dayjs()
			.set("M", monthEdit)
			.set("y", monthEdit < dayjs().startOf("d").get("M") ? year + 1 : year)
			.startOf("M");
		handleDateRangeStartEdit(
			dayjs().startOf("d").diff(monthDate) > 0
				? dayjs().startOf("d")
				: monthDate
		);
		const endMonth = monthDate.endOf("M");
		const maxDate = dayjs().startOf("d").add(11, "M").subtract(2, "d");
		setDateRangeEndEdit(endMonth.diff(maxDate) > 0 ? maxDate : endMonth);
	}, [monthEdit]);

	useEffect(() => {
		const maxDays = dateRangeEndEdit.diff(dateRangeStartEdit, "d") + 1;
		if (daysEdit > maxDays) {
			setDaysEdit(maxDays);
		}
		const maxWeeks = Math.floor(maxDays / 7);
		if (maxWeeks > 0 && weeksEdit > maxWeeks) {
			setWeeksEdit(maxWeeks);
		}
		if (maxDays < 7 && weeksSelectedEdit) {
			setWeeksSelectedEdit(false);
			setDaysSelectedEdit(true);
		} else if (!containsDay(true) && weekdaysEdit) {
			setWeekdaysEdit(false);
			setWeekendsEdit(true);
		} else if (!containsDay(false) && weekendsEdit) {
			setWeekendsEdit(false);
			setWeekdaysEdit(true);
		}
	}, [dateRangeStartEdit, dateRangeEndEdit]);

	const [maxDateRangeEnd, setMaxDateRangeEnd] = useState(
		dayjs().startOf("d").add(30, "d")
	);
	const [maxDateRangeEndEdit, setMaxDateRangeEndEdit] =
		useState(maxDateRangeEnd);

	function handleDateRangeOpen(e) {
		updateCalendar();
		setDateRangeAnchor(e.currentTarget);
		setDateRangeWidth(e.currentTarget.offsetWidth);
		removeDialogActions(dateRangeTabEdit);
	}

	function removeDialogActions(dateRangeTab) {
		if (dateRangeTab === 0) {
			setTimeout(() => {
				[...document.getElementsByClassName("MuiDialogActions-root")].forEach(
					(e) => e.remove()
				);
			}, 0);
		}
	}

	function handleDateRangeStartEdit(newDateRangeStartEdit) {
		let newDateRangeEndEdit = dateRangeEndEdit;
		const maxDate = dayjs().startOf("d").add(11, "M").subtract(2, "d");
		setDateRangeStartEdit(newDateRangeStartEdit);
		if (newDateRangeStartEdit.isBefore(dateRangeStartEdit)) {
			if (dateRangeEndEdit.diff(newDateRangeStartEdit, "d") > 30) {
				newDateRangeEndEdit = newDateRangeStartEdit.add(30, "d");
			}
		} else if (newDateRangeStartEdit.isAfter(dateRangeEndEdit)) {
			newDateRangeEndEdit = newDateRangeStartEdit.add(
				dateRangeEndEdit.diff(dateRangeStartEdit),
				"ms"
			);
			if (newDateRangeEndEdit.isAfter(maxDate)) {
				newDateRangeEndEdit = maxDate;
			}
		}
		setDateRangeEndEdit(newDateRangeEndEdit);
		const newMaxDateRangeEndEdit = newDateRangeStartEdit.add(30, "d");
		setMaxDateRangeEndEdit(
			newMaxDateRangeEndEdit.isAfter(maxDate) ? maxDate : newMaxDateRangeEndEdit
		);
	}

	function containsDay(weekday) {
		let date = dateRangeStartEdit.subtract(1, "d");
		do {
			date = date.add(1, "d");
			const day = date.get("d");
			if (weekday ? day > 0 && day < 6 : day === 0 || day === 6) {
				return true;
			}
		} while (!date.isSame(dateRangeEndEdit, "D"));
		return false;
	}

	function getDateRangeString() {
		return `${
			tripType === "round-trip" && weeksSelected
				? `${weeks} week${weeks > 1 ? "s" : ""} in `
				: tripType === "round-trip" && daysSelected
				? `${days} day${days > 1 ? "s" : ""} in `
				: weekdays
				? "Weekdays in "
				: weekends
				? "Weekends in "
				: ""
		}${
			dateRangeTab
				? monthNames[month]
				: `${dateRangeStart.get("M") + 1}/${dateRangeStart.get("D")}-${
						dateRangeEnd.get("M") + 1
				  }/${dateRangeEnd.get("D")}`
		}`;
	}

	function updateCalendar() {
		setTimeout(() => {
			for (const cell of document.querySelectorAll(".MuiPickersDay-root")) {
				cell.style.backgroundColor = "transparent";
				cell.style.borderRadius = 0;
			}
			let date = dateRangeStartEdit.subtract(1, "d");
			do {
				date = date.add(1, "d");
				for (const cell of document.querySelectorAll(
					`button[data-timestamp="${date.unix().toString().concat("", "000")}"]`
				)) {
					cell.style.backgroundColor = "#4c5667";
					if (
						date.isSame(dateRangeStartEdit, "D") ||
						!cell.parentElement.querySelector(
							`button[aria-colindex="${
								cell.getAttribute("aria-colindex") - 1
							}"]`
						)
					) {
						cell.style.borderTopLeftRadius = "50%";
						cell.style.borderBottomLeftRadius = "50%";
					}
					if (
						date.isSame(dateRangeEndEdit, "D") ||
						!cell.parentElement.querySelector(
							`button[aria-colindex="${
								Number(cell.getAttribute("aria-colindex")) + 1
							}"]`
						)
					) {
						cell.style.borderTopRightRadius = "50%";
						cell.style.borderBottomRightRadius = "50%";
					}
				}
			} while (!date.isSame(dateRangeEndEdit, "D"));
		}, 0);
	}

	useEffect(updateCalendar, [
		dateRangeTabEdit,
		dateRangeStartEdit,
		dateRangeEndEdit,
	]);

	return (
		<form>
			<div className="input-row">
				<div>
					<Select
						className={`select ${!tripTypeSelected ? "not-" : ""}selected`}
						disableUnderline
						onChange={(e) => setTripType(e.target.value)}
						onClose={() => setTripTypeSelected(false)}
						onOpen={() => setTripTypeSelected(true)}
						value={tripType}
						variant="standard"
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
							<div
								style={{ alignItems: "center", display: "flex", gap: "1rem" }}
							>
								<ArrowRightAltIcon />
								<div>One way</div>
							</div>
						</MenuItem>
					</Select>
					<Button
						className={`select ${!travelerTypesSelected ? "not-" : ""}selected`}
						disableRipple
						endIcon={<ArrowDropDownIcon />}
						onClick={(e) => {
							setTravelerTypesSelected(true);
							setTravelersAnchor(e.currentTarget);
						}}
					>
						<PersonOutlineIcon sx={{ mr: 1 }} />
						{Object.values(travelerTypes).reduce((a, b) => a + b, 0)}
					</Button>
					<Menu
						anchorEl={travelersAnchor}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						onClose={() => {
							setTravelerTypesSelected(false);
							setTravelersAnchor(null);
						}}
						open={travelersOpen}
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
						<div className="options">
							<Button
								disableRipple
								onClick={() => {
									setTravelerTypesSelected(false);
									setTravelersAnchor(null);
									setTravelerTypesEdit(travelerTypes);
								}}
								variant="text"
							>
								Cancel
							</Button>
							<Button
								disableRipple
								onClick={() => {
									setTravelerTypesSelected(false);
									setTravelerTypes(travelerTypesEdit);
									setTravelersAnchor(null);
								}}
								variant="text"
							>
								Done
							</Button>
						</div>
					</Menu>
					<Select
						className={`select ${!fareClassSelected ? "not-" : ""}selected`}
						disableUnderline
						onChange={(e) => setFareClass(e.target.value)}
						onClose={() => setFareClassSelected(false)}
						onOpen={() => setFareClassSelected(true)}
						value={fareClass}
						variant="standard"
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
				<IconButton
					disableRipple
					onClick={(e) => setSettingsAnchor(e.currentTarget)}
				>
					<SettingsIcon />
				</IconButton>
				<Menu
					anchorEl={settingsAnchor}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					onClose={() => {
						setSettingsAnchor(null);
					}}
					open={settingsOpen}
					transformOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
				>
					<div id="settings-popover">
						<div className="settings-row">
							<span>Geolocation</span>
							<Switch checked={geolocateBool} onChange={handleGeolocate} />
						</div>
						<div className="settings-row">
							<span>Station format</span>
							<Select
								className="select-station-format"
								disableUnderline
								onChange={(e) => handleStationFormat(e.target.value)}
								value={stationFormat}
								variant="standard"
							>
								<MenuItem key="name-and-code" value="name-and-code">
									name and code
								</MenuItem>
								<MenuItem key="name-only" value="name-only">
									name only
								</MenuItem>
								<MenuItem key="code-only" value="code-only">
									code only
								</MenuItem>
							</Select>
						</div>
					</div>
				</Menu>
			</div>
			<div className="input-row" id="middle-row">
				<Autocomplete
					disableClearable
					getOptionLabel={stationsLabels}
					loading={true}
					loadingText="Getting stations..."
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
				<IconButton
					disableRipple
					onClick={swapStations}
					style={{ transform: `rotate(${swapped ? 180 : 0}deg)` }}
				>
					<SwapHorizIcon size="large" />
				</IconButton>
				<Autocomplete
					disableClearable
					getOptionLabel={stationsLabels}
					loading={true}
					loadingText="Getting stations..."
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
				<div id="date-range-container" onClick={(e) => handleDateRangeOpen(e)}>
					<TextField
						className="textfield-disabled"
						disabled
						InputProps={{ startAdornment: <CalendarMonthIcon /> }}
						onClick={(e) => setDateRangeAnchor(e.currentTarget.parentElement)}
						value={getDateRangeString()}
						variant="outlined"
					></TextField>
				</div>
				<Menu
					anchorEl={dateRangeAnchor}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					onClose={() => {
						setDateRangeTab(dateRangeTabEdit);
						setWeeks(weeksEdit);
						setWeeksSelected(weeksSelectedEdit);
						setDays(daysEdit);
						setDaysSelected(daysSelectedEdit);
						setWeekdays(weekdaysEdit);
						setWeekends(weekendsEdit);
						setMonth(monthEdit);
						setDateRangeStart(dateRangeStartEdit);
						setDateRangeEnd(dateRangeEndEdit);
						setMaxDateRangeEnd(maxDateRangeEndEdit);
						setDateRangeAnchor(null);
					}}
					open={dateRangeOpen}
					transformOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
				>
					<div id="date-range-popover" style={{ minWidth: dateRangeWidth }}>
						<Tabs
							onChange={(e, i) => handleDateRangeTab(i)}
							value={dateRangeTabEdit}
						>
							<Tab disableRipple label="Specific dates" />
							<Tab disableRipple label="Flexible dates" />
						</Tabs>
						<div id="duration-container">
							{tripType === "round-trip" &&
								dateRangeEndEdit.diff(dateRangeStartEdit, "d") + 1 >= 7 && (
									<Select
										className={`select ${
											!weeksSelectedEdit ? "not-" : ""
										}selected`}
										disableUnderline
										onChange={(e) => setWeeksEdit(e.target.value)}
										onOpen={() => {
											clearDuration();
											setWeeksSelectedEdit(true);
										}}
										value={weeksEdit}
										variant="standard"
									>
										{[
											...Array(
												Math.floor(
													(dateRangeEndEdit.diff(dateRangeStartEdit, "d") + 1) /
														7
												)
											).keys(),
										].map((i) => (
											<MenuItem key={`${i + 1}-week`} value={i + 1}>
												{`${i + 1} ${i === 0 ? "week" : "weeks"}`}
											</MenuItem>
										))}
									</Select>
								)}
							{tripType === "round-trip" && (
								<Select
									className={`select ${
										!daysSelectedEdit ? "not-" : ""
									}selected`}
									disableUnderline
									MenuProps={{
										style: {
											maxHeight: "20rem",
										},
									}}
									onChange={(e) => setDaysEdit(e.target.value)}
									onOpen={() => {
										clearDuration();
										setDaysSelectedEdit(true);
									}}
									value={daysEdit}
									variant="standard"
								>
									{[
										...Array(
											dateRangeEndEdit.diff(dateRangeStartEdit, "d") + 1
										).keys(),
									].map((i) => (
										<MenuItem key={`${i + 1}-day`} value={i + 1}>
											{`${i + 1} ${i === 0 ? "day" : "days"}`}
										</MenuItem>
									))}
								</Select>
							)}
							{containsDay(true) && (
								<Button
									className={`select ${!weekdaysEdit ? "not-" : ""}selected`}
									disableRipple
									onClick={() => {
										if (tripType === "one-way" || !weekdaysEdit) {
											clearDuration();
											setWeekdaysEdit(!weekdaysEdit);
										}
									}}
								>
									Weekdays
								</Button>
							)}
							{containsDay(false) && (
								<Button
									className={`select ${!weekendsEdit ? "not-" : ""}selected`}
									disableRipple
									onClick={() => {
										if (tripType === "one-way" || !weekendsEdit) {
											clearDuration();
											setWeekendsEdit(!weekendsEdit);
										}
									}}
								>
									Weekends
								</Button>
							)}
						</div>
						<hr></hr>
						{dateRangeTabEdit === 0 && (
							<div id="date-range-popover-row">
								<StaticDatePicker
									disablePast
									maxDate={dayjs().startOf("d").add(11, "M").subtract(2, "d")}
									onChange={(newDateRangeStart) =>
										handleDateRangeStartEdit(newDateRangeStart)
									}
									onMonthChange={updateCalendar}
									slots={{ toolbar: () => {} }}
									value={dateRangeStartEdit}
								></StaticDatePicker>
								<StaticDatePicker
									disablePast
									maxDate={maxDateRangeEndEdit}
									minDate={dateRangeStartEdit}
									onChange={(newDateRangeEnd) =>
										setDateRangeEndEdit(newDateRangeEnd)
									}
									onMonthChange={updateCalendar}
									slots={{ toolbar: () => {} }}
									value={dateRangeEndEdit}
								></StaticDatePicker>
							</div>
						)}
						{dateRangeTabEdit === 1 && (
							<div id="flex-date-container">
								<Select
									className="select"
									disableUnderline
									MenuProps={{
										style: {
											maxHeight: "20rem",
										},
									}}
									onChange={(e) => setMonthEdit(e.target.value)}
									value={monthEdit}
									variant="standard"
								>
									{getMonths().map((month) => (
										<MenuItem key={month.name} value={month.value}>
											{`${month.name} ${month.year}`}
										</MenuItem>
									))}
								</Select>
							</div>
						)}
						<div className="options">
							<Button
								disableRipple
								onClick={() => {
									setDateRangeAnchor(null);
									setDateRangeTabEdit(dateRangeTab);
									setWeeksEdit(weeks);
									setWeeksSelectedEdit(weeksSelected);
									setDaysEdit(days);
									setDaysSelectedEdit(daysSelected);
									setWeekdaysEdit(weekdays);
									setWeekendsEdit(weekends);
									setMonthEdit(month);
									setDateRangeStartEdit(dateRangeStart);
									setDateRangeEndEdit(dateRangeEnd);
									setMaxDateRangeEndEdit(maxDateRangeEnd);
								}}
								variant="text"
							>
								Cancel
							</Button>
							<Button
								disableRipple
								onClick={() => {
									setDateRangeTab(dateRangeTabEdit);
									setWeeks(weeksEdit);
									setWeeksSelected(weeksSelectedEdit);
									setDays(daysEdit);
									setDaysSelected(daysSelectedEdit);
									setWeekdays(weekdaysEdit);
									setWeekends(weekendsEdit);
									setMonth(monthEdit);
									setDateRangeStart(dateRangeStartEdit);
									setDateRangeEnd(dateRangeEndEdit);
									setMaxDateRangeEnd(maxDateRangeEndEdit);
									setDateRangeAnchor(null);
								}}
								variant="text"
							>
								Done
							</Button>
						</div>
					</div>
				</Menu>
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
