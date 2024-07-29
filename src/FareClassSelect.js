import { useEffect, useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

export default function FareClassSelect({
	value,
	setValue,
	values,
	strict,
	setStrict,
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
			renderValue={(value) =>
				strict && value !== "Any class" ? `${value} (strict)` : value
			}
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
			<Divider />
			<div style={{ alignItems: "center", display: "flex" }}>
				<Switch checked={strict} onChange={() => setStrict(!strict)} />
				<span>Strict filtering</span>
				<Tooltip
					arrow
					title="All legs must match selected accommodation, even when sold out or otherwise unavailable."
				>
					<IconButton size="small">
						<HelpIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</div>
		</Select>
	);
}
