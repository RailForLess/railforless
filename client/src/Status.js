import React from "react";
import "./Status.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

export default function Status({ status, updateStatus }) {
	return (
		<div id="status">
			<h3>{status ? "Ready" : "In use"}</h3>
			<img
				alt=""
				src={`./images/${status ? "status-true" : "status-false"}.png`}
			/>
			<FontAwesomeIcon
				className="refresh"
				icon={faRefresh}
				onClick={updateStatus}
				size="lg"
			/>
		</div>
	);
}
