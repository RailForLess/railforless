import React from "react";
import { flushSync } from "react-dom";
import "./RecentSearchesButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function RecentSearchesButton({
	setRecentSearches,
	setMaxRecentSearch,
}) {
	function handleClick() {
		fetch("/api/recent-searches")
			.then((res) => res.json())
			.then((data) => {
				flushSync(() => {
					setRecentSearches(data.recentSearches);
					setMaxRecentSearch(10);
				});
				const element = document.getElementById("recent-searches");
				element.scrollIntoView({ behavior: "smooth" });
			});
	}

	return (
		<div id="recent-searches-button-container">
			<div id="recent-searches-button" onClick={handleClick}>
				<h2>See what others are searching</h2>
				<FontAwesomeIcon icon={faAngleDown} size="2xl" />
			</div>
		</div>
	);
}
