import { useState } from "react";
import CheckboxRow from "./CheckboxRow";
import { routesInfo } from "./routesInfo";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";

export default function Routes({ routes, setRoutes }) {
	const excludedRoutes = Object.keys(routes).filter((route) => !routes[route]);
	const string =
		excludedRoutes.length > 1
			? `Exclude: ${excludedRoutes[0]} +${excludedRoutes.length - 1}`
			: excludedRoutes.length === 1
			? `Exclude: ${excludedRoutes[0]}`
			: "Routes";

	function clear() {
		setRoutes(Object.keys(routes).reduce((a, b) => ({ ...a, [b]: true }), {}));
	}

	const [anchor, setAnchor] = useState(null);

	return (
		<div
			className={`filter-${excludedRoutes.length === 0 ? "not-" : ""}selected`}
		>
			<Button
				className={`filter-button select ${
					!anchor && excludedRoutes.length === 0 ? "not-" : ""
				}selected`}
				disableRipple
				endIcon={
					excludedRoutes.length === 0 ? (
						<ArrowDropDownIcon
							sx={{ transform: `rotate(${Boolean(anchor) ? 180 : 0}deg)` }}
						/>
					) : (
						<CloseIcon
							onClick={(e) => {
								e.stopPropagation();
								clear();
							}}
							fontSize="small"
						/>
					)
				}
				onClick={(e) => setAnchor(e.currentTarget)}
				variant="outlined"
			>
				{string}
			</Button>
			<Popover
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				onClose={() => setAnchor(null)}
				open={Boolean(anchor)}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<div className="popover-filter">
					<div>
						<span>Routes</span>
						<IconButton onClick={() => setAnchor(null)}>
							<CloseIcon />
						</IconButton>
					</div>
					{Object.keys(routes).map((route) => {
						const routeInfo =
							routesInfo[route.replaceAll("-", " ").replace("_", "/")];
						return (
							<CheckboxRow
								key={route}
								values={routes}
								setValues={setRoutes}
								value={route}
								label={
									<div className="checkbox-label">
										{routeInfo && <span>{routeInfo.icon}</span>}
										{route.replaceAll("-", " ").replace("_", "/")}
									</div>
								}
							/>
						);
					})}
					<div className="options">
						<Button
							disabled={excludedRoutes.length === 0}
							disableRipple
							onClick={clear}
						>
							Clear
						</Button>
					</div>
				</div>
			</Popover>
		</div>
	);
}
