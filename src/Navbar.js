import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Donation from "./Donation";
import "./Navbar.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

export default function Navbar() {
	const [donateDialog, setDonateDialog] = useState(false);

	return (
		<header>
			<nav>
				<Link to={useLocation().pathname === "/about" ? "/" : "/about"}>
					{useLocation().pathname === "/about" ? "Home" : "About"}
				</Link>
				<a onClick={() => setDonateDialog(true)}>Donate</a>
				<a href="mailto:contact@railforless.us">Contact</a>
				<a
					href={`https://github.com/tikkisean/rail-for-less${
						process.env.REACT_APP_API_DOMAIN.includes("dev") ? "/tree/dev" : ""
					}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					<GitHubIcon />
				</a>
			</nav>
			<Dialog onClose={() => setDonateDialog(false)} open={donateDialog}>
				<DialogContent sx={{ minWidth: "600px !important" }}>
					<Donation defaultExpanded={true} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDonateDialog(false)}>Close</Button>
				</DialogActions>
			</Dialog>
		</header>
	);
}
