import { useState } from "react";
import TimeSlider from "./TimeSlider";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

export default function Times({
	outboundDeptTime,
	setOutboundDeptTime,
	outboundArrivalTime,
	setOutboundArrivalTime,
	returnDeptTime,
	setReturnDeptTime,
	returnArrivalTime,
	setReturnArrivalTime,
	tripType,
}) {
	function isClear() {
		return (
			outboundDeptTime[0] === 0 &&
			outboundDeptTime[1] === 24 &&
			outboundArrivalTime[0] === 0 &&
			outboundArrivalTime[1] === 24 &&
			returnDeptTime[0] === 0 &&
			returnDeptTime[1] === 24 &&
			returnArrivalTime[0] === 0 &&
			returnArrivalTime[1] === 24
		);
	}

	function clear() {
		setOutboundDeptTime([0, 24]);
		setOutboundArrivalTime([0, 24]);
		setReturnDeptTime([0, 24]);
		setReturnArrivalTime([0, 24]);
	}
	const isDisabled = isClear();

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
				Times
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
						<span>Times</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					{tripType === "round-trip" && (
						<Tabs value={tab} onChange={(e, newTab) => setTab(newTab)}>
							<Tab label="Outbound" />
							<Tab label="Return" />
						</Tabs>
					)}
					{tripType === "one-way" ||
					(tripType === "round-trip" && tab === 0) ? (
						<div>
							<TimeSlider
								value={outboundDeptTime}
								setValue={setOutboundDeptTime}
								label="Departure"
							></TimeSlider>
							<TimeSlider
								value={outboundArrivalTime}
								setValue={setOutboundArrivalTime}
								label="Arrival"
							></TimeSlider>
						</div>
					) : (
						<div>
							<TimeSlider
								value={returnDeptTime}
								setValue={setReturnDeptTime}
								label="Departure"
							></TimeSlider>
							<TimeSlider
								value={returnArrivalTime}
								setValue={setReturnArrivalTime}
								label="Arrival"
							></TimeSlider>
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
