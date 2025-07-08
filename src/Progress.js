import "./Progress.css";
import RailwayAlertIcon from "@mui/icons-material/RailwayAlert";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

export default function Progress({
	progressPercent,
	progressText,
	searchError,
}) {
	return (
		<div id="progress-container">
			<div>
				<div>
					{!searchError ? (
						<span id="progress-percent">{`${progressPercent}%`}</span>
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
							value={progressPercent}
						/>
					)}
					{progressText.includes("Turnstile") && (
						<Button
							endIcon={<RefreshIcon />}
							onClick={() => window.location.reload()}
							sx={{ marginTop: "1rem" }}
							variant="contained"
							data-rybbit-event="refresh"
						>
							Reload page
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
