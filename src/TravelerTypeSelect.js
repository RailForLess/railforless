import { useEffect, useState } from "react";
import "./TravelerTypeSelect.css";
import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function TravelerTypeSelect({ value, setValue, searching }) {
	const addInfo = {
		numAdults: "16+",
		numSeniors: "65+",
		numYouth: "13 - 15",
		numChildren: "2 - 12",
		numInfants: "Under 2",
	};
	const [numTravelers, setNumTravelers] = useState(1);

	useEffect(() => {
		setNumTravelers(Object.values(value).reduce((a, b) => a + b, 0));
	}, [value]);

	const [anchor, setAnchor] = useState(null);

	return (
		<div>
			<Button
				className={`select ${!anchor ? "not-" : ""}selected`}
				disableRipple
				endIcon={<ArrowDropDownIcon />}
				onClick={(e) => setAnchor(e.currentTarget)}
				variant={!searching ? "" : "outlined"}
			>
				<PersonOutlineIcon sx={{ mr: 1 }} />
				{Object.values(value).reduce((a, b) => a + b, 0)}
			</Button>
			<Menu
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				onClose={() => setAnchor(null)}
				open={Boolean(anchor)}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				{Object.keys(value).map((travelerType) => (
					<MenuItem
						className="number-row"
						disableRipple
						id={travelerType}
						key={travelerType}
						onClick={(e) => e.stopPropagation()}
					>
						<div>
							<span>{travelerType.slice(3)}</span>
							<span>{addInfo[travelerType]}</span>
						</div>
						<div>
							<button
								onClick={() =>
									setValue({
										...value,
										[travelerType]: value[travelerType] - 1,
									})
								}
								className={`number-button-${
									travelerType === "numAdults" || travelerType === "numSeniors"
										? value.numAdults + value.numSeniors === 1
											? "disabled"
											: value[travelerType] === 0
											? "disabled"
											: "enabled"
										: value[travelerType] === 0
										? "disabled"
										: "enabled"
								}`}
							>
								<RemoveIcon />
							</button>
							<span>{value[travelerType]}</span>
							<button
								onClick={() =>
									setValue({
										...value,
										[travelerType]: value[travelerType] + 1,
									})
								}
								className={`number-button-${
									numTravelers === 8 ? "disabled" : "enabled"
								}`}
							>
								<AddIcon />
							</button>
						</div>
					</MenuItem>
				))}
				<div className="options">
					<Button disableRipple onClick={() => setAnchor(null)}>
						Done
					</Button>
				</div>
			</Menu>
		</div>
	);
}
