import "./About.css";

export default function About() {
	return (
		<div className="main-container fade-in-translate" id="about-container">
			<div className="section-container">
				<h1>Our mission</h1>
				<p>
					RailForLess.us was created to modernize the Amtrak booking
					experience--matching competitors in other transportation sectors like
					Google Flights. With increasing investment in passenger rail and a
					growing desire for more climate-friendly transportation solutions the
					need for a modern Amtrak booking service is greater now than ever
					before. Policy and infrastructure can only go so far--every aspect of
					train travel must match the convenience of driving or flying for
					widespread adoption, including the booking process. There's no silver
					bullet to bringing American rail travel to world-class standards, but
					we're doing our part to make the experience more accessible to
					everyone.
				</p>
			</div>
			<div className="section-container">
				<h1>History</h1>
				<p>
					There has always been a need for a better Amtrak booking app. As early
					as 2010, Paul Marlin created AmSnag--a simple webpage which returned
					fare information across a given date range. While simple in premise,
					this service became invaluable to frequent travelers searching for
					cheap fares. At the time Amtrak did not display more than a single
					day's fares at a time; comparing travel options was a tedious process
					of iterating one-by-one through single-day requests. Unbelievably,
					more than a decade since AmSnag's inception Amtrak has not improved
					this experience, and in many ways has actively hindered the
					functionality of their site by removing key features over the years.
				</p>
				<p>
					Ultimately, AmSnag's scraping technology was rendered useless by
					changing web development technologies sometime in the mid-2010s. In
					2022 RailForLess.us was created by Sean Eddy--a college student
					looking to build a new ambitious web app. Surprisingly, just matching
					the functionality provided by AmSnag 12 years earlier was a
					significant challenge. At the time of AmSnag's creation the web was a
					simpler place; scraping the content of a webpage was as simple as
					making an HTTP request and examining the returned HTML. Now, the
					modern web relies heavily on client-side rendering where UI elements
					and information are rendered through a complex process of executing
					JavaScript code and fetching content from other servers. Scraping
					amtrak.com in 2022 would require a fundamentally different approach
					than the strategies that worked a decade ago.
				</p>
				<p>
					For a while, development was slowed by circumventing reCAPTCHA, an
					embedded tool created to detect and deny access to any suspected
					automated activity. Eventually these issues were mostly overcome and
					RailForLess.us was live and functioning--yet it still couldn't match
					the speed nor utility of a service made a decade prior. The scraping
					process was slow and vulnerable to constant UI changes which broke the
					site.
				</p>
				<p>
					The current state of RailForLess.us is the result of a collaboration
					between Sean Eddy and Riley Nielsen--another college student working
					to build a similar solution around the same time. Riley had developed
					a complex scraping methodology which drastically improved the speed,
					practicality, and scalability of the service. Since Fall 2023, Sean
					and Riley have worked tirelessly to redesign the site from the ground
					up in their spare time as students.
				</p>
			</div>
			<div className="section-container">
				<h1>Meet the developers</h1>
				<div id="meet-the-devs-container">
					<div>
						<figure>
							<img alt="Sean Eddy" src="/images/sean-headshot.png" />
							<figcaption>Sean Eddy</figcaption>
							<figcaption>UI/UX Designer</figcaption>
						</figure>
						<p>
							Sean is a graduate student at the University of Arizona studying
							Computer Science. He enjoys exploring the Sonoran Desert on his
							bike, trying Tucson's Mexican restaurants, and designing Lego
							models. Learn more about him and his projects at{" "}
							<a href="https://seaneddy.com" rel="noreferrer" target="_blank">
								seaneddy.com
							</a>
							.
						</p>
					</div>
					<div>
						<figure>
							<img alt="Riley Nielsen" src="/images/riley-headshot.jpg" />
							<figcaption>Riley Nielsen</figcaption>
							<figcaption>Backend Engineer</figcaption>
						</figure>
						<p>
							Riley is a software engineer from Minnesota. He enjoys reading,
							riding his Onewheel, travel, and creating films in his spare time.
							Trains and using technology to help others are passions of his.
							Learn more about him and his projects at{" "}
							<a
								href="https://rileynielsen.com"
								rel="noreferrer"
								target="_blank"
							>
								rileynielsen.com
							</a>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
