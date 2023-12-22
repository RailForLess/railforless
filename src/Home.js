import { useState } from "react";
import Form from "./Form";
import Hero from "./Hero";
import Map from "./Map";
import "./Home.css";

export default function Home({}) {
	const [stations, setStations] = useState([]);
	const [origin, setOrigin] = useState(null);

	function setHeroContainerHeight() {
		const width = window.innerWidth;
		document.querySelector("#hero-container").style.height = `calc(100% - (${
			width <= 480 ? 90 : width <= 1099 ? 80 : 50
		}vw * (267 / 1251)) + ${width <= 480 ? 0.5 : 1.5}rem - 0.3rem)`;
	}
	setTimeout(setHeroContainerHeight, 0);
	window.onresize = setHeroContainerHeight;

	return (
		<div className="main-container">
			<Hero />
			<div id="hero-container">
				<div className="fade-in-translate" id="hero-text">
					<h1>RailForLess.us</h1>
				</div>
				<Form
					stations={stations}
					setStations={setStations}
					origin={origin}
					setOrigin={setOrigin}
				/>
				<Map stationsJSON={stations} origin={origin} setOrigin={setOrigin} />
			</div>
		</div>
	);
}
