import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Popover from "@mui/material/Popover";

export default function Layovers({ maxLayovers, setMaxLayovers }) {
	const string =
		maxLayovers === 0
			? "No layovers"
			: maxLayovers === 1
			? "1 layover or fewer"
			: maxLayovers === 2
			? "2 layovers or fewer"
			: "Layovers";

	const [anchor, setAnchor] = useState(null);

	return (
		<div className={`filter-${maxLayovers === 3 ? "not-" : ""}selected`}>
			<Button
				className={`filter-button select ${
					!anchor && maxLayovers === 3 ? "not-" : ""
				}selected`}
				disableRipple
				endIcon={
					maxLayovers === 3 ? (
						<ArrowDropDownIcon
							sx={{ transform: `rotate(${Boolean(anchor) ? 180 : 0}deg)` }}
						/>
					) : (
						<CloseIcon
							onClick={(e) => {
								e.stopPropagation();
								setMaxLayovers(3);
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
						<span>Layovers</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					<RadioGroup
						onChange={(e) => setMaxLayovers(Number(e.target.value))}
						value={maxLayovers}
					>
						<FormControlLabel
							control={<Radio />}
							label="Any number of layovers"
							value={3}
						/>
						<FormControlLabel
							control={<Radio />}
							label="No layovers"
							value={0}
						/>
						<FormControlLabel
							control={<Radio />}
							label="1 layover or fewer"
							value={1}
						/>
						<FormControlLabel
							control={<Radio />}
							label="2 layovers or fewer"
							value={2}
						/>
					</RadioGroup>
					<div className="options">
						<Button
							disabled={maxLayovers === 3}
							disableRipple
							onClick={() => setMaxLayovers(3)}
						>
							Clear
						</Button>
					</div>
				</div>
			</Popover>
		</div>
	);
}
