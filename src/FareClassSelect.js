import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function FareClassSelect({
	value,
	setValue,
	values,
	searching,
}) {
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		if (!values.includes(value)) {
			setValue("Any class");
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
			variant={!searching ? "standard" : "outlined"}
		>
			{values.map((fareClass) => (
				<MenuItem key={fareClass} value={fareClass}>
					{fareClass.replace(/-/g, " ")}
				</MenuItem>
			))}
		</Select>
	);
}
