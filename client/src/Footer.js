import React from "react";
import Refresh from "./Refresh";
import "./Footer.css";

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
				<Refresh update={handleUpdate} />
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
