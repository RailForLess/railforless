import "./Navbar.css";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Navbar() {
	return (
		<header>
			<nav>
				<a href={`/${!document.URL.includes("about") ? "about" : ""}`}>
					{!document.URL.includes("about") ? "About" : "Home"}
				</a>
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
