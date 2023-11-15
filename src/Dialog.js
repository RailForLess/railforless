import { createRoot } from "react-dom/client";
import "./Dialog.css";
import CampaignIcon from "@mui/icons-material/Campaign";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import WarningIcon from "@mui/icons-material/Warning";

let dialogResolve, dialogRoot, root;

export default function Dialog({ text, type }) {
	async function close(input) {
		const dialogContainer = document.getElementById("dialog-container");
		dialogContainer.style.opacity = "0";
		dialogRoot.style.backdropFilter = "blur(0)";
		await new Promise((resolve) => setTimeout(resolve, 500));
		root.unmount();
		dialogRoot.style.visibility = "hidden";
		dialogResolve(input);
	}

	return (
		<div className="main-container">
			<div className="fade-in" id="dialog-container">
				<div className="dialog-bar">
					{type === "announce" ? <CampaignIcon /> : <WarningIcon />}
					<HighlightOffIcon onClick={() => close(false)} />
				</div>
				<p
					dangerouslySetInnerHTML={{ __html: text }}
					style={{
						fontSize: text.length > 150 ? "1.25rem" : "1.75rem",
						textAlign: text.length > 150 ? "left" : "center",
					}}
				></p>
				{type === "confirm" ? (
					<div className="dialog-bar" id="button-container">
						<div onClick={() => close(false)}>Cancel</div>
						<div onClick={() => close(true)}>OK</div>
					</div>
				) : (
					<div className="dialog-bar" id="button-container">
						<div onClick={() => close(true)}>OK</div>
					</div>
				)}
			</div>
		</div>
	);
}

export function getDialog(text, type) {
	window.scrollTo(0, 0);
	dialogRoot = document.getElementById("dialog-root");
	dialogRoot.style.visibility = "visible";
	dialogRoot.style.backdropFilter = "blur(6px)";
	root = createRoot(dialogRoot);
	root.render(<Dialog text={text} type={type} />);
	return new Promise((resolve) => {
		dialogResolve = resolve;
	});
}
