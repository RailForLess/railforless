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
					July 2024 Feature Update{" "}
					<span onClick={() => setDialog(true)}>Read more</span>
				</span>
				<IconButton onClick={() => setOpen(false)} size="small">
					<CloseIcon />
				</IconButton>
			</div>
			<Dialog onClose={() => setDialog(false)} open={dialog}>
				<DialogTitle>Updates</DialogTitle>
				<IconButton
					onClick={() => setDialog(false)}
					sx={{ position: "absolute", right: "1rem", top: "1rem" }}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent>
					<DialogContentText>
						<h2>July 2024 Feature Update</h2>
						<br></br>
						This month we made a variety of small changes primarily in response
						to user feedback, please continue to let us know how we can improve.
						<br></br>
						<br></br>
						<ul>
							<li>Strict class/accommodation filtering</li>
							<li>Date range selector helper text and button</li>
							<li>Rephrasing of additional accommodations dialog</li>
							<li>Auto-renewing proxies for reduced downtime</li>
						</ul>
						<br></br>
						<hr></hr>
						<br></br>
						<h2>Borealis Trains Depart May 21</h2>
						<br></br>
						Amtrak{" "}
						<a
							href="https://media.amtrak.com/2024/05/introducing-amtrak-borealis-trains-with-expanded-service-between-st-paul-and-chicago-via-milwaukee/"
							rel="noopener noreferrer"
							target="_blank"
						>
							recently announced
						</a>{" "}
						the new{" "}
						<a
							href="https://www.amtrak.com/borealis-train"
							rel="noopener noreferrer"
							target="_blank"
						>
							Borealis
						</a>{" "}
						train between St. Paul–Minneapolis and Chicago, and we quickly
						updated our map and internal data structures accordingly. Hover over
						the Empire Builder route between St. Paul–Minneapolis and Chicago to
						see the new train and book today! The first Borealis trains depart
						May 21, 2024.
						<br></br>
						<br></br>
						<hr></hr>
						<br></br>
						<h2>April 2024 Feature Update</h2>
						<br></br>
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
