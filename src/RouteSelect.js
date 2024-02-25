import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function RouteSelect({ value, setValue, values }) {
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		if (!values.includes(value)) {
			setValue("Any-route");
		}
	}, [values]);

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
			{values.map((route) => (
				<MenuItem key={route} value={route}>
					{route.replace("-", " ").replace("_", "/")}
				</MenuItem>
			))}
		</Select>
	);
}
