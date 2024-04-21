import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";

export default function Duration({ maxDuration, setMaxDuration }) {
	const [anchor, setAnchor] = useState(null);

	return (
		<div className={`filter-${maxDuration === 100 ? "not-" : ""}selected`}>
			<Button
				className={`filter-button select ${
					!anchor && maxDuration === 100 ? "not-" : ""
				}selected`}
				disableRipple
				endIcon={
					maxDuration === 100 ? (
						<ArrowDropDownIcon
							sx={{ transform: `rotate(${Boolean(anchor) ? 180 : 0}deg)` }}
						/>
					) : (
						<CloseIcon
							onClick={(e) => {
								e.stopPropagation();
								setMaxDuration(100);
							}}
							fontSize="small"
						/>
					)
				}
				onClick={(e) => setAnchor(e.currentTarget)}
				variant="outlined"
			>
				{maxDuration === 100 ? "Duration" : `under ${maxDuration} hr`}
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
						<span>Duration</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					<div className="slider-container">
						<span>
							{maxDuration === 100 ? "Any duration" : `under ${maxDuration} hr`}
						</span>
						<Slider
							max={100}
							onChange={(e, newMaxDuration) => setMaxDuration(newMaxDuration)}
							value={maxDuration}
							valueLabelDisplay="auto"
							valueLabelFormat={(value) => `${value} hr`}
						/>
					</div>
					<div className="options">
						<Button
							disabled={maxDuration === 100}
							disableRipple
							onClick={() => setMaxDuration(100)}
						>
							Clear
						</Button>
					</div>
				</div>
			</Popover>
		</div>
	);
}
