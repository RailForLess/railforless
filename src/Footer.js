import { useEffect, useState } from "react";
import "./Footer.css";
import DoneIcon from "@mui/icons-material/Done";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Footer() {
	const [disclaimerOpen, setDisclaimerOpen] = useState(false);

	const [status, setStatus] = useState(false);

	useEffect(() => {
		async function checkStatus() {
			setStatus((await fetch(`${process.env.REACT_APP_API_DOMAIN}/status`)).ok);
		}
		checkStatus();
	}, []);

	return (
		<footer>
			<span onClick={() => setDisclaimerOpen(true)}>
				Non-Affiliation Disclaimer
			</span>
			<Dialog
				id="disclaimer"
				onClose={() => setDisclaimerOpen(false)}
				open={disclaimerOpen}
			>
				<DialogTitle>Non-Affiliation Disclaimer</DialogTitle>
				<DialogContent>
					<DialogContentText>
						We are not affiliated, associated, authorized, endorsed by, or in
						any way officially connected with Amtrak, or any of its subsidiaries
						or its affiliates. The official Amtrak website can be found at{" "}
						<a
							href="https://www.amtrak.com"
							rel="noopener noreferrer"
							target="_blank"
						>
							https://www.amtrak.com
						</a>
						.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDisclaimerOpen(false)}>OK</Button>
				</DialogActions>
			</Dialog>
			<div className="vertical-bar" />
			<span>
				Site by{" "}
				<a
					href="https://seaneddy.com"
					rel="noopener noreferrer"
					target="_blank"
				>
					Sean Eddy
				</a>{" "}
				and Riley Nielsen
			</span>
			<div className="vertical-bar" />
			<a
				href="https://status.railforless.us/"
				rel="noopener noreferrer"
				target="_blank"
			>
				{status ? "All systems operational" : "Service disruption"}
				{status ? (
					<DoneIcon sx={{ color: "rgb(129, 201, 149)" }} />
				) : (
					<WarningAmberIcon sx={{ color: "indianred" }} />
				)}
			</a>
		</footer>
	);
}
