import { useState } from "react";
import Form from "./Form";
import Hero from "./Hero";
import Map from "./Map";
import "./Home.css";

export default function Home() {
	const [stations, setStations] = useState([]);
	const [origin, setOrigin] = useState(null);
	const [destination, setDestination] = useState(null);
	const [updateMap, setUpdateMap] = useState(false);
	const [route, setRoute] = useState("Any-route");

	const [searching, setSearching] = useState(false);

	function setHeroContainerHeight() {
		const width = window.innerWidth;
		document.querySelector("#hero-container").style.height = `calc(100% - (${
			width <= 480 ? 90 : width <= 1099 ? 80 : 50
		}vw * (267 / 1251)) + ${width <= 480 ? 0.5 : 1.5}rem - 0.3rem)`;
	}
	setTimeout(setHeroContainerHeight, 0);
	window.addEventListener("resize", setHeroContainerHeight);

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
					destination={destination}
					setDestination={setDestination}
					updateMap={updateMap}
					setUpdateMap={setUpdateMap}
					searching={searching}
					setSearching={setSearching}
					route={route}
					setRoute={setRoute}
				/>
				{!searching ? (
					<Map
						stationsJSON={stations}
						origin={origin}
						setOrigin={setOrigin}
						destination={destination}
						setDestination={setDestination}
						updateMap={updateMap}
						route={route}
						setRoute={setRoute}
					/>
				) : (
					<div></div>
				)}
			</div>
		</div>
	);
}