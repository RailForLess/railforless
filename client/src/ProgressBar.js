import React, { useEffect, useState } from "react";
import "./ProgressBar.css";

export default function ProgressBar({ progress }) {
	const [barWidth, setBarWidth] = useState(0);
	const [transition, setTransition] = useState(false);

	useEffect(() => {
		if (progress.time) {
			setBarWidth(100);
			setTimeout(() => {
				setTransition(true);
				setBarWidth(0);
				setTimeout(() => {
					setTransition(false);
				}, 100);
			}, 100);
		}
	}, [progress]);

	return (
		<div id="progress-bar-container">
			<div
				id="progress-bar"
				style={{
					width: barWidth + "%",
					transition:
						barWidth === 0 && transition
							? `width ${progress.time}s linear`
							: "width 0s",
				}}
			></div>
		</div>
	);
}
