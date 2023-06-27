import React from "react";
import "./UpdateBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function UpdateBar({ setUpdateBarClose }) {
	return (
		<div id="update-bar-container">
			<p id="update-bar">
				6/27/2023 - Fixed sold out rooms bug causing premature search
				termination
			</p>
			<FontAwesomeIcon
				icon={faXmark}
				onClick={() => setUpdateBarClose(true)}
				size="lg"
			/>
		</div>
	);
}
