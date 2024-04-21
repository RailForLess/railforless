import AddItems from "./AddOns";
import Amenities from "./Amenities";
import Days from "./Days";
import Duration from "./Duration";
import Layovers from "./Layovers";
import Price from "./Price";
import Routes from "./Routes";
import Times from "./Times";
import "./Filters.css";

export default function Filters({
	routes,
	setRoutes,
	maxLayovers,
	setMaxLayovers,
	maxPrice,
	setMaxPrice,
	outboundDeptTime,
	setOutboundDeptTime,
	outboundArrivalTime,
	setOutboundArrivalTime,
	returnDeptTime,
	setReturnDeptTime,
	returnArrivalTime,
	setReturnArrivalTime,
	tripType,
	days,
	setDays,
	maxDuration,
	setMaxDuration,
	amenities,
	setAmenities,
	addItems,
	setAddItems,
}) {
	return (
		<div id="filters">
			<Routes routes={routes} setRoutes={setRoutes} />
			<Layovers maxLayovers={maxLayovers} setMaxLayovers={setMaxLayovers} />
			<Price maxPrice={maxPrice} setMaxPrice={setMaxPrice} />
			<Times
				outboundDeptTime={outboundDeptTime}
				setOutboundDeptTime={setOutboundDeptTime}
				outboundArrivalTime={outboundArrivalTime}
				setOutboundArrivalTime={setOutboundArrivalTime}
				returnDeptTime={returnDeptTime}
				setReturnDeptTime={setReturnDeptTime}
				returnArrivalTime={returnArrivalTime}
				setReturnArrivalTime={setReturnArrivalTime}
				tripType={tripType}
			/>
			<Days days={days} setDays={setDays} />
			<Duration maxDuration={maxDuration} setMaxDuration={setMaxDuration} />
			<Amenities amenities={amenities} setAmenities={setAmenities} />
			<AddItems addItems={addItems} setAddItems={setAddItems} />
		</div>
	);
}
