import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import "./AppRouter.css";
import FareTable from "./FareTable";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CloseIcon from "@mui/icons-material/Close";

export default function AppRouter({ updateBarClose }) {
	const [recentSearches, setRecentSearches] = useState([]);
	const [maxRecentSearch, setMaxRecentSearch] = useState(0);

	const recentSearchesToLoad = recentSearches.slice(0, maxRecentSearch);

	function setMainHeight() {
		document.querySelector("main").style.height =
			window.innerWidth <= 480
				? "auto"
				: `calc(100% - 6rem - ${!updateBarClose ? 2.4 : 0}rem)`;
	}
	setTimeout(setMainHeight, 0);
	window.onresize = setMainHeight;

	return (
		<main>
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
			{recentSearches.length > 0 && (
				<div className="main-background" id="recent-searches">
					<div className="main-container">
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
										<ArrowDownwardIcon size="xl" />
									</div>
								)}
								<div
									className="recent-search-button"
									onClick={() => setRecentSearches([])}
								>
									<p>Close</p>
									<CloseIcon size="xl" />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
