import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";

export default function TimeSlider({ value, setValue, label }) {
	const [renderedValue, setRenderedValue] = useState(value);

	useEffect(() => {
		setRenderedValue(value);
	}, [value]);

	return (
		<div className="slider-container">
			<div>
				<span>{label}</span>
				<span className="dot">·</span>
				<span>
					{renderedValue[0] === 0 && renderedValue[1] === 24
						? "Anytime"
						: `${dayjs(`${renderedValue[0]}`, "H").format("h A")} - ${dayjs(
								`${renderedValue[1]}`,
								"H"
						  ).format("h A")}`}
				</span>
			</div>
			<Slider
				max={24}
				onChange={(e, newValue) => setRenderedValue(newValue)}
				onChangeCommitted={(e, newValue) => setValue(newValue)}
				value={renderedValue}
				valueLabelDisplay="auto"
				valueLabelFormat={(value) => dayjs(`${value}`, "H").format("h A")}
			/>
		</div>
	);
}
