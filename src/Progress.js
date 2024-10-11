import { useEffect } from "react";
import AnimatedNumbers from "react-animated-numbers";
import "./Progress.css";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

export default function Progress({
	progressPercent,
	progressText,
	searchAnimationsBool,
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
							animateToNumber={Math.round(progressPercent * 100)}
							fontStyle={{ fontSize: "7rem" }}
							transitions={() => ({
								type: "spring",
								duration: searchAnimationsBool ? 0.5 : 0,
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
							value={Math.round(progressPercent * 100)}
						/>
					)}
					{progressText.includes("Turnstile") && (
						<Button
							endIcon={<RefreshIcon />}
							onClick={() => window.location.reload()}
							sx={{ marginTop: "1rem" }}
							variant="contained"
						>
							Reload page
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
