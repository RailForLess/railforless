import { useState } from "react";
import "./Refresh.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

export default function Refresh({ update }) {
	const [degrees, setDegrees] = useState(0);

	function handleClick() {
		setDegrees(degrees + 360);
		update();
	}

	return (
		<FontAwesomeIcon
			icon={faRefresh}
			onClick={handleClick}
			size="lg"
			style={{ transform: `rotate(${degrees}deg)` }}
		/>
	);
}
