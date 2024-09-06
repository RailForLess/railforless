import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Navbar() {
	return (
		<header>
			<nav>
				<Link to={useLocation().pathname === "/about" ? "/" : "/about"}>
					{useLocation().pathname === "/about" ? "Home" : "About"}
				</Link>
				<a
					href="https://www.buymeacoffee.com/seaneddy"
					rel="noopener noreferrer"
					target="_blank"
				>
					Donate
				</a>
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
		</header>
	);
}
