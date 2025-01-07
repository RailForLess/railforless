import { useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CheckboxRow({ values, setValues, value, label }) {
	const [isHover, setIsHover] = useState(false);

	return (
		<div
			className="routes-row"
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
		>
			<FormControlLabel
				control={
					<Checkbox
						checked={values[value]}
						onChange={(e) =>
							setValues({ ...values, [value]: e.target.checked })
						}
					/>
				}
				label={label}
			/>
			<Button
				onClick={() =>
					setValues(
						Object.keys(values).reduce(
							(a, b) => ({ ...a, [b]: b === value }),
							{}
						)
					)
				}
				sx={{ borderRadius: "20px", opacity: isHover ? 1 : 0 }}
			>
				Only
			</Button>
		</div>
	);
}
