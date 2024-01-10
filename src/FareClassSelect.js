import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function FareClassSelect({ value, setValue, searching }) {
	const [selected, setSelected] = useState(false);

	return (
		<Select
			className={`select ${!selected ? "not-" : ""}selected`}
			disableUnderline
			onChange={(e) => setValue(e.target.value)}
			onClose={() => setSelected(false)}
			onOpen={() => setSelected(true)}
			value={value}
			variant={!searching ? "standard" : "outlined"}
		>
			<MenuItem key="coach" value="coach">
				Coach
			</MenuItem>
			<MenuItem key="business" value="business">
				Business
			</MenuItem>
			<MenuItem key="first" value="first">
				First
			</MenuItem>
			<MenuItem key="sleeper" value="sleeper">
				Sleeper
			</MenuItem>
		</Select>
	);
}
