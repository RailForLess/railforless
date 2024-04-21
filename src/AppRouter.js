import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import Navbar from "./Navbar";
import "./AppRouter.css";

export default function AppRouter() {
	const [searching, setSearching] = useState(false);
	const [searchError, setSearchError] = useState(false);

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
							/>
						}
					/>
					<Route path="/about" element={<About />} />
				</Routes>
			</BrowserRouter>
			{searching && !searchError && (
				<img alt="" id="acela" src="/images/acela.svg" />
			)}
		</main>
	);
}
