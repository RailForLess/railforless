import React from "react";
import "./ProgressTrain.css";

export default function ProgressTrain({ progress }) {
	return (
		<img
			alt=""
			id="train"
			src="./images/progress-train.png"
			style={{
				left: `calc(-118vh + ${progress.percentComplete /
					100} * (118vh + 95vw))`,
			}}
		/>
	);
}
