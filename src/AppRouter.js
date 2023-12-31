import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import "./AppRouter.css";

export default function AppRouter({ updateBarClose }) {
	function setMainHeight() {
		document.querySelector("main").style.height = `calc(100% - 6rem - ${
			window.innerWidth <= 480 ? 8 : window.innerWidth <= 800 ? 7.5 : 0
		}rem - ${!updateBarClose ? 2.4 : 0}rem)`;
	}

	useEffect(() => {
		setTimeout(setMainHeight, 0);
		window.addEventListener("resize", setMainHeight);
	}, []);

	return (
		<main>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
				</Routes>
			</BrowserRouter>
		</main>
	);
}
