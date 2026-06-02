import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useSearchParams } from "react-router-dom";
import Turnstile from "./Turnstile";
import "./Alerts.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ErrorIcon from "@mui/icons-material/Error";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

dayjs.extend(utc);

const ACCOMMODATIONS = [
	{ value: "coach", label: "Coach" },
	{ value: "business", label: "Business" },
	{ value: "roomette", label: "Roomette" },
	{ value: "bedroom", label: "Bedroom" },
	{ value: "family_room", label: "Family Room" },
];

export default function Alerts() {
	const [searchParams] = useSearchParams();

	const [stations, setStations] = useState([]);
	const [stationsLoaded, setStationsLoaded] = useState(false);

	const [email, setEmail] = useState("");
	const [origin, setOrigin] = useState(null);
	const [destination, setDestination] = useState(null);
	const [accommodation, setAccommodation] = useState("coach");
	const [priceThreshold, setPriceThreshold] = useState("");
	const [singleDay, setSingleDay] = useState(false);
	const [trainNumbers, setTrainNumbers] = useState("");
	const [startDate, setStartDate] = useState(
		dayjs.utc().startOf("d").add(1, "d"),
	);
	const [endDate, setEndDate] = useState(dayjs.utc().startOf("d").add(7, "d"));

	const [showTurnstile, setShowTurnstile] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [success, setSuccess] = useState(false);
	const [showErrors, setShowErrors] = useState(false);
	const [duplicate, setDuplicate] = useState(false);
	const [unsubscribing, setUnsubscribing] = useState(false);
	const [unsubscribeSent, setUnsubscribeSent] = useState(false);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_DOMAIN}/stations`)
			.then((res) => res.json())
			.then((data) => {
				const sorted = data
					.sort((a, b) => a.stateLong.localeCompare(b.stateLong))
					.map((station) => ({ ...station, group: station.stateLong }));
				setStations(sorted);
				const o = searchParams.get("origin");
				const d = searchParams.get("destination");
				if (o) {
					const match = sorted.find((s) => s.code === o);
					if (match) setOrigin(match);
				}
				if (d) {
					const match = sorted.find((s) => s.code === d);
					if (match) setDestination(match);
				}
				setStationsLoaded(true);
			})
			.catch(() => setStationsLoaded(true));

		const s = searchParams.get("start");
		const e = searchParams.get("end");
		if (s && dayjs(s).isValid()) {
			setStartDate(dayjs(s).utc().startOf("d"));
		}
		if (e && dayjs(e).isValid()) {
			setEndDate(dayjs(e).utc().startOf("d"));
		}
		const a = searchParams.get("accommodation");
		if (a) {
			const match = ACCOMMODATIONS.find((opt) => opt.label === a);
			if (match) setAccommodation(match.value);
		}
		const p = searchParams.get("price");
		if (p && !isNaN(parseFloat(p))) {
			setPriceThreshold(p);
		}
	}, []);

	const today = dayjs.utc().startOf("d");
	const maxStartDate = today.add(30, "d");
	const priceNum = parseFloat(priceThreshold);
	const effectiveEnd = singleDay ? startDate : endDate;
	const rangeDays = effectiveEnd.diff(startDate, "d") + 1;

	let errorText = "";
	if (!email.trim()) {
		errorText = "Enter an email address";
	} else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
		errorText = "Invalid email address";
	} else if (!origin) {
		errorText = "Select an origin station";
	} else if (!destination) {
		errorText = "Select a destination station";
	} else if (origin.id === destination.id) {
		errorText = "Origin and destination must be different";
	} else if (!priceThreshold || isNaN(priceNum) || priceNum <= 0) {
		errorText = "Enter a price threshold greater than $0";
	} else if (startDate.isBefore(today, "d")) {
		errorText = "Start date must be today or later";
	} else if (startDate.isAfter(maxStartDate, "d")) {
		errorText = "Start date must be within 30 days from today";
	} else if (!singleDay && endDate.isBefore(startDate, "d")) {
		errorText = "End date must be on or after start date";
	} else if (!singleDay && rangeDays > 31) {
		errorText = "Date range must be 31 days or less";
	} else if (
		trainNumbers.trim() &&
		!trainNumbers
			.split(",")
			.map((n) => n.trim())
			.filter(Boolean)
			.every((n) => /^\d+$/.test(n))
	) {
		errorText = "Train numbers must be comma-separated numbers (e.g. 91, 92)";
	}

	function resetForm() {
		setEmail("");
		setOrigin(null);
		setDestination(null);
		setAccommodation("coach");
		setPriceThreshold("");
		setSingleDay(false);
		setTrainNumbers("");
		setStartDate(dayjs.utc().startOf("d").add(1, "d"));
		setEndDate(dayjs.utc().startOf("d").add(7, "d"));
		setSubmitError("");
		setShowErrors(false);
		setDuplicate(false);
		setUnsubscribeSent(false);
		setSuccess(false);
	}

	function getTurnstileToken() {
		return new Promise((resolve) => {
			const turnstileId = window.turnstile.render("#turnstile", {
				callback: (token) => {
					setShowTurnstile(false);
					window.turnstile.remove(turnstileId);
					resolve(token);
				},
				"refresh-expired": "never",
				sitekey: process.env.REACT_APP_TURNSTILE_SITE_KEY,
			});
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (errorText) {
			setShowErrors(false);
			setTimeout(() => setShowErrors(true), 0);
			return;
		}
		setShowErrors(false);
		setSubmitError("");
		setDuplicate(false);
		setUnsubscribeSent(false);
		setSubmitting(true);
		flushSync(() => setShowTurnstile(true));
		let token;
		try {
			token = await getTurnstileToken();
		} catch {
			setSubmitting(false);
			setShowTurnstile(false);
			setSubmitError("Verification failed — try again");
			return;
		}
		try {
			const body = {
				email: email.trim(),
				origin: origin.code,
				destination: destination.code,
				accommodation,
				price_threshold: priceNum,
				start_date: startDate.format("YYYY-MM-DD"),
			};
			if (!singleDay) {
				body.end_date = endDate.format("YYYY-MM-DD");
			}
			const parsedTrainNumbers = trainNumbers
				.split(",")
				.map((n) => n.trim())
				.filter(Boolean);
			if (parsedTrainNumbers.length > 0) {
				body.train_numbers = parsedTrainNumbers;
			}
			const res = await fetch(
				`${process.env.REACT_APP_API_DOMAIN}/v1/subscriptions`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"auth-turnstile": token,
					},
					body: JSON.stringify(body),
				},
			);
			if (res.status === 201) {
				setSuccess(true);
			} else if (res.status === 409) {
				setDuplicate(true);
			} else if (res.status === 400) {
				const data = await res.json().catch(() => null);
				const msg =
					data && Array.isArray(data.error) && data.error.length > 0
						? data.error
								.map((err) =>
									typeof err === "string"
										? err
										: err.message || JSON.stringify(err),
								)
								.join(". ")
						: "Invalid subscription details";
				setSubmitError(msg);
			} else {
				setSubmitError(`Subscription failed (HTTP ${res.status})`);
			}
		} catch {
			setSubmitError("Network error — try again");
		} finally {
			setSubmitting(false);
		}
	}

	async function handleUnsubscribeRequest() {
		setSubmitError("");
		setUnsubscribing(true);
		flushSync(() => setShowTurnstile(true));
		let token;
		try {
			token = await getTurnstileToken();
		} catch {
			setUnsubscribing(false);
			setShowTurnstile(false);
			setSubmitError("Verification failed — try again");
			return;
		}
		try {
			const res = await fetch(
				`${process.env.REACT_APP_API_DOMAIN}/v1/subscriptions/unsubscribe-request`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"auth-turnstile": token,
					},
					body: JSON.stringify({ email: email.trim() }),
				},
			);
			if (res.ok) {
				setUnsubscribeSent(true);
				setDuplicate(false);
			} else {
				setSubmitError(`Unsubscribe request failed (HTTP ${res.status})`);
			}
		} catch {
			setSubmitError("Network error — try again");
		} finally {
			setUnsubscribing(false);
		}
	}

	if (success) {
		return (
			<div className="main-container fade-in-translate" id="alerts-container">
				<div className="section-container" id="alerts-success">
					<MailOutlineIcon id="alerts-success-icon" />
					<h1>Check your email</h1>
					<p>
						We sent a verification link to <strong>{email.trim()}</strong>.
						Click the link to activate your price alert. The link expires in 24
						hours.
					</p>
					<Button onClick={resetForm} variant="outlined">
						Back to price alerts
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="main-container fade-in-translate" id="alerts-container">
			<div className="section-container" id="alerts-form-section">
				<div id="alerts-header">
					<NotificationsActiveIcon id="alerts-header-icon" />
					<h1>Fare Drop Alerts</h1>
					<p>
						Get an email when fares fall below your threshold. We'll watch the
						route for you and notify you as soon as prices drop.
					</p>
				</div>
				<form id="alerts-form" onSubmit={handleSubmit} noValidate>
					<TextField
						fullWidth
						label="Email"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
						type="email"
						value={email}
					/>
					<div className="alerts-row">
						<Autocomplete
							disabled={!stationsLoaded}
							fullWidth
							getOptionLabel={(option) =>
								option ? `${option.name} (${option.code})` : ""
							}
							groupBy={(station) => station.group}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							loadingText="Getting stations..."
							onChange={(e, v) => setOrigin(v)}
							options={stations}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Origin"
									placeholder="name/code/city"
								/>
							)}
							value={origin}
						/>
						<Autocomplete
							disabled={!stationsLoaded}
							fullWidth
							getOptionLabel={(option) =>
								option ? `${option.name} (${option.code})` : ""
							}
							groupBy={(station) => station.group}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							loadingText="Getting stations..."
							onChange={(e, v) => setDestination(v)}
							options={stations}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Destination"
									placeholder="name/code/city"
								/>
							)}
							value={destination}
						/>
					</div>
					<div className="alerts-row">
						<TextField
							fullWidth
							label="Accommodation"
							onChange={(e) => setAccommodation(e.target.value)}
							select
							value={accommodation}
						>
							{ACCOMMODATIONS.map((opt) => (
								<MenuItem key={opt.value} value={opt.value}>
									{opt.label}
								</MenuItem>
							))}
						</TextField>
						<TextField
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AttachMoneyIcon fontSize="small" />
									</InputAdornment>
								),
								inputProps: { min: 0, step: "0.01" },
							}}
							label="Price threshold"
							onChange={(e) => setPriceThreshold(e.target.value)}
							placeholder="79.00"
							type="number"
							value={priceThreshold}
						/>
					</div>
					<FormControlLabel
						control={
							<Switch
								checked={singleDay}
								onChange={(e) => setSingleDay(e.target.checked)}
							/>
						}
						label="Single day only"
					/>
					<div className="alerts-row">
						<DatePicker
							label="Start date"
							maxDate={maxStartDate}
							minDate={today}
							onChange={(v) => v && setStartDate(v)}
							slotProps={{ textField: { fullWidth: true } }}
							value={startDate}
						/>
						{!singleDay && (
							<DatePicker
								label="End date"
								maxDate={startDate.add(30, "d")}
								minDate={startDate}
								onChange={(v) => v && setEndDate(v)}
								slotProps={{ textField: { fullWidth: true } }}
								value={endDate}
							/>
						)}
					</div>
					<TextField
						fullWidth
						label="Train numbers (optional)"
						onChange={(e) => setTrainNumbers(e.target.value)}
						placeholder="91, 92, 151"
						value={trainNumbers}
					/>
					{showErrors && errorText && (
						<div className="error-critical error-text" id="alerts-error">
							<ErrorIcon fontSize="small" />
							<span>{errorText}</span>
						</div>
					)}
					{submitError && (
						<Alert severity="error" sx={{ width: "100%" }}>
							{submitError}
						</Alert>
					)}
					{duplicate && !unsubscribeSent && (
						<Alert
							severity="warning"
							sx={{ width: "100%" }}
							action={
								<Button
									color="inherit"
									disabled={unsubscribing}
									onClick={handleUnsubscribeRequest}
									size="small"
								>
									{unsubscribing ? "Sending..." : "Unsubscribe"}
								</Button>
							}
						>
							An alert already exists for this email — unsubscribe from the
							existing one first.
						</Alert>
					)}
					{unsubscribeSent && (
						<Alert severity="success" sx={{ width: "100%" }}>
							Unsubscribe email sent to <strong>{email.trim()}</strong>. Click
							the link to confirm, then try creating the alert again.
						</Alert>
					)}
					<Box id="alerts-submit">
						{showTurnstile ? (
							<Turnstile />
						) : (
							<Button
								disabled={submitting}
								data-rybbit-event="subscribe"
								endIcon={
									submitting ? (
										<CircularProgress color="inherit" size={16} />
									) : (
										<NotificationsActiveIcon />
									)
								}
								size="large"
								type="submit"
								variant="contained"
							>
								{submitting ? "Submitting..." : "Create alert"}
							</Button>
						)}
					</Box>
				</form>
			</div>
		</div>
	);
}
