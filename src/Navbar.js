import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Navbar() {
	return (
		<header>
			<nav>
				<Link to={useLocation().pathname === "/" ? "/about" : "/"}>
					{useLocation().pathname === "/" ? "About" : "Home"}
				</Link>
				<a
					href="https://www.buymeacoffee.com/seaneddy"
					rel="noopener noreferrer"
					target="_blank"
				>
					Donate
				</a>
				<a href="mailto:sean@railforless.us">Contact</a>
				<a
					href="https://github.com/tikkisean/rail-for-less"
					rel="noopener noreferrer"
					target="_blank"
				>
					<GitHubIcon />
				</a>
			</nav>
		</header>
	);
}
