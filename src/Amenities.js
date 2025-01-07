import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import AccessibleIcon from "@mui/icons-material/Accessible";
import ChairIcon from "@mui/icons-material/Chair";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LuggageIcon from "@mui/icons-material/Luggage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import TvIcon from "@mui/icons-material/Tv";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import WifiIcon from "@mui/icons-material/Wifi";

export default function Amenities({ amenities, setAmenities }) {
	const includedAmenities = Object.keys(amenities).filter(
		(amenity) => amenities[amenity]
	);
	const string =
		includedAmenities.length > 1
			? `${includedAmenities[0]} +${includedAmenities.length - 1}`
			: includedAmenities.length === 1
			? includedAmenities[0]
			: "Amenities";

	function clear() {
		setAmenities(
			Object.keys(amenities).reduce((a, b) => ({ ...a, [b]: false }), {})
		);
	}

	const getAmenityIcon = (amenity) =>
		amenity === "Cafe" ? (
			<LocalCafeIcon fontSize="small" />
		) : amenity === "Checked Baggage" ? (
			<LuggageIcon fontSize="small" />
		) : amenity === "Free WiFi" ? (
			<WifiIcon fontSize="small" />
		) : amenity === "Flexible Dining" ? (
			<TakeoutDiningIcon fontSize="small" />
		) : amenity === "Quiet Car" ? (
			<VolumeOffIcon fontSize="small" />
		) : amenity === "Seat Display" ? (
			<TvIcon fontSize="small" />
		) : amenity === "Seat Selection" ? (
			<ChairIcon fontSize="small" />
		) : amenity === "Traditional Dining" ? (
			<RestaurantIcon fontSize="small" />
		) : (
			<AccessibleIcon fontSize="small" />
		);

	const [anchor, setAnchor] = useState(null);

	return (
		<div
			className={`filter-${
				includedAmenities.length === 0 ? "not-" : ""
			}selected`}
		>
			<Button
				className={`filter-button select ${
					!anchor && includedAmenities.length === 0 ? "not-" : ""
				}selected`}
				disableRipple
				endIcon={
					includedAmenities.length === 0 ? (
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
						<span>Amenities</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					{Object.keys(amenities).map((amenity) => (
						<FormControlLabel
							control={
								<Checkbox
									checked={amenities[amenity]}
									onChange={(e) =>
										setAmenities({ ...amenities, [amenity]: e.target.checked })
									}
								/>
							}
							key={`amenity-${amenity}`}
							label={
								<div className="checkbox-label">
									{getAmenityIcon(amenity)}
									{amenity.replaceAll("-", " ").replace("_", "/")}
								</div>
							}
						/>
					))}
					<div className="options">
						<Button
							disabled={includedAmenities.length === 0}
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
