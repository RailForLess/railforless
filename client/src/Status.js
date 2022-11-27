import React from "react";
import Refresh from "./Refresh";
import "./Status.css";

export default function Status({ status, updateStatus }) {
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
