import React, { useEffect, useState } from "react";
import "./ProgressCrossing.css";

export default function ProgressCrossing() {
	const [frame, setFrame] = useState("up");

	function chooseFrame() {
		setFrame((frame) => {
			switch (frame) {
				case "up":
					return "transition";
				case "transition":
					return "down-right";
				default:
					return frame === "down-right" ? "down-left" : "down-right";
			}
		});
	}

	useEffect(() => {
		const interval = setInterval(() => chooseFrame(), 500);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return <img alt="" id="crossing" src={`./images/crossing-${frame}.png`} />;
}
