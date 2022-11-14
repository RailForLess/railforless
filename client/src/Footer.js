import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

export default function Footer({ imageIndex, imageInfo, setImageIndex }) {
	function handleUpdate() {
		let newImageIndex = imageIndex;
		while (newImageIndex === imageIndex) {
			newImageIndex = Math.floor(Math.random() * 5);
		}
		setImageIndex(newImageIndex);
	}

	return (
		<footer>
			<div>
				<FontAwesomeIcon
					className="refresh"
					icon={faRefresh}
					onClick={handleUpdate}
					size="lg"
				/>
				<h3>
					Photo by{" "}
					<a
						href={imageInfo[imageIndex].authorLink}
						rel="noopener noreferrer"
						target="_blank"
					>
						{imageInfo[imageIndex].author}
					</a>{" "}
					| licensed{" "}
					<a
						href={imageInfo[imageIndex].licenseLink}
						rel="noopener noreferrer"
						target="_blank"
					>
						{imageInfo[imageIndex].license}
					</a>
				</h3>
			</div>
			<h3>RailForLess.us is not affiliated with Amtrak.</h3>
			<h3>
				Site by{" "}
				<a
					href="https://seaneddy.com/"
					rel="noopener noreferrer"
					target="_blank"
				>
					Sean Eddy
				</a>
			</h3>
		</footer>
	);
}
