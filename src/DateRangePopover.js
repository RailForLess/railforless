import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import "./DateRangePopover.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

export default function DateRangePopover({
	roundTrip,
	flexible,
	setFlexible,
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
	newSearch,
	fixedDates,
}) {
	const multipleDates = roundTrip || flexible;

	const error = multipleDates
		? dateRangeStart.isAfter(dateRangeEnd) ||
		  dateRangeEnd.isBefore(dateRangeStart)
			? `${flexible ? "Start" : "Dept"} date is after ${
					flexible ? "end" : "return"
			  } date`
			: dateRangeEnd.diff(dateRangeStart, "d") + 1 > (roundTrip ? 45 : 90)
			? `${flexible ? "Date range" : "Trip duration"} greater than ${
					roundTrip ? 45 : 90
			  } days`
			: ""
		: "";

	const [shakeError, setShakeError] = useState(true);

	const [dateRangeStartSelect, setDateRangeStartSelect] = useState(true);

	function getDateRangeString(highlight = false) {
		return highlight ? (
			flexible ? (
				<div id="date-range-string">
					<span>
						{roundTrip && tripDuration.val
							? `${tripDuration.val} ${tripDuration.type} trip in`
							: "Anytime"}
						&nbsp;
					</span>
					<span
						id={dateRangeStartSelect ? "date-range-highlight" : ""}
						onClick={() => setDateRangeStartSelect(true)}
						style={{ cursor: "pointer" }}
					>
						{dateRangeStart.format("M/D")}
					</span>
					<span>-</span>
					<span
						id={!dateRangeStartSelect ? "date-range-highlight" : ""}
						onClick={() => setDateRangeStartSelect(false)}
						style={{ cursor: "pointer" }}
					>
						{dateRangeEnd.format("M/D")}
					</span>
				</div>
			) : (
				<div id="date-range-string">
					<span>Dept&nbsp;</span>
					<span
						id={
							dateRangeStartSelect && multipleDates
								? "date-range-highlight"
								: ""
						}
						onClick={() => setDateRangeStartSelect(true)}
						style={{ cursor: multipleDates ? "pointer" : "auto" }}
					>
						{dateRangeStart.format("M/D")}
					</span>
					{roundTrip && <span>, Return&nbsp;</span>}
					{roundTrip && (
						<span
							id={!dateRangeStartSelect ? "date-range-highlight" : ""}
							onClick={() => setDateRangeStartSelect(false)}
							style={{ cursor: multipleDates ? "pointer" : "auto" }}
						>
							{dateRangeEnd.format("M/D")}
						</span>
					)}
				</div>
			)
		) : flexible ? (
			`${
				roundTrip && tripDuration.val
					? `${tripDuration.val} ${tripDuration.type} trip in`
					: "Anytime"
			} ${dateRangeStart.format("M/D")}-${dateRangeEnd.format("M/D")}`
		) : (
			`Dept ${dateRangeStart.format("M/D")}${
				roundTrip ? `, Return ${dateRangeEnd.format("M/D")}` : ""
			}`
		);
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
			setDateRangeStartSelect(true);
		}
	}

	function handleDateRangeChange(newDateRange) {
		if (multipleDates) {
			if (dateRangeStartSelect) {
				setDateRangeStart(newDateRange);
			} else {
				setDateRangeEnd(newDateRange);
			}
		} else {
			setDateRangeStart(newDateRange);
		}
	}

	const [hoverStartDate, setHoverStartDate] = useState(dateRangeStart);
	const [hoverEndDate, setHoverEndDate] = useState(dateRangeEnd);

	useEffect(() => {
		setHoverStartDate(dateRangeStart);
	}, [dateRangeStart]);

	useEffect(() => {
		setHoverEndDate(dateRangeEnd);
	}, [dateRangeEnd]);

	const PickersDayStyled = styled(PickersDay)(({ theme }) => ({
		"&.Mui-selected": {
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.primary.contrastText,
		},
	}));

	const isHover =
		!hoverStartDate.isSame(dateRangeStart, "d") ||
		!hoverEndDate.isSame(dateRangeEnd, "d");

	const CustomDay = (props) => {
		const { day, ...other } = props;
		const isIntermediateDay =
			day.isSameOrAfter(hoverStartDate, "d") &&
			day.isSameOrBefore(hoverEndDate, "d");
		const isStartDate = day.isSame(hoverStartDate, "d");
		const isEndDate = day.isSame(hoverEndDate, "d");
		const leftBorders = flexible
			? isStartDate || day.get("d") === 0 || day.get("D") === 1
				? "50%"
				: isIntermediateDay
				? 0
				: "50%"
			: "50%";
		const rightBorders = flexible
			? isEndDate || day.get("d") === 6 || day.isSame(day.endOf("M"), "d")
				? "50%"
				: isIntermediateDay
				? 0
				: "50%"
			: "50%";
		return (
			<PickersDayStyled
				{...other}
				day={day}
				onClick={() => setDateRangeStartSelect(!dateRangeStartSelect)}
				onMouseLeave={() => {
					setHoverStartDate(dateRangeStart);
					setHoverEndDate(dateRangeEnd);
				}}
				onMouseOver={() => {
					if (flexible) {
						if (dateRangeStartSelect) {
							setHoverStartDate(day);
						} else {
							setHoverEndDate(day);
						}
					}
				}}
				selected={
					isStartDate ||
					day.isSame(dateRangeStart, "d") ||
					(multipleDates && (isEndDate || day.isSame(dateRangeEnd, "d")))
				}
				style={{
					backgroundColor: flexible
						? isIntermediateDay
							? "rgba(144, 202, 249, 0.08)"
							: "transparent"
						: "transparent",
					borderColor:
						isIntermediateDay && isHover
							? "rgb(255, 255, 255, 0.12)"
							: "transparent",
					borderBottomLeftRadius: leftBorders,
					borderBottomRightRadius: rightBorders,
					borderTopLeftRadius: leftBorders,
					borderTopRightRadius: rightBorders,
				}}
			/>
		);
	};

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
							setFlexible(i ? false : true);
							removeDialogActions();
						}}
						value={flexible ? 0 : 1}
					>
						<Tab disableRipple label="Flexible dates" />
						<Tab disableRipple label={`Specific date${roundTrip ? "s" : ""}`} />
					</Tabs>
					<div>
						{roundTrip && flexible && !error && (
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
						<div id="date-range-text-container">
							{getDateRangeString(true)}
							{multipleDates && (
								<div>
									<Button
										color={
											error.includes("date is after") ? "error" : "primary"
										}
										endIcon={<SwapHorizIcon />}
										onClick={() => {
											setDateRangeStart(dateRangeEnd);
											setDateRangeEnd(dateRangeStart);
										}}
										variant="outlined"
									>
										Swap dates
									</Button>
									<Button
										endIcon={
											dateRangeStartSelect ? (
												<SwitchLeftIcon />
											) : (
												<SwitchRightIcon />
											)
										}
										onClick={() =>
											setDateRangeStartSelect(!dateRangeStartSelect)
										}
										variant="outlined"
									>
										Switch date
									</Button>
								</div>
							)}
							{error && (
								<span
									className={`error-text${
										shakeError && error ? " error-critical" : ""
									}`}
									style={{ textAlign: "center" }}
								>
									{error}
								</span>
							)}
							{fixedDates && (
								<div id="date-range-warning">
									*Dates locked to current search{" "}
									<Button onClick={() => newSearch(false)} variant="outlined">
										New search
									</Button>
								</div>
							)}
						</div>
						<StaticDatePicker
							disableHighlightToday
							maxDate={maxDate}
							minDate={minDate}
							onChange={handleDateRangeChange}
							slots={{ day: CustomDay, toolbar: () => {} }}
							value={
								multipleDates
									? dateRangeStartSelect
										? dateRangeStart
										: dateRangeEnd
									: dateRangeStart
							}
						></StaticDatePicker>
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
