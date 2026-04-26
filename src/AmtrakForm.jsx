import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";

function translateBrightlineIDToCode(id) {
	switch (id) {
	case "ORLb":
		return "MCO";
	case "WPT":
		return "WPB";
	case "BOC":
		return "RRN";
	case "FTLb":
		return "FBT";
	case "MIAb":
		return "EKW";
	default:
		return id; // leave Amtrak and other codes untouched
	}
}

export default function AmtrakForm({
	i,
	option,
	travelerTypes,
	roundTrip,
	usePoints,
}) {
	const travelerTypesArray = [];
	for (const [type, num] of Object.entries(travelerTypes)) {
		for (const i of [...Array(num).keys()]) {
			travelerTypesArray.push(
				type === "numAdults"
					? "Adult"
					: type === "numSeniors"
					? "Senior"
					: type === "numYouth"
					? "Youth"
					: type === "numChildren"
					? "Child"
					: "Infant"
			);
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		document.getElementById(`amtrak-form-${i}`).submit();
	}

	return (
		(option.origin.routes.includes("Brightline") || option.destination.routes.includes("Brightline")) ?
		<Button
				endIcon={<OpenInNewIcon />}
				href={`https://www.gobrightline.com/booking?from=${translateBrightlineIDToCode(option.origin.code)}&to=${translateBrightlineIDToCode(option.destination.code)}&adults=1&start_date=${option.departureDateTime.format("YYYY-MM-DD")}&end_date=${option.travelLegs.length > 1 ? option.arrivalDateTime.format("YYYY-MM-DD") : ""}`}
				target="_blank"
				rel="noopener noreferrer"
				variant="outlined"
				data-rybbit-event="book_amtrak_clicked"
			>
				Book on gobrightline.com
			</Button> :
		<form
			action="https://www.amtrak.com/services/journeysearch"
			id={`amtrak-form-${i}`}
			method="post"
			target="_blank"
		>
			<input
				type="hidden"
				name="wdf_TripType"
				value={roundTrip ? "Return" : "OneWay"}
			/>
			<input type="hidden" name="wdf_origin" value={option.origin.code} />
			<input
				type="hidden"
				name="wdf_destination"
				value={option.destination.code}
			/>
			<input
				type="hidden"
				name="/sessionWorkflow/productWorkflow[@product='Rail']/tripRequirements/journeyRequirements[1]/departDate.date"
				value={option.departureDateTime.format("MM/DD/YYYY")}
			/>
			<input
				type="hidden"
				name="/sessionWorkflow/productWorkflow[@product='Rail']/tripRequirements/journeyRequirements[2]/departDate.date"
				value={roundTrip ? option.arrivalDateTime.format("MM/DD/YYYY") : ""}
			/>
			{travelerTypesArray.map((travelerType, i) => (
				<input
					key={travelerType}
					type="hidden"
					name={`wdf_person_type${i + 1}`}
					value={travelerType}
				/>
			))}
			<input
				type="hidden"
				name="wdf_BookType"
				value={usePoints ? "redeem" : ""}
			></input>
			<Button
				endIcon={<OpenInNewIcon />}
				onClick={(e) => handleSubmit(e)}
				type="submit"
				variant="outlined"
				data-rybbit-event="book_amtrak_clicked"
			>
				Book on amtrak.com
			</Button>
		</form>
	);
}
