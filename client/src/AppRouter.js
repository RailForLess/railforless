import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import "./AppRouter.css";

export default function AppRouter({ imageNum }) {
	return (
		<main
			style={{
				backgroundImage: `url("./images/hero-${imageNum}.png")`,
			}}
		>
			<div id="main-container">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
					</Routes>
				</BrowserRouter>
			</div>
		</main>
	);
}
