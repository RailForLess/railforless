import "./About.css";
import "./Legal.css";

export default function Privacy() {
	return (
		<div className="main-container fade-in-translate" id="legal-container">
			<div className="section-container">
				<h1>Privacy Policy</h1>
				<p>
					<em>Last updated: April 23, 2026</em>
				</p>
				<p>
					This Privacy Policy describes how RailForLess.us
					("RailForLess," "we," "us," or "our") collects, uses, and
					shares information when you use our website and services
					(the "Service"). By using the Service, you agree to the
					practices described here.
				</p>
			</div>

			<div className="section-container">
				<h3>1. Information We Collect</h3>
				<p>
					<strong>Information you provide for price drop alerts.</strong>{" "}
					When you create a price alert, we collect the email address
					you submit, and, if you opt in to SMS alerts, the mobile
					phone number you submit. We also store the alert parameters
					you choose, including origin and destination stations,
					accommodation type, price threshold, and date range.
				</p>
				<p>
					<strong>Search activity.</strong> When you use the fare
					search tool, we process the stations, dates, traveler
					types, and other search parameters you submit so we can
					return results. These searches are not linked to your
					identity unless you are also submitting them as part of an
					alert.
				</p>
				<p>
					<strong>Automatically collected information.</strong> Like
					most websites, we automatically receive certain technical
					information when you visit, including IP address,
					approximate location derived from IP, browser type and
					version, device type, referring page, and pages you view.
					We use this information to operate, secure, and improve
					the Service.
				</p>
				<p>
					<strong>Anti-abuse information.</strong> We use Cloudflare
					Turnstile to distinguish humans from automated traffic.
					Turnstile may collect device and network signals from your
					browser. See Cloudflare's privacy notices for details.
				</p>
				<p>
					<strong>Analytics.</strong> We use privacy-respecting
					analytics to understand aggregate usage of the Service
					(for example, which features are used). Analytics data is
					not used to identify individual users.
				</p>
				<p>
					We do <strong>not</strong> collect payment information. We
					do not sell tickets and do not process transactions.
				</p>
			</div>

			<div className="section-container">
				<h3>2. How We Use Information</h3>
				<ul>
					<li>
						To deliver the price drop alerts you request, including
						by email and, if you opt in, SMS;
					</li>
					<li>
						To verify your alert subscription and process
						unsubscribe or opt-out requests;
					</li>
					<li>
						To operate, maintain, monitor, secure, and improve the
						Service;
					</li>
					<li>
						To detect, investigate, and prevent fraud, abuse, and
						security incidents;
					</li>
					<li>
						To comply with legal obligations and enforce our
						Terms of Service.
					</li>
				</ul>
			</div>

			<div className="section-container">
				<h3>3. How We Share Information</h3>
				<p>
					We do <strong>not</strong> sell or rent your personal
					information. We share limited information with service
					providers who process it on our behalf, under contractual
					confidentiality obligations and only as needed to operate
					the Service. These include:
				</p>
				<ul>
					<li>
						<strong>Hosting and infrastructure</strong> (for
						example, our cloud hosting provider and Cloudflare);
					</li>
					<li>
						<strong>Email delivery</strong>, to send verification,
						alert, and unsubscribe emails;
					</li>
					<li>
						<strong>SMS delivery</strong>, if you opt in to SMS
						alerts, to send text messages to the phone number you
						provide;
					</li>
					<li>
						<strong>Bot protection</strong> (Cloudflare Turnstile);
					</li>
					<li>
						<strong>Analytics</strong>, in aggregated or
						pseudonymized form.
					</li>
				</ul>
				<p>
					We may also disclose information (a) to comply with law or
					valid legal process, (b) to protect the rights, property,
					or safety of RailForLess.us, our users, or the public, or
					(c) in connection with a merger, acquisition, or transfer
					of substantially all assets, subject to this Policy.
				</p>
			</div>

			<div className="section-container">
				<h3>4. SMS / Text Messaging</h3>
				<p>
					If you opt in to SMS price alerts, you consent to receive
					automated text messages at the number you provide. Consent
					to receive SMS is not a condition of using the Service.
					Message and data rates may apply. Alert frequency varies.
					You can opt out at any time by replying{" "}
					<strong>STOP</strong> to any message, or get help by
					replying <strong>HELP</strong>. We do not share your
					phone number with third parties for their own marketing.
				</p>
			</div>

			<div className="section-container">
				<h3>5. Your Choices</h3>
				<ul>
					<li>
						<strong>Email alerts:</strong> unsubscribe at any time
						using the link in any alert email, or by submitting an
						unsubscribe request from the alerts page.
					</li>
					<li>
						<strong>SMS alerts:</strong> reply{" "}
						<strong>STOP</strong> to any message to opt out.
					</li>
					<li>
						<strong>Access, correction, and deletion:</strong>{" "}
						contact us at{" "}
						<a href="mailto:privacy@railforless.us">
							privacy@railforless.us
						</a>{" "}
						to request access to, correction of, or deletion of
						personal information associated with your email or
						phone number. We may need to verify your request
						before acting on it.
					</li>
					<li>
						<strong>Do Not Track:</strong> our site does not
						respond to Do Not Track signals, but we do not engage
						in cross-site tracking for advertising.
					</li>
				</ul>
			</div>

			<div className="section-container">
				<h3>6. Data Retention</h3>
				<p>
					We retain alert contact information and parameters for as
					long as your alert is active. If you unsubscribe, we retain
					a suppression record (for example, a hashed copy of your
					email or phone number) so we do not contact you again.
					Logs and technical data are retained for a limited period
					for security and troubleshooting, then deleted or
					aggregated.
				</p>
			</div>

			<div className="section-container">
				<h3>7. Security</h3>
				<p>
					We use reasonable administrative, technical, and physical
					safeguards to protect the information we hold, including
					encryption in transit. No method of transmission or
					storage is perfectly secure, and we cannot guarantee
					absolute security.
				</p>
			</div>

			<div className="section-container">
				<h3>8. Children's Privacy</h3>
				<p>
					The Service is not directed to children under 13, and we
					do not knowingly collect personal information from
					children under 13. If you believe a child has provided us
					with personal information, please contact us and we will
					delete it.
				</p>
			</div>

			<div className="section-container">
				<h3>9. International Users</h3>
				<p>
					The Service is operated from the United States. If you
					access the Service from outside the U.S., you understand
					that your information will be processed in the U.S.,
					which may have different data protection rules than your
					jurisdiction. Residents of California, the EEA, the UK,
					and other regions may have additional rights under local
					law; contact us to exercise them.
				</p>
			</div>

			<div className="section-container">
				<h3>10. Changes to This Policy</h3>
				<p>
					We may update this Privacy Policy from time to time. When
					we do, we will revise the "Last updated" date above.
					Material changes will be noted on the Service. Your
					continued use of the Service after changes take effect
					constitutes acceptance of the revised Policy.
				</p>
			</div>

			<div className="section-container">
				<h3>11. Contact</h3>
				<p>
					Questions or requests regarding this Privacy Policy may
					be directed to{" "}
					<a href="mailto:privacy@railforless.us">
						privacy@railforless.us
					</a>
					.
				</p>
			</div>
		</div>
	);
}
