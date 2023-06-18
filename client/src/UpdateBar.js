import React from "react";
import "./UpdateBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function UpdateBar({ setUpdateBarClose }) {
	return (
		<div id="update-bar-container">
			<p id="update-bar">
				30-day searches now available from 7pm CST - 7am CST!
			</p>
			<FontAwesomeIcon
				icon={faXmark}
				onClick={() => setUpdateBarClose(true)}
				size="lg"
			/>
		</div>
	);
}
