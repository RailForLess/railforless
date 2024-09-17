import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";

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
		submit();
	}

	function submit() {
		document.getElementById(`amtrak-form-${i}`).submit();
	}

	return (
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
			>
				Book on amtrak.com
			</Button>
		</form>
	);
}
