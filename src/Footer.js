import { useState } from "react";
import "./Footer.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function Footer() {
	const [open, setOpen] = useState(false);

	return (
		<footer>
			<span onClick={() => setOpen(true)}>Non-Affiliation Disclaimer</span>
			<Dialog id="disclaimer" onClose={() => setOpen(false)} open={open}>
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
					<Button onClick={() => setOpen(false)}>OK</Button>
				</DialogActions>
			</Dialog>
			<div className="vertical-bar"></div>
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
		</footer>
	);
}
