import React from "react";
import "./UpdateBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function UpdateBar({ setUpdateBarClose }) {
	return (
		<div id="update-bar-container">
			<p id="update-bar">
				Major feature update!{" "}
				<span
					onClick={() =>
						alert(
							"What's new:\n\t• Filter by route for station pairs served by multiple routes\n\t• Filter by time of day\n\t• Enter traveler information like quantity and type\n\t• Auto Train fares now available\n\nOther fixes:\n\t• Faster scraping input\n\t• Faster load time for recent searches"
						)
					}
				>
					Read more
				</span>
			</p>
			<FontAwesomeIcon
				icon={faXmark}
				onClick={() => setUpdateBarClose(true)}
				size="lg"
			/>
		</div>
	);
}
