import "./ProgressTrain.css";

export default function ProgressTrain({ progress }) {
	function calcMargin() {
		if (
			window.matchMedia("(min-width: 481px)").matches &&
			window.matchMedia("(max-width: 1099px)").matches
		) {
			return 10;
		} else if (window.matchMedia("(max-width: 480px)").matches) {
			return 5;
		} else {
			return 15;
		}
	}

	return (
		<img
			alt=""
			id="train"
			src="./images/progress-train.png"
			style={{
				left: `calc(${-calcMargin()}vw - 44.4rem + ${
					progress.percentComplete / 100
				} * (44.4rem + 100vw))`,
			}}
		/>
	);
}
