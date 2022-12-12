import React from "react";
import "./About.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

export default function About() {
	return (
		<div id="about-container">
			<div className="section-container">
				<h1>Background</h1>
				<p>
					I created this site because Amtrak makes the process of viewing fares
					over a period of time incredibly tedious. Unlike virtually every other
					major transportation company, Amtrak does not provide a calendar view
					of fares to compare prices across a range of dates. Online, you can
					find countless threads discussing this same limitation of Amtrak's
					website. This problem was the catalyst for Amsnag&mdash;a now defunct
					Amtrak scraping service. The service stopped working after Amtrak
					updated their website to the more complex, Javascript-heavy site it is
					today. My goal when developing this site was to restore as much of
					Amsnag's original functionality as possible.
				</p>
			</div>
			<div className="section-container">
				<h1>Development</h1>
				<p>
					In order to understand what made the development of this site so
					difficult, you need to understand how the internet has changed since
					the days of Amsnag. Websites used to be mostly-static pages with
					hardcoded HTML and CSS returned from an HTTP request. A service like
					Amsnag worked so well because information could be scraped simply by
					mimicking a browser with manual HTTP requests; all the information you
					needed was right there in the returned HTML.
				</p>
				<p>
					Now, the overwhelming majority of modern websites generate content
					dynamically (including this site). A simple HTTP request is no longer
					sufficient for scraping these heavy sites, as Javascript code must run
					asynchronously to load the page contents. Therefore, the only reliable
					way to navigate and scrape these websites is through a browser. I
					chose the browser automation package{" "}
					<a
						href="https://www.selenium.dev/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Selenium
					</a>{" "}
					for this project.
				</p>
				<p>
					I quickly learned why Amsnag had not yet been replaced&mdash;Amtrak
					utilizes an advanced bot-detection algorithm that makes automated fare
					scraping exceedingly difficult. In addition to the Javascript running
					to load the page, Amtrak runs code that monitors your mouse movements
					and interaction patterns to filter out suspected automated activity. I
					tried for weeks to get around this algorithm to no avail. No matter
					how random and human-like I programmed my script to act, with a large
					enough dataset Amtrak could successfully flag my activity as
					automated.
				</p>
				<figure>
					<img alt="" src="./images/reCAPTCHA.png" />
					<figcaption>
						A POST request to Google's{" "}
						<a
							href="https://cloud.google.com/recaptcha-enterprise"
							rel="noopener noreferrer"
							target="_blank"
						>
							reCAPTCHA Enterprise
						</a>{" "}
						on amtrak.com
					</figcaption>
				</figure>
				<p>
					I realized short of developing an AI-trained algorithm, there was no
					way to reliably scrape this data from Amtrak's site. I shifted focus
					from programming a human-like script to anonymizing my requests. This
					website exploits the weakness that Amtrak needs at least a few
					requests to develop a pattern of automated activity. Using a paid
					proxy service, I can mask the IP of incoming requests at a regular
					interval.{" "}
					<b>
						Running a real browser and funneling requests through a proxy slows
						down the scraping process considerably, but is the only way to get
						fares at scale without detection.
					</b>
				</p>
				<figure>
					<img alt="" src="./images/demo.gif" />
					<figcaption>Selenium web scraping on amtrak.com</figcaption>
				</figure>
			</div>
			<div className="section-container">
				<h1>About me</h1>
				<div id="about-me-container">
					<img alt="" src="/images/headshot.jpg" />
					<p>
						My name is{" "}
						<a
							href="https://seaneddy.com/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Sean Eddy
						</a>
						&mdash;I am currently a sophomore at the University of Arizona
						pursuing a B.S. and ultimately an M.S. in Computer Science with a
						minor in entrepreneurship and innovation.
						<br></br>
						<br></br>
						This project is my first dynamic website; reach out to me at{" "}
						<a href="mailto:sean@railforless.us">sean@railforless.us</a> to
						report any bugs or feature requests.<br></br>
						<br></br> Like the site? Donate on my{" "}
						<a
							href="https://www.buymeacoffee.com/seaneddy"
							rel="noopener noreferrer"
							target="_blank"
						>
							Buy Me a Coffee
						</a>{" "}
						page. Proxies, web hosting, and domain registration don't pay for
						themselves!
						<br></br>
						<br></br>
						Fellow nerd? Check out the source code on{" "}
						<a
							href="https://github.com/tikkisean/rail-for-less"
							rel="noopener noreferrer"
							target="_blank"
						>
							Github
						</a>
						.
					</p>
				</div>
			</div>
			<a href="/" id="back-button-container">
				<FontAwesomeIcon icon={faArrowLeftLong} size="lg" />
				<p>Take me back</p>
			</a>
		</div>
	);
}
