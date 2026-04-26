import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import CheckboxRow from "./CheckboxRow";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

export default function Days({
	outboundDays,
	setOutboundDays,
	returnDays,
	setReturnDays,
	roundTrip,
}) {
	function isClear() {
		return (
			Object.keys(outboundDays)
				.filter((day) => !outboundDays[day])
				.map((day) => Number(day)).length === 0 &&
			Object.keys(returnDays)
				.filter((day) => !returnDays[day])
				.map((day) => Number(day)).length === 0
		);
	}

	function clear() {
		setOutboundDays(
			Object.keys(outboundDays).reduce((a, b) => ({ ...a, [b]: true }), {})
		);
		setReturnDays(
			Object.keys(returnDays).reduce((a, b) => ({ ...a, [b]: true }), {})
		);
	}
	const isDisabled = isClear();

	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const [tab, setTab] = useState(0);

	const [anchor, setAnchor] = useState(null);

	return (
		<div className={`filter-${isDisabled ? "not-" : ""}selected`}>
			<Button
				className={`filter-button select ${
					!anchor && isDisabled ? "not-" : ""
				}selected`}
				disableRipple
				endIcon={
					isDisabled ? (
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
				Days
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
					{roundTrip && (
						<Tabs
							value={tab}
							onChange={(e, newTab) => setTab(newTab)}
							sx={{ paddingBottom: "0.5rem" }}
						>
							<Tab label="Outbound" />
							<Tab label="Return" />
						</Tabs>
					)}
					{!roundTrip || (roundTrip && tab === 0) ? (
						<div>
							{Object.keys(outboundDays).map((day) => (
								<CheckboxRow
									key={`outbound-days-${day}`}
									values={outboundDays}
									setValues={setOutboundDays}
									value={day}
									label={dayNames[Number(day)]}
								/>
							))}
						</div>
					) : (
						<div>
							{Object.keys(returnDays).map((day) => (
								<CheckboxRow
									key={`return-days-${day}`}
									values={returnDays}
									setValues={setReturnDays}
									value={day}
									label={dayNames[Number(day)]}
								/>
							))}
						</div>
					)}
					<div className="options">
						<Button disabled={isDisabled} disableRipple onClick={clear}>
							Clear
						</Button>
					</div>
				</div>
			</Popover>
		</div>
	);
}
