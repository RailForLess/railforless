import { useState } from "react";
import "./UpdateBar.css";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

export default function UpdateBar() {
	const [open, setOpen] = useState(true);
	const [dialog, setDialog] = useState(false);

	return (
		<div>
			<div id="update-bar-container" style={{ display: open ? "" : "none" }}>
				<span id="update-bar">
					April 2024 Feature Update{" "}
					<span onClick={() => setDialog(true)}>Read more</span>
				</span>
				<IconButton onClick={() => setOpen(false)} size="small">
					<CloseIcon />
				</IconButton>
			</div>
			<Dialog onClose={() => setDialog(false)} open={dialog}>
				<DialogTitle>April 2024 Feature Update</DialogTitle>
				<IconButton
					onClick={() => setDialog(false)}
					sx={{ position: "absolute", right: "1rem", top: "1rem" }}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent>
					<DialogContentText>
						Hello railfans!<br></br>
						<br></br>Ever since we launched v2 last month we've been inundated
						with feature requests and bug fixes, and ever since then we've been
						working in our spare time to address these requests. This update
						adds significant functionality to the site, mostly through 8 new
						filters which enable comprehensive customization of the returned
						options. We've also patched various bugs, improved UI/UX, and added
						a few extra features along the way. Below is a list of all major
						changes:<br></br>
						<br></br>
						New features:
						<br></br>
						<ul>
							<li>Filter by route</li>
							<li>Filter by layovers</li>
							<li>Filter by price</li>
							<li>Filter by times</li>
							<li>Filter by days</li>
							<li>Filter by duration</li>
							<li>Filter by amenities</li>
							<li>Filter by add-ons</li>
							<li>Redesigned date picker</li>
							<li>Local transit connections</li>
							<li>Add-ons listed with amenities</li>
							<li>Redesigned reCAPTCHA error</li>
						</ul>
						<br></br>
						Bug fixes:<br></br>
						<ul>
							<li>UTC/local time conversion fixed</li>
							<li>Bus legs now render correctly</li>
						</ul>
						<br></br>
						Many of these changes were made directly in response to emails we
						received—don't hesitate to reach out with any suggestions at{" "}
						<a href="mailto:contact@railforless.us">contact@railforless.us</a>.
						If you found any of these changes useful, consider{" "}
						<a
							href="https://www.buymeacoffee.com/seaneddy"
							rel="noopener noreferrer"
							target="_blank"
						>
							donating
						</a>{" "}
						to help us cover operating costs and maintain the site.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialog(false)}>OK</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
