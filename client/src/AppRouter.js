import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import "./AppRouter.css";
import FareTable from "./FareTable";

export default function AppRouter({ imageNum }) {
	const [recentSearches, setRecentSearches] = useState([]);

	return (
		<main>
			<div
				class="main-background"
				style={{
					backgroundImage: `url("./images/hero-${imageNum}.png")`,
					minHeight: "95vh",
				}}
			>
				<div class="hero" id="main-container">
					<BrowserRouter>
						<Routes>
							<Route
								path="/"
								element={
									<Home
										recentSearches={recentSearches}
										setRecentSearches={setRecentSearches}
									/>
								}
							/>
							<Route path="/about" element={<About />} />
						</Routes>
					</BrowserRouter>
				</div>
			</div>
			{recentSearches.length > 0 && (
				<div class="main-background" id="recent-searches">
					<div id="main-container">
						<div class="fade-in-translate hero-text-container">
							{recentSearches.map((search, index) => (
								<FareTable key={index} fares={search} />
							))}
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
