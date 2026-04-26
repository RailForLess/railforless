import { useState } from "react";
import "./Settings.css";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Switch from "@mui/material/Switch";

export default function FaresSettings({
	usePoints,
	setUsePoints,
	showTimes,
	setShowTimes,
}) {
	const [anchor, setAnchor] = useState(null);

	return (
		<div>
			<IconButton
				disableRipple
				id="settings-button"
				onClick={(e) => setAnchor(e.currentTarget)}
			>
				<SettingsIcon />
			</IconButton>
			<Menu
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				onClose={() => {
					setAnchor(null);
				}}
				open={Boolean(anchor)}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<div id="settings-popover">
					<div className="settings-row">
						<span>Use points</span>
						<Switch
							checked={usePoints}
							onChange={() => setUsePoints(!usePoints)}
						/>
					</div>
					<div className="settings-row">
						<span>Show times</span>
						<Switch
							checked={showTimes}
							onChange={() => setShowTimes(!showTimes)}
						/>
					</div>
				</div>
			</Menu>
		</div>
	);
}
