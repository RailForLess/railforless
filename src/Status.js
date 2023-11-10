import React from "react";
import Refresh from "./Refresh";
import "./Status.css";

export default function Status({ status, updateStatus }) {
	const link = document.createElement("link"),
		oldLink = document.getElementById("dynamic-favicon");
	link.id = "dynamic-favicon";
	link.rel = "shortcut icon";
	link.href = `./images/${status ? "status-true" : "status-false"}.png`;
	if (oldLink) {
		document.head.removeChild(oldLink);
	}
	document.head.appendChild(link);

	document.title = "RailForLess.us | " + (status ? "Ready" : "Busy");

	return (
		<div id="status">
			<h3>{status ? "Ready" : "Busy"}</h3>
			<img
				alt=""
				src={`./images/${status ? "status-true" : "status-false"}.png`}
			/>
			<Refresh update={updateStatus} />
		</div>
	);
}
