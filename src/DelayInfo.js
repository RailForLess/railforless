import { useState } from "react";
import "./DelayInfo.css";
import HistoryIcon from "@mui/icons-material/History";
import Popover from "@mui/material/Popover";

export default function DelayInfo({ isDept, leg }) {
	const [anchor, setAnchor] = useState(null);
	const open = Boolean(anchor);
	const station = isDept ? leg.origin : leg.destination;
	const time = isDept ? leg.departureDateTime : leg.arrivalDateTime;
	const color =
		station.avgDelay < 15
			? "rgb(129, 201, 149)"
			: station.avgDelay < 30
			? "rgb(255, 196, 0)"
			: "indianred";

	return (
		<div className="delay-icon-container">
			<HistoryIcon
				onMouseEnter={(e) => setAnchor(e.currentTarget)}
				onMouseLeave={() => setAnchor(null)}
				sx={{
					color,
				}}
			/>
			<Popover
				anchorEl={anchor}
				anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
				onClose={() => setAnchor(null)}
				open={open}
				sx={{
					pointerEvents: "none",
				}}
				transformOrigin={{ horizontal: "left", vertical: "top" }}
			>
				<div className="delay-info-container">
					<div>
						<span>{`${leg.trainId} ${leg.route}`}</span>
						<span style={{ color: "#9aa0a6" }}>{` usually ${
							isDept ? "departs" : "arrives"
						} around `}</span>
						<span>{time.add(station.avgDelay, "m").format("h:mm A")}</span>
						<span
							style={{
								color,
							}}
						>
							{station.avgDelay === 0
								? " (on time)"
								: ` (${Math.abs(station.avgDelay)} min ${
										station.avgDelay > 0 ? "late" : "early"
								  })`}
						</span>
						<span style={{ color: "#9aa0a6" }}>{` ${
							isDept ? "from" : "to"
						} `}</span>
						<span>{`${station.name}`}</span>
					</div>
					<div>Data courtesy of ASMAD</div>
				</div>
			</Popover>
		</div>
	);
}
