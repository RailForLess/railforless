import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import DoneIcon from "@mui/icons-material/Done";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function Footer() {
	const [status, setStatus] = useState(false);

	useEffect(() => {
		async function checkStatus() {
			setStatus((await fetch(`${process.env.REACT_APP_API_DOMAIN}/status`)).ok);
		}
		checkStatus();
	}, []);

	return (
		<footer>
			<Link to="/terms">Terms and Conditions</Link>
			<div className="vertical-bar" />
			<Link to="/privacy">Privacy Policy</Link>
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
