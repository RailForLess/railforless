import React, { useState } from "react";
import Navbar from "./Navbar";
import AppRouter from "./AppRouter";
import Footer from "./Footer";
import "./App.css";

export default function App() {
	const imageInfo = [
		{
			imageNum: 1,
			author: "Mds08011",
			authorLink: "https://commons.wikimedia.org/wiki/User:Mds08011",
			license: "CC BY 4.0",
			licenseLink: "https://creativecommons.org/licenses/by/4.0/deed.en",
		},
		{
			imageNum: 2,
			author: "Steve Wilson",
			authorLink: "https://www.flickr.com/people/36989019@N08",
			license: "CC BY-SA 2.0",
			licenseLink: "https://creativecommons.org/licenses/by-sa/2.0/deed.en",
		},
		{
			imageNum: 3,
			author: "Jerry Huddleston",
			authorLink: "https://www.flickr.com/people/9265232@N04",
			license: "CC BY 2.0",
			licenseLink: "https://creativecommons.org/licenses/by/2.0/deed.en",
		},
		{
			imageNum: 4,
			author: "Carter Pape",
			authorLink: "https://commons.wikimedia.org/wiki/User:Carter_Pape",
			license: "CC BY-SA 4.0",
			licenseLink: "https://creativecommons.org/licenses/by-sa/4.0/deed.en",
		},
		{
			imageNum: 5,
			author: "David Gubler",
			authorLink: "http://www.bahnbilder.ch/",
			license: "CC BY-SA 2.0",
			licenseLink: "https://creativecommons.org/licenses/by-sa/2.0/deed.en",
		},
		{
			imageNum: 6,
			author: "Jerry Huddleston",
			authorLink: "https://www.flickr.com/people/9265232@N04",
			license: "CC BY 2.0",
			licenseLink: "https://creativecommons.org/licenses/by/2.0/deed.en",
		},
	];

	const [imageIndex, setImageIndex] = useState(Math.floor(Math.random() * 6));

	return (
		<div className="App">
			<Navbar />
			<AppRouter imageNum={imageInfo[imageIndex].imageNum} />
			<Footer
				imageIndex={imageIndex}
				imageInfo={imageInfo}
				setImageIndex={setImageIndex}
			/>
		</div>
	);
}
