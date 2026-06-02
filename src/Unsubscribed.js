import { Link } from "react-router-dom";
import "./Alerts.css";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Button from "@mui/material/Button";

export default function Unsubscribed() {
	return (
		<div className="main-container fade-in-translate" id="alerts-container">
			<div className="section-container" id="alerts-success">
				<NotificationsOffIcon id="alerts-success-icon" />
				<h1>You've been unsubscribed</h1>
				<p>Sorry to see you go. You won't receive any more price alerts.</p>
				<div id="alerts-unsubscribed-actions">
					<Button component={Link} to="/" variant="outlined">
						Back to home
					</Button>
					<Button
						component={Link}
						endIcon={<NotificationsActiveIcon />}
						to="/alerts"
						variant="contained"
					>
						Resubscribe
					</Button>
				</div>
			</div>
		</div>
	);
}
