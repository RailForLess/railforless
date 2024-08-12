import "./NotFound.css";

export default function NotFound() {
	return (
		<div className="main-container">
			<div id="not-found-container">
				<img alt="" src="/images/broken-rail.svg" />
				<div>
					<span>We couldn't get you there...</span>
					<span>
						You may have mistyped something or the page you are looking for no
						longer exists.
					</span>
				</div>
			</div>
		</div>
	);
}
