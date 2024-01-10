import { useState } from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function TripTypeSelect({ value, setValue }) {
	const [selected, setSelected] = useState(false);

	return (
		<Select
			className={`select ${!selected ? "not-" : ""}selected`}
			disableUnderline
			onChange={(e) => setValue(e.target.value)}
			onClose={() => setSelected(false)}
			onOpen={() => setSelected(true)}
			value={value}
			variant="standard"
		>
			<MenuItem key="round-trip" value="round-trip">
				<div
					style={{
						alignItems: "center",
						display: "flex",
						gap: "0.5rem",
					}}
				>
					<SyncAltIcon />
					<div>Round trip</div>
				</div>
			</MenuItem>
			<MenuItem key="one-way" value="one-way">
				<div style={{ alignItems: "center", display: "flex", gap: "1rem" }}>
					<ArrowRightAltIcon />
					<div>One way</div>
				</div>
			</MenuItem>
		</Select>
	);
}
