import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import Navbar from "./Navbar";
import NotFound from "./NotFound";
import "./AppRouter.css";

export default function AppRouter() {
	const [searching, setSearching] = useState(false);
	const [searchError, setSearchError] = useState(false);
	const [showTurnstile, setShowTurnstile] = useState(false);

	const [searchAnimationsBool, setSearchAnimationsBool] = useState(
		localStorage.getItem("search-animations")
			? JSON.parse(localStorage.getItem("search-animations"))
			: true
	);

	return (
		<main>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route
						path="/"
						element={
							<Home
								searching={searching}
								setSearching={setSearching}
								searchError={searchError}
								setSearchError={setSearchError}
								showTurnstile={showTurnstile}
								setShowTurnstile={setShowTurnstile}
								searchAnimationsBool={searchAnimationsBool}
								setSearchAnimationsBool={setSearchAnimationsBool}
							/>
						}
					/>
					<Route path="/about" element={<About />} />
					<Route
						path="/:mode/*"
						element={
							<Home
								searching={searching}
								setSearching={setSearching}
								searchError={searchError}
								setSearchError={setSearchError}
								showTurnstile={showTurnstile}
								setShowTurnstile={setShowTurnstile}
							/>
						}
					/>
					<Route path="*" element={<NotFound msg={"Invalid URL"} />} />
				</Routes>
			</BrowserRouter>
			{searching && !searchError && !showTurnstile && searchAnimationsBool && (
				<img alt="" id="acela" src="/images/acela.svg" />
			)}
		</main>
	);
}
