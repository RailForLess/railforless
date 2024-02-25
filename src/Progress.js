import { useEffect } from "react";
import AnimatedNumbers from "react-animated-numbers";
import "./Progress.css";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import LinearProgress from "@mui/material/LinearProgress";

export default function Progress({
	progressPercent,
	progressText,
	searchError,
}) {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (
				mutation.addedNodes.length > 0 &&
				mutation.addedNodes[0].id !== "percent"
			) {
				document
					.querySelector("#progress-container span div")
					.appendChild(document.getElementById("percent"));
			}
		}
	});

	useEffect(() => {
		setTimeout(() => {
			const digits = document.querySelector(
				"#progress-container span > div > div"
			);
			digits.style.display = "flex";
			digits.style.flexDirection = "column";
			digits.style.alignItems = "flex-end";
			const digitsContainer = digits.parentElement;
			const percent = document.createElement("div");
			percent.style.fontSize = "7rem";
			percent.style.height = digitsContainer.lastChild.style.height;
			percent.id = "percent";
			percent.innerHTML = "%";
			digitsContainer.appendChild(percent);
			observer.observe(digitsContainer, { childList: true });
		}, 100);
	}, []);

	return (
		<div id="progress-container">
			<div>
				<div>
					{!searchError ? (
						<AnimatedNumbers
							animateToNumber={progressPercent.toFixed(2) * 100}
							fontStyle={{ fontSize: "7rem" }}
							transitions={() => ({
								type: "spring",
								duration: 0.5,
							})}
						/>
					) : (
						<RailwayAlertIcon />
					)}
					<span id="progress-text">{progressText}</span>
					{!searchError && (
						<LinearProgress
							id="progress-bar"
							variant={
								progressText.includes("...") ? "indeterminate" : "determinate"
							}
							value={progressPercent.toFixed(2) * 100}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
