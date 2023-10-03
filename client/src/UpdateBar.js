import React from "react";
import { getDialog } from "./Dialog";
import "./UpdateBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function UpdateBar({ setUpdateBarClose }) {
	function announceUpdate() {
		getDialog(
			"October 2nd, 2023<br><br>As many of you have come to learn, the site has had a lot of trouble recently scraping data from amtrak.com. This is not a bug in my code&#8212;amtrak.com uses <a href='https://cloud.google.com/recaptcha-enterprise' rel='noopener noreferrer' target='_blank'>reCAPTCHA Enterprise</a> to prevent bots from scraping the site. This software uses machine learning to learn user interaction patterns and block suspected bot activity. A couple weeks ago, something about the algorithm changed such that most requests were blocked. Since then, I have tried everything in my power to circumvent the CAPTCHA, but in time the algorithm always adapts to the new scraping behavior. For the forseeable future, <span>I strongly recommend using the site in the early morning or late evening hours as this seems to be when the CAPTCHA is least restrictive</span>. I will continue to explore new ways to scrape fare data; I have received lots of useful suggestions. Despite these recent challenges, I have implemented a number of new features and improvements:<br><br><ul><li>Search by hour</li><li>New dialog boxes</li><li>New hero images</li><li>Form optimizations for Acela</li><li>Added estimated wait time</li><li>Doubled CPU capacity</li><li>Switched to static residential proxies</li></ul><br>As always, feel free to contact me at <a href=`mailto:sean@railforless.us`>sean@railforless.us</a> with any questions or suggestions. Happy scraping!",
			"announce"
		);
	}

	const dialogRoot = document.createElement("div");
	dialogRoot.id = "dialog-root";
	document.body.appendChild(dialogRoot);

	if (localStorage.getItem("hasSeenUpdate") !== "true") {
		announceUpdate();
		localStorage.setItem("hasSeenUpdate", "true");
	}

	return (
		<div id="update-bar-container">
			<p id="update-bar">
				Important service update <span onClick={announceUpdate}>Read more</span>
			</p>
			<FontAwesomeIcon
				icon={faXmark}
				onClick={() => setUpdateBarClose(true)}
				size="lg"
			/>
		</div>
	);
}
