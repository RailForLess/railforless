import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import PedalBikeIcon from "@mui/icons-material/PedalBike";
import PetsIcon from "@mui/icons-material/Pets";
import SportsGolfIcon from "@mui/icons-material/SportsGolf";

export default function AddItems({ addItems, setAddItems }) {
	const includedAddItems = Object.keys(addItems).filter(
		(addItem) => addItems[addItem]
	);
	const string =
		includedAddItems.length > 1
			? `${includedAddItems[0]} +${includedAddItems.length - 1}`
			: includedAddItems.length === 1
			? includedAddItems[0]
			: "Add-ons";

	function clear() {
		setAddItems(
			Object.keys(addItems).reduce((a, b) => ({ ...a, [b]: false }), {})
		);
	}

	const getAddItemIcon = (addItem) =>
		addItem === "Bicycle" ? (
			<PedalBikeIcon fontSize="small" />
		) : addItem === "Pet" ? (
			<PetsIcon fontSize="small" />
		) : (
			<SportsGolfIcon fontSize="small" />
		);

	const [anchor, setAnchor] = useState(null);

	return (
		<div
			className={`filter-${
				includedAddItems.length === 0 ? "not-" : ""
			}selected`}
		>
			<Button
				className={`filter-button select ${
					!anchor && includedAddItems.length === 0 ? "not-" : ""
				}selected`}
				disableRipple
				endIcon={
					includedAddItems.length === 0 ? (
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
						<span>Add-ons</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					{Object.keys(addItems).map((addItem) => (
						<FormControlLabel
							control={
								<Checkbox
									checked={addItems[addItem]}
									defaultChecked
									onChange={(e) =>
										setAddItems({ ...addItems, [addItem]: e.target.checked })
									}
								/>
							}
							label={
								<div className="checkbox-label">
									{getAddItemIcon(addItem)}
									{addItem.replaceAll("-", " ").replace("_", "/")}
								</div>
							}
						/>
					))}
					<div className="options">
						<Button
							disabled={includedAddItems.length === 0}
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
