import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function RouteSelect({ value, setValue, mutualRoutes }) {
	const [selected, setSelected] = useState(false);

	return (
		<Select
			className={`select ${!selected ? "not-" : ""}selected`}
			disableUnderline
			onChange={(e) => setValue(e.target.value)}
			onClose={() => setSelected(false)}
			onOpen={() => setSelected(true)}
			value={value}
			variant="outlined"
		>
			{mutualRoutes.map((route) => (
				<MenuItem key={route} value={route}>
					{route.replace(/-/g, " ").replace(/_/g, "/")}
				</MenuItem>
			))}
		</Select>
	);
}
