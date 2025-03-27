import dayjs from "dayjs";
import { useState } from "react";
import AmtrakForm from "./AmtrakForm";
import DelayInfo from "./DelayInfo";
import { routesInfo } from "./routesInfo";
import "./Option.css";
import AccessibleIcon from "@mui/icons-material/Accessible";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import ChairIcon from "@mui/icons-material/Chair";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsRailwayIcon from "@mui/icons-material/DirectionsRailway";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LuggageIcon from "@mui/icons-material/Luggage";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import PetsIcon from "@mui/icons-material/Pets";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import TvIcon from "@mui/icons-material/Tv";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import SpeedIcon from "@mui/icons-material/Speed";
import SportsGolfIcon from "@mui/icons-material/SportsGolf";
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
	roundTrip,
	outboundDays,
	returnDays,
	usePoints,
	fareFormatter,
	showTimes,
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
		]
			.sort()
			.map(
				(route) => `${routesInfo[route] ? routesInfo[route].icon : ""} ${route}`
			);
		return routeSummary.length > 2
			? `${routeSummary.slice(0, 2).join(", ")} + ${routeSummary.length - 2}`
			: routeSummary.join(", ");
	}

	function getDuration(elapsedSeconds) {
		const hours = Math.floor(elapsedSeconds / 3600);
		return `${hours ? `${hours}h` : ""} ${(elapsedSeconds % 3600) / 60}m`;
	}

	const getClassSummary = (option) =>
		[...new Set([].concat(...option.travelLegs.map((trip) => trip.class)))]
			.sort()
			.join("/");

	const [expanded, setExpanded] = useState(false);

	const getFareFamily = (fareFamily) =>
		fareFamily === "SAL" ? "Sale" : fareFamily === "VLU" ? "Value" : "Flex";

	const getAmenityIcon = (amenity) =>
		amenity === "Cafe" ? (
			<LocalCafeIcon fontSize="small" />
		) : amenity === "Checked Baggage" ? (
			<LuggageIcon fontSize="small" />
		) : amenity === "Free WiFi" ? (
			<WifiIcon fontSize="small" />
		) : amenity === "Flexible Dining" ? (
			<TakeoutDiningIcon fontSize="small" />
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

	const getAddItemIcon = (addItem) =>
		addItem.type === "Automobile" ? (
			<DirectionsCarIcon fontSize="small" />
		) : addItem.type === "Bicycle" ? (
			<PedalBikeIcon fontSize="small" />
		) : addItem.type === "Golf Clubs" ? (
			<SportsGolfIcon fontSize="small" />
		) : addItem.type === "Motorcycle" ? (
			<TwoWheelerIcon fontSize="small" />
		) : addItem.type === "Offloading" ? (
			<SpeedIcon fontSize="small" />
		) : addItem.type === "Pet" ? (
			<PetsIcon fontSize="small" />
		) : (
			<AirportShuttleIcon fontSize="small" />
		);

	async function handleExpand() {
		setExpanded(!expanded);
		if (!expanded) {
			for (const trip of option.travelLegs) {
				for (const travelLeg of trip.travelLegs) {
					for (const station of [travelLeg.origin, travelLeg.destination]) {
						if (!avgDelays[`${travelLeg.trainId}${station.code}`]) {
							let res = await fetch(
								`https://juckins.net/amtrak_api/api.php?num=${
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
							setAvgDelays((avgDelays) => ({
								...avgDelays,
								[`${travelLeg.trainId}${station.code}`]: data,
							}));
						}
					}
				}
			}
		}
	}

	function getDaysFilters() {
		return !(
			Object.keys(outboundDays)
				.filter((day) => !outboundDays[day])
				.map((day) => Number(day)).length === 0 &&
			Object.keys(returnDays)
				.filter((day) => !returnDays[day])
				.map((day) => Number(day)).length === 0
		);
	}

	const daysFilters = getDaysFilters();

	return (
		<Accordion
			className="option-container"
			expanded={expanded}
			onChange={handleExpand}
			sx={{
				border: option.minPrice ? "1px solid green" : "none",
				marginTop: option.marginTop && sort === "price" ? "1rem" : "",
			}}
		>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<div className="option-summary">
					<span>{getRouteSummary(option)}</span>
					<div className="vertical-bar"></div>
					<span>
						{roundTrip
							? `${option.departureDateTime.format(
									`${`${daysFilters ? "ddd, " : ""}M/D`}${
										showTimes ? " (h:mm A)" : ""
									}`
							  )}—${option.arrivalDateTime.format(
									`${`${daysFilters ? "ddd, " : ""}M/D`}${
										showTimes ? " (h:mm A)" : ""
									}`
							  )}`
							: option.departureDateTime.format(
									`ddd, MMM D${showTimes ? " (h:mm A)" : ""}`
							  )}
					</span>
					<div className="vertical-bar"></div>
					<span>{getDuration(option.elapsedSeconds)}</span>
					<div className="vertical-bar"></div>
					{!expanded ? (
						<span>{getClassSummary(option)}</span>
					) : (
						<AmtrakForm
							i={i}
							option={option}
							travelerTypes={travelerTypes}
							roundTrip={roundTrip}
							usePoints={usePoints}
						/>
					)}
					<div className="vertical-bar"></div>
					<span style={{ color: option.minPrice ? "#81c995" : "white" }}>
						{fareFormatter(option.fare)}
					</span>
				</div>
			</AccordionSummary>
			<AccordionDetails>
				{option.travelLegs.map((trip, j) => (
					<div className="trip-container" key={`option-${i}-${j}`}>
						<div>
							<div>
								<span>{j ? "Return" : "Departure"}</span>
								<span className="dot">·</span>
								<span>{`${trip.departureDateTime.format("ddd, MMM D")}${
									trip.arrivalDateTime.isAfter(trip.departureDateTime, "D")
										? `—${trip.arrivalDateTime.format("ddd, MMM D")}`
										: ""
								}`}</span>
								<span className="dot">·</span>
								<span>{trip.class}</span>
							</div>
							<span>{fareFormatter(trip.fare)}</span>
						</div>
						{trip.travelLegs.map((leg, k) => (
							<div key={`option-${i}-${j}-${k}`}>
								<div className="leg-container">
									<div className="leg-info-container">
										<div>
											<div className="dot-end"></div>
											<div className="dot-line"></div>
											<div className="dot-end"></div>
											<div>
												{leg.type === "TRAIN" ? (
													<DirectionsRailwayIcon />
												) : (
													<DirectionsBusIcon />
												)}
											</div>
										</div>
										<div>
											<div className="station-container">
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
														<span>
															{leg.departureDateTime.format("h:mm A")}
														</span>
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
												{leg.origin.connections &&
													leg.origin.connections.length > 0 && (
														<div>
															{leg.origin.connections.map((connection, l) => (
																<div
																	className="connection"
																	key={`option-${i}-${j}-${k}-${l}`}
																>
																	<img
																		alt={`${connection} logo`}
																		src={`/images/connections/${connection
																			.toLowerCase()
																			.replaceAll(" ", "-")
																			.replaceAll('"', "'")}.png`}
																	/>
																	<span>{connection}</span>
																</div>
															))}
														</div>
													)}
											</div>
											<div>
												<span>{getDuration(leg.elapsedSeconds)}</span>
												<div>
													<span>{leg.trainId}</span>
													{leg.route === "Connecting Bus" ? (
														<a
															href="https://www.amtrak.com/thruway-connecting-services-multiply-your-travel-destinations"
															rel="noreferrer"
															target="_blank"
														>
															Connecting Bus
														</a>
													) : routesInfo[leg.route] ? (
														<a
															href={`https://www.amtrak.com/routes/${
																routesInfo[leg.route].link
															}-train.html`}
															rel="noreferrer"
															target="_blank"
														>
															{leg.route}
														</a>
													) : (
														<span>{leg.route}</span>
													)}
												</div>
											</div>
											<div className="station-container">
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
												{leg.destination.connections &&
													leg.destination.connections.length > 0 && (
														<div>
															{leg.destination.connections.map(
																(connection, l) => (
																	<div
																		className="connection"
																		key={`option-${i}-${j}-${k}-${l}`}
																	>
																		<img
																			alt={`${connection} logo`}
																			src={`/images/connections/${connection
																				.toLowerCase()
																				.replaceAll(" ", "-")
																				.replaceAll('"', "'")}.png`}
																		/>
																		<span>{connection}</span>
																	</div>
																)
															)}
														</div>
													)}
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
												{leg.legAccommodation.fareFamily !== "NA" && (
													<span>{`(${getFareFamily(
														leg.legAccommodation.fareFamily
													)})`}</span>
												)}
												<span
													style={{
														color:
															leg.legAccommodation.availableInventory < 10
																? "indianred"
																: "#9aa0a6",
													}}
												>{`${leg.legAccommodation.availableInventory} left at this price`}</span>
											</div>
										</div>
									</div>
									{((leg.amenities && leg.amenities.length > 0) ||
										(leg.addItems && leg.addItems.length > 0)) && (
										<div className="leg-amenities-container">
											<div>
												{leg.amenities &&
													leg.amenities.length > 0 &&
													leg.amenities.sort().map((amenity, i) => (
														<div key={`amenity-${i}`}>
															{getAmenityIcon(amenity)}
															<span>{amenity}</span>
														</div>
													))}
												{leg.amenities &&
													leg.amenities.length > 0 &&
													leg.addItems &&
													leg.addItems.length > 0 && <hr></hr>}
												{leg.addItems &&
													leg.addItems.length > 0 &&
													leg.addItems
														.sort((a, b) => a.type.localeCompare(b.type))
														.map((addItem, i) => (
															<div key={`addItem-${i}`}>
																{getAddItemIcon(addItem)}
																<span>{`${addItem.type} (${
																	addItem.fare
																		? fareFormatter(addItem.fare)
																		: "free"
																})`}</span>
															</div>
														))}
											</div>
										</div>
									)}
								</div>
								{k + 1 < trip.travelLegs.length && (
									<div className="layover-container">
										<hr></hr>
										<div>
											<div style={{ padding: "1rem 0" }}>
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
