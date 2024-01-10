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
	const [edit, setEdit] = useState(value);
	const [selected, setSelected] = useState(false);
	const addInfo = {
		numAdults: "16+",
		numSeniors: "55+",
		numYouth: "13 - 15",
		numChildren: "2 - 12",
		numInfants: "Under 2",
	};
	const [numTravelers, setNumTravelers] = useState(1);

	useEffect(() => {
		setNumTravelers(Object.values(edit).reduce((a, b) => a + b, 0));
	}, [edit]);

	function handleEdit(travelerType, increment) {
		const newEdit = { ...edit };
		newEdit[travelerType] += increment ? 1 : -1;
		setEdit(newEdit);
	}

	const [anchor, setAnchor] = useState(null);

	return (
		<div>
			<Button
				className={`select ${!selected ? "not-" : ""}selected`}
				disableRipple
				endIcon={<ArrowDropDownIcon />}
				onClick={(e) => {
					console.log("clicked!");
					setSelected(true);
					setAnchor(e.currentTarget);
				}}
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
				onClose={() => {
					setSelected(false);
					setValue(edit);
					setAnchor(null);
				}}
				open={Boolean(anchor)}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				{Object.keys(edit).map((travelerType) => (
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
								onClick={() => handleEdit(travelerType, false)}
								className={`number-button-${
									travelerType === "numAdults" || travelerType === "numSeniors"
										? edit.numAdults + edit.numSeniors === 1
											? "disabled"
											: edit[travelerType] === 0
											? "disabled"
											: "enabled"
										: edit[travelerType] === 0
										? "disabled"
										: "enabled"
								}`}
							>
								<RemoveIcon />
							</button>
							<span>{edit[travelerType]}</span>
							<button
								onClick={() => handleEdit(travelerType, true)}
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
					<Button
						disableRipple
						onClick={() => {
							setSelected(false);
							setAnchor(null);
							setEdit(value);
						}}
					>
						Cancel
					</Button>
					<Button
						disableRipple
						onClick={() => {
							setSelected(false);
							setValue(edit);
							setAnchor(null);
						}}
					>
						Done
					</Button>
				</div>
			</Menu>
		</div>
	);
}
