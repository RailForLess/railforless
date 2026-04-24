import "./About.css";
import "./Legal.css";

export default function Terms() {
	return (
		<div className="main-container fade-in-translate" id="legal-container">
			<div className="section-container">
				<h1>Terms of Service</h1>
				<p>
					<em>Last updated: April 23, 2026</em>
				</p>
				<p>
					Welcome to RailForLess.us ("RailForLess," "we," "us," or "our").
					By accessing or using our website, services, or price drop alert
					notifications (collectively, the "Service"), you agree to be
					bound by these Terms of Service (the "Terms"). If you do not
					agree, do not use the Service.
				</p>
			</div>

			<div className="section-container">
				<h3>1. Description of Service</h3>
				<p>
					RailForLess.us is a free tool that helps users search for and
					compare Amtrak fares across multiple dates, routes, and
					accommodations. We also offer an optional price drop alert
					feature that notifies you by email, and where you opt in, by
					SMS text message, when fares fall below a threshold you set.
				</p>
				<p>
					The Service retrieves fare and schedule information from
					publicly available sources, including amtrak.com. We are not
					Amtrak and do not sell or process tickets. All bookings must be
					completed directly with Amtrak or an authorized reseller.
				</p>
			</div>

			<div className="section-container">
				<h3>2. No Affiliation with Amtrak</h3>
				<p>
					RailForLess.us is not affiliated, associated, authorized,
					endorsed by, or in any way officially connected with Amtrak
					(the National Railroad Passenger Corporation) or any of its
					subsidiaries or affiliates. All Amtrak names, marks, routes,
					and schedules are the property of their respective owners. The
					official Amtrak website is{" "}
					<a
						href="https://www.amtrak.com"
						rel="noopener noreferrer"
						target="_blank"
					>
						amtrak.com
					</a>
					.
				</p>
			</div>

			<div className="section-container">
				<h3>3. Eligibility</h3>
				<p>
					You must be at least 13 years old to use the Service. If you
					are under the age of majority in your jurisdiction, you may
					only use the Service with the involvement of a parent or legal
					guardian. By using the Service, you represent that you meet
					these requirements.
				</p>
			</div>

			<div className="section-container">
				<h3>4. Price Drop Alerts</h3>
				<p>
					To receive price drop alerts, you must provide a valid email
					address, and if you opt in to SMS alerts, a valid mobile phone
					number. You are responsible for keeping this contact
					information accurate and for ensuring you have the right to
					provide any number you submit. You may unsubscribe from email
					alerts at any time by using the unsubscribe link in any alert
					email, and you may opt out of SMS alerts by replying STOP.
				</p>
				<p>
					Message and data rates may apply to SMS alerts. Alert
					frequency varies based on market conditions. We do not
					guarantee delivery, timing, or accuracy of any alert, and we
					do not guarantee that fares will remain available at any
					observed price.
				</p>
			</div>

			<div className="section-container">
				<h3>5. Acceptable Use</h3>
				<p>
					You agree not to:
				</p>
				<ul>
					<li>
						Use the Service to violate any law or the rights of
						others, including Amtrak's terms of use;
					</li>
					<li>
						Scrape, mirror, resell, or commercially redistribute data
						obtained from the Service;
					</li>
					<li>
						Submit false, misleading, or third-party contact
						information, or create alerts for a person who has not
						consented;
					</li>
					<li>
						Interfere with, overload, or attempt to circumvent any
						security, rate-limiting, or bot-prevention measure
						(including Cloudflare Turnstile);
					</li>
					<li>
						Use automated means to access the Service except as
						expressly permitted; or
					</li>
					<li>
						Reverse engineer or attempt to derive source code from
						any portion of the Service that is not publicly licensed.
					</li>
				</ul>
			</div>

			<div className="section-container">
				<h3>6. No Warranty; Accuracy of Information</h3>
				<p>
					<strong>
						The Service is provided "as is" and "as available"
						without warranties of any kind, either express or
						implied.
					</strong>{" "}
					We make no representations or warranties about the accuracy,
					completeness, reliability, timeliness, or availability of any
					fare, schedule, route, station, delay, amenity, or other
					information displayed on the Service or sent in any alert.
				</p>
				<p>
					Fare and schedule data is sourced from third parties and may
					be outdated, incomplete, or incorrect. Prices and
					availability change constantly and are ultimately determined
					by Amtrak at the time of booking.{" "}
					<strong>
						You are solely responsible for verifying all details
						directly with Amtrak before making any travel decision
						or purchase.
					</strong>{" "}
					We are not responsible for any losses, missed connections,
					unavailable fares, denied boardings, or other damages
					resulting from reliance on information provided by the
					Service.
				</p>
				<p>
					To the fullest extent permitted by law, we disclaim all
					implied warranties, including merchantability, fitness for a
					particular purpose, non-infringement, and any warranties
					arising from course of dealing or usage of trade.
				</p>
			</div>

			<div className="section-container">
				<h3>7. Limitation of Liability</h3>
				<p>
					To the fullest extent permitted by law, in no event will
					RailForLess.us, its operators, contributors, or affiliates
					be liable for any indirect, incidental, special,
					consequential, exemplary, or punitive damages, or for any
					loss of profits, revenues, data, goodwill, or travel
					opportunity, arising out of or related to your use of (or
					inability to use) the Service, whether based in contract,
					tort, strict liability, or any other legal theory, even if
					we have been advised of the possibility of such damages.
				</p>
				<p>
					Our aggregate liability arising out of or related to the
					Service will not exceed one hundred U.S. dollars (US$100).
					Because the Service is provided free of charge, this
					allocation of risk is a fundamental basis of the bargain
					between you and us.
				</p>
			</div>

			<div className="section-container">
				<h3>8. Indemnification</h3>
				<p>
					You agree to defend, indemnify, and hold harmless
					RailForLess.us and its operators from and against any
					claims, liabilities, damages, losses, and expenses
					(including reasonable attorneys' fees) arising out of or
					related to your use of the Service, your violation of these
					Terms, or your violation of any rights of a third party,
					including any person whose contact information you submit
					to the Service.
				</p>
			</div>

			<div className="section-container">
				<h3>9. Third-Party Services</h3>
				<p>
					The Service relies on third-party providers, including but
					not limited to Cloudflare (for bot protection and
					infrastructure), our email delivery provider, our SMS
					delivery provider (if applicable), and analytics providers.
					Your use of the Service is also subject to the applicable
					terms of those providers. We are not responsible for the
					acts or omissions of any third party.
				</p>
			</div>

			<div className="section-container">
				<h3>10. Intellectual Property</h3>
				<p>
					The RailForLess.us name, logo, design, code, and original
					content are owned by us or our contributors and are
					protected by applicable law. Except as expressly permitted,
					you may not copy, modify, distribute, or create derivative
					works of the Service without our prior written consent.
					Third-party marks referenced on the Service (including
					Amtrak) remain the property of their respective owners.
				</p>
			</div>

			<div className="section-container">
				<h3>11. Termination</h3>
				<p>
					We may suspend or terminate your access to all or any part
					of the Service at any time, with or without notice, for any
					reason, including violation of these Terms. You may stop
					using the Service at any time. Sections that by their
					nature should survive termination (including Sections 6–10)
					will survive.
				</p>
			</div>

			<div className="section-container">
				<h3>12. Changes to the Terms</h3>
				<p>
					We may update these Terms from time to time. When we do, we
					will revise the "Last updated" date above. Material changes
					will be noted on the Service. Your continued use of the
					Service after changes take effect constitutes acceptance of
					the revised Terms.
				</p>
			</div>

			<div className="section-container">
				<h3>13. Governing Law and Disputes</h3>
				<p>
					These Terms are governed by the laws of the State of
					Minnesota, United States, without regard to conflict of
					laws principles. You agree that any dispute arising out of
					or relating to these Terms or the Service will be resolved
					exclusively in the state or federal courts located in
					Minnesota, and you consent to the personal jurisdiction of
					those courts.
				</p>
			</div>

			<div className="section-container">
				<h3>14. Contact</h3>
				<p>
					Questions about these Terms may be directed to{" "}
					<a href="mailto:support@railforless.us">
						support@railforless.us
					</a>
					.
				</p>
			</div>
		</div>
	);
}
