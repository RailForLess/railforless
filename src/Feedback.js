import { useState } from "react";
import "./Feedback.css";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function Feedback() {
	const [feedbackBool, setFeedbackBool] = useState(null);
	const [feedbackText, setFeedbackText] = useState("");
	const [submit, setSubmit] = useState(false);

	function handleSubmit() {
		setSubmit(true);

		const feedback = {};
		feedback.bool = feedbackBool;
		feedback.text = feedbackText;

		fetch("/api/feedback", {
			method: "POST",
			body: JSON.stringify(feedback),
		});
	}

	return (
		<div className="fade-in-translate" id="feedback-container">
			{feedbackBool == null && (
				<div className="feedback-column">
					<h2>Find what you were looking for?</h2>
					<div id="thumbs-container">
						<ThumbUpIcon onClick={() => setFeedbackBool(true)} />
						<ThumbDownIcon onClick={() => setFeedbackBool(false)} />
					</div>
				</div>
			)}
			{(feedbackBool === true || feedbackBool === false) && (
				<div className="feedback-column">
					<h2>
						{submit
							? "Thank you for your feedback. Consider donating to keep the trains running!"
							: feedbackBool
							? "Great! Anything I can improve?"
							: "Sorry about that. How can I improve?"}
					</h2>
					{!submit && !feedbackBool && (
						<h3>
							This site breaks from time to time due to factors beyond my
							control. If you believe the site is currently broken, please{" "}
							<a href="mailto:sean@railforless.us">contact me</a> directly.
						</h3>
					)}
					{!submit && (
						<form id="feedback-form" onSubmit={handleSubmit}>
							<textarea
								onChange={(e) => setFeedbackText(e.target.value)}
								value={feedbackText}
							></textarea>
							<input
								id="submit"
								name="submit"
								required
								type="submit"
								value="Submit feedback"
							/>
						</form>
					)}
					{submit && (
						<a
							href="https://www.buymeacoffee.com/seaneddy"
							id="donate-button"
							rel="noopener noreferrer"
							target="_blank"
						>
							<p>Donate</p>
							<LocalCafeIcon />
						</a>
					)}
				</div>
			)}
		</div>
	);
}
