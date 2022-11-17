import React from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Navbar() {
	return (
		<header>
			<nav>
				<a href="/about">About</a>
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
					<FontAwesomeIcon icon={faGithub} size={"lg"} />
				</a>
			</nav>
		</header>
	);
}
