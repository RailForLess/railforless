import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import "./DateRangePopover.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
dayjs.extend(utc);

export default function DateRangePopover({
	tripType,
	tab,
	setTab,
	tripDuration,
	setTripDuration,
	dateRangeStart,
	setDateRangeStart,
	dateRangeEnd,
	setDateRangeEnd,
	minDate,
	maxDate,
	setDateRangeStartSearch,
	setDateRangeEndSearch,
	fares,
	searching,
}) {
	const error =
		dateRangeStart.isAfter(dateRangeEnd) ||
		dateRangeEnd.isBefore(dateRangeStart)
			? `${tab === 0 ? "Start" : "Dept"} date (${dateRangeStart.format(
					"M/D"
			  )}) is after ${
					tab === 0 ? "end" : "return"
			  } date (${dateRangeEnd.format("M/D")})`
			: dateRangeEnd.diff(dateRangeStart, "d") + 1 >
			  (tripType === "round-trip" ? 45 : 90)
			? `${!tab ? "Date range" : "Trip duration"} greater than ${
					tripType === "round-trip" ? 45 : 90
			  } days`
			: "";

	const [shakeError, setShakeError] = useState(true);

	function getDateRangeString() {
		return !tab
			? `${
					tripType === "round-trip" && tripDuration.val
						? `${tripDuration.val} ${tripDuration.type} trip in`
						: "Anytime"
			  } ${dateRangeStart.format("M/D")}-${dateRangeEnd.format("M/D")}`
			: `Dept ${dateRangeStart.format("M/D")}${
					tripType === "round-trip"
						? `, Return ${dateRangeEnd.format("M/D")}`
						: ""
			  }`;
	}

	useEffect(() => {
		setDateRangeStartSearch(dateRangeStart);
		setDateRangeEndSearch(dateRangeEnd);
		if (!error) {
			const maxDays = dateRangeEnd.diff(dateRangeStart, "d") + 1;
			if (tripDuration.type === "day" && tripDuration.val > maxDays) {
				setTripDuration({ type: "day", val: maxDays });
			} else if (tripDuration.type === "week") {
				const maxWeeks = Math.floor(maxDays / 7);
				if (maxWeeks > 0 && tripDuration.val > maxWeeks) {
					setTripDuration({ type: "week", val: maxWeeks });
				} else if (!maxWeeks) {
					setTripDuration({ type: "day", val: maxDays });
				}
			}
		}
	}, [dateRangeStart, dateRangeEnd]);

	function removeDialogActions() {
		setTimeout(() => {
			[...document.getElementsByClassName("MuiDialogActions-root")].forEach(
				(e) => e.remove()
			);
		}, 0);
	}

	function handleClose() {
		if (error) {
			setShakeError(false);
			setTimeout(() => {
				setShakeError(true);
			}, 0);
		} else {
			setAnchor(null);
		}
	}

	function handleDateRangeStart(newDateRangeStart) {
		setDateRangeStart(newDateRangeStart);
		if (tripType === "one-way" && !searching && fares.length === 0) {
			setDateRangeEnd(newDateRangeStart);
		}
	}

	const [anchor, setAnchor] = useState(null);

	return (
		<div id="date-range-container">
			<div onClick={removeDialogActions}>
				<TextField
					className="textfield-disabled"
					disabled
					InputProps={{ startAdornment: <CalendarMonthIcon /> }}
					onClick={(e) => setAnchor(e.currentTarget.parentElement)}
					value={getDateRangeString()}
					variant="outlined"
				></TextField>
			</div>
			<Popover
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				onClose={handleClose}
				open={Boolean(anchor)}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<div id="date-range-popover">
					<Tabs
						onChange={(e, i) => {
							setTab(i);
							removeDialogActions();
						}}
						value={tab}
					>
						<Tab disableRipple label="Flexible dates" />
						<Tab
							disableRipple
							label={`Specific date${tripType === "round-trip" ? "s" : ""}`}
						/>
					</Tabs>
					<div>
						{tripType === "round-trip" && !tab && !error && (
							<div>
								<div id="trip-duration-container">
									<Button
										className={`select ${
											tripDuration.val ? "not-" : ""
										}selected`}
										disableRipple
										onClick={() => setTripDuration({ type: null, val: null })}
									>
										Any trip duration
									</Button>
									{dateRangeEnd.diff(dateRangeStart, "d") + 1 >= 7 && (
										<Select
											className={`select ${
												tripDuration.type !== "week" ? "not-" : ""
											}selected`}
											disableUnderline
											onChange={(e) =>
												setTripDuration({ type: "week", val: e.target.value })
											}
											onOpen={() =>
												setTripDuration(
													tripDuration.type === "week"
														? tripDuration
														: { type: "week", val: 1 }
												)
											}
											value={
												tripDuration.type === "week" ? tripDuration.val : 1
											}
											variant="standard"
										>
											{[
												...Array(
													Math.floor(
														(dateRangeEnd.diff(dateRangeStart, "d") + 1) / 7
													)
												).keys(),
											].map((i) => (
												<MenuItem key={`${i + 1}-week`} value={i + 1}>
													{`${i + 1} week${i + 1 > 1 ? "s" : ""}`}
												</MenuItem>
											))}
										</Select>
									)}
									<Select
										className={`select ${
											tripDuration.type !== "day" ? "not-" : ""
										}selected`}
										disableUnderline
										MenuProps={{
											style: {
												maxHeight: "20rem",
											},
										}}
										onChange={(e) =>
											setTripDuration({ type: "day", val: e.target.value })
										}
										onOpen={() =>
											setTripDuration(
												tripDuration.type === "day"
													? tripDuration
													: { type: "day", val: 1 }
											)
										}
										value={tripDuration.type === "day" ? tripDuration.val : 1}
										variant="standard"
									>
										{[
											...Array(
												dateRangeEnd.diff(dateRangeStart, "d") + 1
											).keys(),
										].map((i) => (
											<MenuItem key={`${i + 1}-day`} value={i + 1}>
												{`${i + 1} day${i + 1 > 1 ? "s" : ""}`}
											</MenuItem>
										))}
									</Select>
								</div>
								<hr></hr>
							</div>
						)}
						<span
							className={`${error ? "error-text" : ""}${
								shakeError && error ? " error-critical" : ""
							}`}
							id="date-range-string"
						>
							{error ? error : getDateRangeString()}
						</span>
						<div id="date-picker-container">
							<StaticDatePicker
								className="date-range-start"
								maxDate={maxDate}
								minDate={minDate}
								onChange={handleDateRangeStart}
								slots={{ toolbar: () => {} }}
								value={dateRangeStart}
							></StaticDatePicker>
							<StaticDatePicker
								className="date-range-end"
								maxDate={maxDate}
								minDate={minDate}
								onChange={(newDateRangeEnd) => setDateRangeEnd(newDateRangeEnd)}
								slots={{ toolbar: () => {} }}
								sx={{ opacity: tripType === "round-trip" || !tab ? 1 : 0 }}
								value={dateRangeEnd}
							></StaticDatePicker>
						</div>
					</div>
					<div className="options">
						<Button disableRipple onClick={handleClose} variant="text">
							Done
						</Button>
					</div>
				</div>
			</Popover>
		</div>
	);
}
