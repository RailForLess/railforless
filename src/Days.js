import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import CheckboxRow from "./CheckboxRow";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";

export default function Days({ days, setDays }) {
	const excludedDays = Object.keys(days)
		.filter((day) => !days[day])
		.map((day) => Number(day));
	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const string =
		excludedDays.length > 1
			? `Exclude: ${dayNames[excludedDays[0]]} +${excludedDays.length - 1}`
			: excludedDays.length === 1
			? `Exclude: ${dayNames[excludedDays[0]]}`
			: "Days";

	function clear() {
		setDays(Object.keys(days).reduce((a, b) => ({ ...a, [b]: true }), {}));
	}

	const [anchor, setAnchor] = useState(null);

	return (
		<div
			className={`filter-${excludedDays.length === 0 ? "not-" : ""}selected`}
		>
			<Button
				className={`filter-button select ${
					!anchor && excludedDays.length === 0 ? "not-" : ""
				}selected`}
				disableRipple
				endIcon={
					excludedDays.length === 0 ? (
						<ArrowDropDownIcon
							sx={{ transform: `rotate(${Boolean(anchor) ? 180 : 0}deg)` }}
						/>
					) : (
						<CloseIcon
							onClick={(e) => {
								e.stopPropagation();
								clear();
							}}
							fontSize="small"
						/>
					)
				}
				onClick={(e) => setAnchor(e.currentTarget)}
				variant="outlined"
			>
				{string}
			</Button>
			<Popover
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
				<div className="popover-filter">
					<div>
						<span>Days</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					{Object.keys(days).map((day) => (
						<CheckboxRow
							values={days}
							setValues={setDays}
							value={day}
							label={dayNames[Number(day)]}
						/>
					))}
					<div className="options">
						<Button
							disabled={excludedDays.length === 0}
							disableRipple
							onClick={clear}
						>
							Clear
						</Button>
					</div>
				</div>
			</Popover>
		</div>
	);
}
