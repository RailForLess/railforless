import { useRef, useState } from "react";
import "./Share.css";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";

export default function Share({
	origin,
	destination,
	dateRangeStart,
	dateRangeEnd,
	roundTrip,
}) {
	const linkRef = useRef(null);
	const [copy, setCopy] = useState(false);
	const [search, setSearch] = useState(false);

	const domain = process.env.REACT_APP_API_DOMAIN.replace("api.", "");
	const match = window.location.href.match(/\/(cached\/.*)/);
	const link = match
		? !search
			? `${domain}/${match[1]}`
			: `${domain}/search/${origin.code}-${
					destination.code
			  }_${dateRangeStart.format("M/D/YY")}-${dateRangeEnd.format("M/D/YY")}${
					!roundTrip ? "_oneWay" : ""
			  }`
		: "";

	const [anchor, setAnchor] = useState(null);

	function handleCopy() {
		navigator.clipboard.writeText(link);
		setCopy(true);
		linkRef.current.select();
	}

	return (
		<div>
			<Button
				endIcon={<ShareIcon />}
				onClick={(e) => setAnchor(e.currentTarget)}
				variant="contained"
			>
				Share
			</Button>
			<Dialog fullWidth open={Boolean(anchor)} onClose={() => setAnchor(null)}>
				<div id="share-container">
					<div>
						<span>Share</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					<TextField
						autoFocus={true}
						fullWidth
						InputProps={{
							endAdornment: (
								<Button disableRipple onClick={handleCopy} variant="contained">
									Copy
								</Button>
							),
						}}
						inputRef={linkRef}
						value={link}
					/>
					<Divider />
					<FormControlLabel
						control={
							<Checkbox checked={search} onChange={() => setSearch(!search)} />
						}
						label="Run new search"
					/>
				</div>
			</Dialog>
			<Snackbar
				autoHideDuration={5000}
				onClose={() => setCopy(false)}
				message="Link copied to clipboard"
				open={copy}
			/>
		</div>
	);
}
