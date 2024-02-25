import "./UpdateBar.css";
import CloseIcon from "@mui/icons-material/Close";

export default function UpdateBar({ setUpdateBarClose }) {
	function announceUpdate() {
		/*
		getDialog(
			"November 7th, 2023<br><br>I'm excited to announce a complete redesign of railforless.us to address the ongoing CAPTCHA issues is well underway. With the help of another developer we are perfecting a faster, more reliable, more comprehensive method of scraping Amtrak fares. Accompanying these backend changes will be a new UI to improve functionality and better showcase the new data. We're trying our best to push this update as soon as possible. As always, direct any questions or suggestions to <a href=`mailto:sean@railforless.us`>sean@railforless.us</a>.<br><br><hr><br>October 2nd, 2023<br><br>As many of you have come to learn, the site has had a lot of trouble recently scraping data from amtrak.com. This is not a bug in my code&#8212;amtrak.com uses <a href='https://cloud.google.com/recaptcha-enterprise' rel='noopener noreferrer' target='_blank'>reCAPTCHA Enterprise</a> to prevent bots from scraping the site. This software uses machine learning to learn user interaction patterns and block suspected bot activity. A couple weeks ago, something about the algorithm changed such that most requests were blocked. Since then, I have tried everything in my power to circumvent the CAPTCHA, but in time the algorithm always adapts to the new scraping behavior. For the forseeable future, <span>I strongly recommend using the site in the early morning or late evening hours as this seems to be when the CAPTCHA is least restrictive</span>. I will continue to explore new ways to scrape fare data; I have received lots of useful suggestions. Despite these recent challenges, I have implemented a number of new features and improvements:<br><br><ul><li>Search by hour</li><li>New dialog boxes</li><li>New hero images</li><li>Form optimizations for Acela</li><li>Added estimated wait time</li><li>Doubled CPU capacity</li><li>Switched to static residential proxies</li></ul><br>As always, feel free to contact me at <a href=`mailto:sean@railforless.us`>sean@railforless.us</a> with any questions or suggestions. Happy scraping!",
			"announce"
		);
		*/
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
				The future of railforless.us{" "}
				<span onClick={announceUpdate}>Read more</span>
			</p>
			<CloseIcon onClick={() => setUpdateBarClose(true)} />
		</div>
	);
}
