import { useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AmtrakForm({ i, option, travelerTypes, tripType }) {
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
		if (travelerTypes.numYouth > 0) {
			setWarningOpen(true);
		} else {
			submit();
		}
	}

	function submit() {
		document.getElementById(`amtrak-form-${i}`).submit();
	}

	const [warningOpen, setWarningOpen] = useState(false);

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
				value={tripType === "round-trip" ? "Return" : "OneWay"}
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
				value={
					tripType === "round-trip"
						? option.arrivalDateTime.format("MM/DD/YYYY")
						: ""
				}
			/>
			{travelerTypesArray.map((travelerType, i) => (
				<input
					type="hidden"
					name={`wdf_person_type${i + 1}`}
					value={travelerType}
				/>
			))}
			<Button
				disabled={navigator.userAgent.includes("Firefox")}
				endIcon={<OpenInNewIcon />}
				onClick={(e) => handleSubmit(e)}
				type="submit"
				variant="outlined"
			>
				Book on amtrak.com
			</Button>
			<Dialog open={warningOpen}>
				<DialogTitle>Youth Traveler Warning</DialogTitle>
				<DialogContent>
					<DialogContentText>
						It looks like you're booking one or more youth tickets. These
						tickets will not transfer when the Amtrak booking page opens, make
						sure to add them in the Travelers menu.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={submit}>OK</Button>
				</DialogActions>
			</Dialog>
		</form>
	);
}
