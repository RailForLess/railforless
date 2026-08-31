import "./Donation.css";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

export default function Donation() {
	return (
		<div id="donation-container">
			<h3>Help keep RailForLess.us ad-free.</h3>
			<Divider />
			<p>
				RailForLess.us relies entirely on donations to cover operating costs. We
				are <u>not affiliated with Amtrak</u> and{" "}
				<u>do not benefit monetarily</u> from providing this service. Help us
				develop new features and provide a better service than Amtrak with a
				donation today. Consider{" "}
				<a
					href="https://buymeacoffee.com/railforless/membership"
					rel="noreferrer"
					target="_blank"
				>
					becoming a member
				</a>{" "}
				to ensure our continued funding for months to come.
			</p>
			<Button
				endIcon={<VolunteerActivismIcon />}
				fullWidth
				href="https://www.buymeacoffee.com/railforless"
				size="large"
				target="_blank"
				variant="outlined"
			>
				Donate
			</Button>
		</div>
	);
}
