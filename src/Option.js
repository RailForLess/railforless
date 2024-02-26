import dayjs from "dayjs";
import { useState } from "react";
import AmtrakForm from "./AmtrakForm";
import DelayInfo from "./DelayInfo";
import "./Option.css";
import AccessibleIcon from "@mui/icons-material/Accessible";
import ChairIcon from "@mui/icons-material/Chair";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LuggageIcon from "@mui/icons-material/Luggage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import TvIcon from "@mui/icons-material/Tv";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import WifiIcon from "@mui/icons-material/Wifi";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";

export default function Option({
	avgDelays,
	setAvgDelays,
	i,
	option,
	sort,
	travelerTypes,
	tripType,
}) {
	function getRouteSummary(option) {
		const routeSummary = [
			...new Set(
				[].concat(
					...option.travelLegs.map((trip) =>
						trip.travelLegs.map((leg) => leg.route)
					)
				)
			),
		].sort();
		return routeSummary.length > 2
			? `${routeSummary.slice(0, 2).join(", ")} + ${routeSummary.length - 2}`
			: routeSummary.join(", ");
	}

	function getDuration(elapsedSeconds) {
		const hours = Math.floor(elapsedSeconds / 3600);
		return `${hours ? `${hours}h` : ""} ${(elapsedSeconds % 3600) / 60}m`;
	}

	const getClassSummary = (option) =>
		[
			...new Set(
				[].concat(
					...option.travelLegs.map((trip) =>
						trip.travelLegs.map((leg) => leg.legAccommodation.class)
					)
				)
			),
		]
			.sort()
			.join("/");

	const [expanded, setExpanded] = useState(false);

	const getFareFamily = (fareFamily) =>
		fareFamily === "SAL" ? "Sale" : fareFamily === "VLU" ? "Value" : "Flex";

	const getAmenityIcon = (amenity) =>
		amenity === "Checked Baggage" ? (
			<LuggageIcon fontSize="small" />
		) : amenity === "Cafe" ? (
			<LocalCafeIcon fontSize="small" />
		) : amenity === "Flexible Dining" ? (
			<TakeoutDiningIcon fontSize="small" />
		) : amenity === "Free WiFi" ? (
			<WifiIcon fontSize="small" />
		) : amenity === "Quiet Car" ? (
			<VolumeOffIcon fontSize="small" />
		) : amenity === "Seat Display" ? (
			<TvIcon fontSize="small" />
		) : amenity === "Seat Selection" ? (
			<ChairIcon fontSize="small" />
		) : amenity === "Traditional Dining" ? (
			<RestaurantIcon fontSize="small" />
		) : (
			<AccessibleIcon fontSize="small" />
		);

	async function handleExpand() {
		setExpanded(!expanded);
		if (!expanded) {
			const newAvgDelays = structuredClone(avgDelays);
			for (const trip of option.travelLegs) {
				for (const travelLeg of trip.travelLegs) {
					for (const station of [travelLeg.origin, travelLeg.destination]) {
						if (!newAvgDelays[`${travelLeg.trainId}${station.code}`]) {
							let res = await fetch(
								`https://juckins.net/amtrak_status/archive/html/api.php?num=${
									travelLeg.trainId
								}&station=${station.code}&date_start=${dayjs()
									.subtract(30, "d")
									.format("YYYYMMDD")}&date_end=${dayjs()
									.subtract(1, "d")
									.format("YYYYMMDD")}`
							);
							let data = await res.json();
							data = {
								d_dp: Math.round(
									data
										.filter((date) => date.d_dp != null)
										.reduce((a, b) => a + b.d_dp, 0) /
										data.filter((date) => date.d_dp != null).length
								),
								d_ar: Math.round(
									data
										.filter((date) => date.d_ar != null)
										.reduce((a, b) => a + b.d_ar, 0) /
										data.filter((date) => date.d_ar != null).length
								),
							};
							newAvgDelays[`${travelLeg.trainId}${station.code}`] = data;
						}
					}
				}
			}
			setAvgDelays(newAvgDelays);
		}
	}

	return (
		<Accordion
			expanded={expanded}
			onChange={handleExpand}
			sx={{ marginTop: option.marginTop && sort === "price" ? "1rem" : "" }}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				{!expanded ? (
					<div className="option-summary">
						<span>{getRouteSummary(option)}</span>
						<div className="vertical-bar"></div>
						<span>{`${option.departureDateTime.format(
							"M/D"
						)}-${option.arrivalDateTime.format("M/D")}`}</span>
						<div className="vertical-bar"></div>
						<span>{getDuration(option.elapsedSeconds)}</span>
						<div className="vertical-bar"></div>
						<span>{getClassSummary(option)}</span>
						<div className="vertical-bar"></div>
						<span
							style={{ color: option.minPrice ? "#81c995" : "white" }}
						>{`$${option.fare.toLocaleString()}`}</span>
					</div>
				) : (
					<div className="option-summary">
						<span>{getRouteSummary(option)}</span>
						<div className="vertical-bar"></div>
						<span>{`${option.departureDateTime.format(
							"M/D"
						)}-${option.arrivalDateTime.format("M/D")}`}</span>
						<div className="vertical-bar"></div>
						{getDuration(option.elapsedSeconds)}
						<div className="vertical-bar"></div>
						<AmtrakForm
							i={i}
							option={option}
							travelerTypes={travelerTypes}
							tripType={tripType}
						/>
						<div className="vertical-bar"></div>
						<span
							style={{ color: option.minPrice ? "#81c995" : "white" }}
						>{`$${option.fare.toLocaleString()}`}</span>
					</div>
				)}
			</AccordionSummary>
			<AccordionDetails>
				{option.travelLegs.map((trip, j) => (
					<div className="trip-container" key={`option-${i}-${j}`}>
						<div>
							<div>
								<span>{j ? "Return" : "Departure"}</span>
								<span className="dot">·</span>
								<span>{trip.departureDateTime.format("ddd, MMM D")}</span>
							</div>
							<span>{`$${trip.fare.toLocaleString()}`}</span>
						</div>
						{trip.travelLegs.map((leg, k) => (
							<div>
								<div className="leg-container" key={`option-${i}-${j}-${k}`}>
									<div className="leg-info-container">
										<div>
											<div className="dot-end"></div>
											<div className="dot-line"></div>
											<div className="dot-end"></div>
										</div>
										<div>
											<div>
												{avgDelays[`${leg.trainId}${leg.origin.code}`] &&
													!isNaN(
														avgDelays[`${leg.trainId}${leg.origin.code}`].d_dp
													) && (
														<DelayInfo
															isDept={true}
															leg={{
																...leg,
																origin: {
																	...leg.origin,
																	avgDelay:
																		avgDelays[
																			`${leg.trainId}${leg.origin.code}`
																		].d_dp,
																},
															}}
														/>
													)}
												<div>
													<span>{leg.departureDateTime.format("h:mm A")}</span>
													<span className="dot">·</span>
													{leg.origin.code !== "CBN" ? (
														<a
															href={`https://www.amtrak.com/stations/${leg.origin.code}.html`}
															rel="noreferrer"
															target="_blank"
														>{`${leg.origin.name} (${leg.origin.code})`}</a>
													) : (
														<span>{`${leg.origin.name} (${leg.origin.code})`}</span>
													)}
												</div>
											</div>
											<span>{`Travel time: ${getDuration(
												leg.elapsedSeconds
											)}`}</span>
											<span>{`${leg.trainId} ${leg.route}`}</span>
											<div>
												{avgDelays[`${leg.trainId}${leg.destination.code}`] &&
													!isNaN(
														avgDelays[`${leg.trainId}${leg.destination.code}`]
															.d_ar
													) && (
														<DelayInfo
															isDept={false}
															leg={{
																...leg,
																destination: {
																	...leg.destination,
																	avgDelay:
																		avgDelays[
																			`${leg.trainId}${leg.destination.code}`
																		].d_ar,
																},
															}}
														/>
													)}
												<div>
													<span>{leg.arrivalDateTime.format("h:mm A")}</span>
													<span className="dot">·</span>
													{leg.destination.code !== "CBN" ? (
														<a
															href={`https://www.amtrak.com/stations/${leg.destination.code}.html`}
															rel="noreferrer"
															target="_blank"
														>{`${leg.destination.name} (${leg.destination.code})`}</a>
													) : (
														<span>{`${leg.destination.name} (${leg.destination.code})`}</span>
													)}
												</div>
											</div>
										</div>
									</div>
									<div className="leg-accommodation-container">
										<div>
											<span>{`${leg.legAccommodation.neededInventory} ${
												leg.legAccommodation.name
											}${
												leg.legAccommodation.neededInventory > 1 ? "s" : ""
											}`}</span>
											<div>
												<span
													style={{
														color:
															leg.legAccommodation.availableInventory < 10
																? "indianred"
																: "#9aa0a6",
													}}
												>{`${
													leg.legAccommodation.availableInventory
												} left at $${leg.legAccommodation.unitFare.toLocaleString()}`}</span>
												{leg.legAccommodation.fareFamily !== "NA" && (
													<span>{`(${getFareFamily(
														leg.legAccommodation.fareFamily
													)})`}</span>
												)}
											</div>
										</div>
									</div>
									<div className="leg-amenities-container">
										{leg.amenities.sort().map((amenity) => (
											<div>
												{getAmenityIcon(amenity)}
												<span>{amenity}</span>
											</div>
										))}
									</div>
								</div>
								{k + 1 < trip.travelLegs.length && (
									<div className="layover-container">
										<hr></hr>
										<div>
											<div style={{ margin: "1rem 0" }}>
												<span>{`${getDuration(
													trip.travelLegs[k + 1].departureDateTime.diff(
														leg.arrivalDateTime,
														"s"
													)
												)} layover`}</span>
												<span className="dot">·</span>
												<span>{`${leg.destination.name} (${leg.destination.code})`}</span>
											</div>
											{leg.destination.code === "CBN" && (
												<Alert severity="error">Border crossing</Alert>
											)}
										</div>
										<hr></hr>
									</div>
								)}
							</div>
						))}
					</div>
				))}
			</AccordionDetails>
		</Accordion>
	);
}
