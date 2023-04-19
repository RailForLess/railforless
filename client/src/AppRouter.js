import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import "./AppRouter.css";
import FareTable from "./FareTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AppRouter({ imageNum }) {
	const [recentSearches, setRecentSearches] = useState([]);
	const [maxRecentSearch, setMaxRecentSearch] = useState(0);

	const recentSearchesToLoad = recentSearches.slice(0, maxRecentSearch);

	return (
		<main>
			<div
				className="main-background"
				style={{
					backgroundImage: `url("./images/hero-${imageNum}.png")`,
					minHeight: "95vh",
				}}
			>
				<div className="hero" id="main-container">
					<BrowserRouter>
						<Routes>
							<Route
								path="/"
								element={
									<Home
										recentSearches={recentSearches}
										setRecentSearches={setRecentSearches}
										setMaxRecentSearch={setMaxRecentSearch}
									/>
								}
							/>
							<Route path="/about" element={<About />} />
						</Routes>
					</BrowserRouter>
				</div>
			</div>
			{recentSearches.length > 0 && (
				<div className="main-background" id="recent-searches">
					<div id="main-container">
						<div className="fade-in-translate hero-text-container">
							{recentSearchesToLoad.map((search, index) => (
								<FareTable key={index} fares={[...search]} />
							))}
							<div id="recent-search-button-container">
								{maxRecentSearch < recentSearches.length && (
									<div
										className="recent-search-button"
										onClick={() => setMaxRecentSearch(maxRecentSearch + 10)}
									>
										<p>Load more</p>
										<FontAwesomeIcon icon={faArrowDown} size="xl" />
									</div>
								)}
								<div
									className="recent-search-button"
									onClick={() => setRecentSearches([])}
								>
									<p>Close</p>
									<FontAwesomeIcon icon={faXmark} size="xl" />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
