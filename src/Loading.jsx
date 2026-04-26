import "./Loading.css";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
	return (
		<div id="loading-container">
			<CircularProgress size={60} />
			<span>Fetching fares...</span>
		</div>
	);
}
