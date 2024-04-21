import dayjs from "dayjs";
import Slider from "@mui/material/Slider";

export default function TimeSlider({ value, setValue, label }) {
	return (
		<div className="slider-container">
			<div>
				<span>{label}</span>
				<span className="dot">·</span>
				<span>
					{value[0] === 0 && value[1] === 24
						? "Anytime"
						: `${dayjs(`${value[0]}`, "H").format("h A")} - ${dayjs(
								`${value[1]}`,
								"H"
						  ).format("h A")}`}
				</span>
			</div>
			<Slider
				max={24}
				onChange={(e, newValue) => setValue(newValue)}
				value={value}
				valueLabelDisplay="auto"
				valueLabelFormat={(value) => dayjs(`${value}`, "H").format("h A")}
			/>
		</div>
	);
}
