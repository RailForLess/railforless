import { Link } from "react-router-dom";
import "./Alerts.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Button from "@mui/material/Button";

export default function Subscribed() {
	return (
		<div className="main-container fade-in-translate" id="alerts-container">
			<div className="section-container" id="alerts-success">
				<CheckCircleOutlineIcon
					id="alerts-success-icon"
					sx={{ color: "rgb(129, 201, 149)" }}
				/>
				<h1>You're all set</h1>
				<p>
					Your price alert is active. We'll email you as soon as fares drop
					below your threshold.
				</p>
				<Button component={Link} to="/" variant="outlined">
					Back to home
				</Button>
			</div>
		</div>
	);
}
