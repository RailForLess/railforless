import React, { useState } from "react";
import "./Feedback.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMugSaucer,
	faThumbsUp,
	faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";

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
				<div class="feedback-column">
					<h2>Find what you were looking for?</h2>
					<div id="thumbs-container">
						<FontAwesomeIcon
							icon={faThumbsUp}
							onClick={() => setFeedbackBool(true)}
							size="2xl"
						/>
						<FontAwesomeIcon
							icon={faThumbsDown}
							onClick={() => setFeedbackBool(false)}
							size="2xl"
						/>
					</div>
				</div>
			)}
			{(feedbackBool === true || feedbackBool === false) && (
				<div class="feedback-column">
					<h2>
						{submit
							? "Thank you for your feedback. Consider donating to keep the trains running!"
							: feedbackBool
							? "Great! Anything I can improve?"
							: "Sorry about that. How can I improve?"}
					</h2>
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
							<FontAwesomeIcon icon={faMugSaucer} />
						</a>
					)}
				</div>
			)}
		</div>
	);
}
