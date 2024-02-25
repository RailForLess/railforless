import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import "./DateRangeSelect.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
dayjs.extend(utc);

export default function DateRangeSelect({
	tripType,
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
	searching,
	fares,
}) {
	const [anchor, setAnchor] = useState(null);
	const [width, setWidth] = useState(0);
	const [tabEdit, setTabEdit] = useState(tab);

	function handleTab(i) {
		removeDialogActions(i);
		setTabEdit(i);
	}

	useEffect(() => {
		setDateRangeStartSearch(dateRangeStartEdit);
		setDateRangeEndSearch(dateRangeEndEdit);
		if (fares.length > 0) {
			setMonthEdit(dateRangeStart.get("M"));
			setMonth(dateRangeStart.get("M"));
		}
	}, []);

	const [anyDurationEdit, setAnyDurationEdit] = useState(anyDuration);
	const [weeksEdit, setWeeksEdit] = useState(weeks);
	const [weeksSelectedEdit, setWeeksSelectedEdit] = useState(weeksSelected);
	const [daysEdit, setDaysEdit] = useState(days);
	const [daysSelectedEdit, setDaysSelectedEdit] = useState(daysSelected);
	const [weekdaysEdit, setWeekdaysEdit] = useState(weekdays);
	const [weekendsEdit, setWeekendsEdit] = useState(weekends);

	const [dateRangeStartSearch, setDateRangeStartSearch] = useState(
		dayjs.utc().startOf("d").add(1, "d")
	);
	const [dateRangeEndSearch, setDateRangeEndSearch] = useState(
		dayjs.utc().startOf("d").endOf("M")
	);

	function clearDuration() {
		setAnyDurationEdit(false);
		setWeeksSelectedEdit(false);
		setDaysSelectedEdit(false);
		setWeekdaysEdit(false);
		setWeekendsEdit(false);
	}

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
		const maxMonth =
			!searching && fares.length === 0
				? dayjs.utc().startOf("d").add(11, "M").subtract(2, "d").get("M")
				: dateRangeEndSearch.get("M");
		let curMonth =
			!searching && fares.length === 0
				? dayjs.utc().startOf("d").add(1, "d").subtract(1, "M").get("M")
				: dateRangeStartSearch.subtract(1, "M").get("M");
		const months = [];
		do {
			curMonth++;
			curMonth %= 12;
			months.push({
				name: monthNames[curMonth],
				year:
					curMonth < dayjs.utc().startOf("d").add(1, "d").get("M")
						? dayjs.utc().startOf("d").add(1, "d").get("y") + 1
						: dayjs.utc().startOf("d").add(1, "d").get("y"),
				value: curMonth,
			});
		} while (curMonth % 12 !== maxMonth);
		return months;
	}

	const [dateRangeStartEdit, setDateRangeStartEdit] = useState(dateRangeStart);
	const [dateRangeEndEdit, setDateRangeEndEdit] = useState(dateRangeEnd);

	function handleMonthEdit(newMonthEdit) {
		setMonthEdit(newMonthEdit);
		const year = dayjs.utc().startOf("d").add(1, "d").get("y");
		const monthDate = dayjs
			.utc()
			.set("M", newMonthEdit)
			.set(
				"y",
				newMonthEdit < dayjs.utc().startOf("d").add(1, "d").get("M")
					? year + 1
					: year
			)
			.startOf("M");
		handleDateRangeStartEdit(
			(!searching && fares.length === 0
				? dayjs.utc().startOf("d").add(1, "d")
				: dateRangeStartSearch
			).diff(monthDate) > 0
				? dayjs.utc().startOf("d").add(1, "d")
				: !searching && fares.length === 0
				? monthDate
				: dateRangeStartSearch
		);
		const endMonth = monthDate.endOf("M");
		const maxDate = dayjs.utc().startOf("d").add(11, "M").subtract(2, "d");
		setDateRangeEndEdit(
			endMonth.diff(
				!searching && fares.length === 0 ? maxDate : dateRangeEndSearch
			) > 0
				? !searching && fares.length === 0
					? maxDate
					: dateRangeEndSearch
				: endMonth
		);
	}

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
		if (!searching && fares.length === 0) {
			setDateRangeStartSearch(dateRangeStartEdit);
			setDateRangeEndSearch(dateRangeEndEdit);
		}
	}, [dateRangeStartEdit, dateRangeEndEdit]);

	const [maxDateRangeEndEdit, setMaxDateRangeEndEdit] =
		useState(maxDateRangeEnd);

	function handleDateRangeOpen(e) {
		updateCalendar();
		setAnchor(e.currentTarget);
		setWidth(e.currentTarget.offsetWidth);
		removeDialogActions(tabEdit);
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
		const maxDate = dayjs.utc().startOf("d").add(11, "M").subtract(2, "d");
		setDateRangeStartEdit(newDateRangeStartEdit);
		if (newDateRangeStartEdit.isBefore(dateRangeStartEdit)) {
			if (
				dateRangeEndEdit.diff(newDateRangeStartEdit, "d") >
				(tripType === "round-trip" ? 44 : 89)
			) {
				newDateRangeEndEdit = newDateRangeStartEdit.add(
					tripType === "round-trip" ? 44 : 89,
					"d"
				);
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
		const newMaxDateRangeEndEdit = newDateRangeStartEdit.add(
			tripType === "round-trip" ? 44 : 89,
			"d"
		);
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
				? `${weeks} week${weeks > 1 ? "s" : ""} trip in `
				: tripType === "round-trip" && daysSelected
				? `${days} day trip in `
				: weekdays
				? "Weekdays in "
				: weekends
				? "Weekends in "
				: ""
		}${
			tab
				? monthNames[month]
				: `${dateRangeStart.format("M/D")}-${dateRangeEnd.format("M/D")}`
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

	useEffect(updateCalendar, [tabEdit, dateRangeStartEdit, dateRangeEndEdit]);

	useEffect(() => {
		setMaxDateRangeEndEdit(maxDateRangeEnd);
	}, [maxDateRangeEnd]);

	useEffect(() => {
		setDateRangeEndEdit(dateRangeEnd);
	}, [dateRangeEnd]);

	return (
		<div id="date-range-container">
			<div onClick={(e) => handleDateRangeOpen(e)}>
				<TextField
					className="textfield-disabled"
					disabled
					InputProps={{ startAdornment: <CalendarMonthIcon /> }}
					onClick={(e) => setAnchor(e.currentTarget.parentElement)}
					value={getDateRangeString()}
					variant="outlined"
				></TextField>
			</div>
			<Menu
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				onClose={() => {
					setTab(tabEdit);
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
					setAnchor(null);
				}}
				open={Boolean(anchor)}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<div id="date-range-popover" style={{ minWidth: width }}>
					<Tabs onChange={(e, i) => handleTab(i)} value={tabEdit}>
						<Tab disableRipple label="Specific dates" />
						<Tab disableRipple label="Flexible dates" />
					</Tabs>
					<div id="duration-container">
						<Button
							className={`select ${!anyDurationEdit ? "not-" : ""}selected`}
							disableRipple
							onClick={() => {
								if (!anyDurationEdit) {
									clearDuration();
									setAnyDurationEdit(!anyDurationEdit);
								}
							}}
						>
							Any duration
						</Button>
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
												(dateRangeEndEdit.diff(dateRangeStartEdit, "d") + 1) / 7
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
								className={`select ${!daysSelectedEdit ? "not-" : ""}selected`}
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
					{tabEdit === 0 && (
						<div id="date-range-popover-row">
							<StaticDatePicker
								maxDate={
									!searching && fares.length === 0
										? dayjs.utc().startOf("d").add(11, "M").subtract(2, "d")
										: dateRangeEndSearch
								}
								minDate={
									!searching && fares.length === 0
										? dayjs.utc().startOf("d").add(1, "d")
										: dateRangeStartSearch
								}
								onChange={(newDateRangeStart) =>
									handleDateRangeStartEdit(newDateRangeStart)
								}
								onMonthChange={updateCalendar}
								slots={{ toolbar: () => {} }}
								value={dateRangeStartEdit}
							></StaticDatePicker>
							<StaticDatePicker
								disablePast
								maxDate={
									!searching && fares.length === 0
										? maxDateRangeEndEdit
										: dateRangeEndSearch
								}
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
					{tabEdit === 1 && (
						<div id="flex-date-container">
							<Select
								className="select"
								disableUnderline
								MenuProps={{
									style: {
										maxHeight: "20rem",
									},
								}}
								onChange={(e) => handleMonthEdit(e.target.value)}
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
								setAnchor(null);
								setTabEdit(tab);
								setAnyDurationEdit(anyDuration);
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
								setTab(tabEdit);
								setAnyDuration(anyDurationEdit);
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
								setAnchor(null);
							}}
							variant="text"
						>
							Done
						</Button>
					</div>
				</div>
			</Menu>
		</div>
	);
}
