import { useEffect, useState } from "react";
import "./Donation.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";

export default function Donation({ defaultExpanded = false }) {
	const [loaded, setLoaded] = useState(false);
	const [donations, setDonations] = useState(null);

	useEffect(() => {
		async function getData() {
			const res = await fetch(`${process.env.REACT_APP_API_DOMAIN}/donations`);
			if (res.ok) {
				setDonations(await res.json());
			}
			setLoaded(true);
		}
		getData();
	}, []);

	const DonateButton = () => (
		<Button
			endIcon={<VolunteerActivismIcon />}
			href="https://www.buymeacoffee.com/seaneddy"
			target="_blank"
			variant="outlined"
		>
			Donate
		</Button>
	);

	return loaded ? (
		<Accordion defaultExpanded={defaultExpanded} id="donation-accordion">
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<h3>Help keep RailForLess.us ad-free.</h3>
				{donations ? (
					<div id="donation-progress-container">
						{window.innerWidth > 480 && (
							<LinearProgress
								className={`${donations.fundingClass}-funding`}
								value={Math.min(donations.percentFunded, 100)}
								variant="determinate"
							/>
						)}
						<div>
							<span>{`${donations.percentFunded}% funded this month`}</span>
							<Tooltip
								arrow
								title={`Donations have covered ${
									donations.percentFunded
								}% of our expenses this month ($${donations.donations.toFixed(
									2
								)}/$${donations.expenses.toFixed(2)})`}
							>
								<IconButton size="small">
									<HelpIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</div>
					</div>
				) : (
					<DonateButton />
				)}
			</AccordionSummary>
			<AccordionDetails>
				<Divider />
				<div>
					{donations ? (
						<p>
							RailForLess.us relies entirely on donations to cover operating
							costs. We are <u>not affiliated with Amtrak</u> and{" "}
							<u>do not benefit monetarily</u> from providing this service. Help
							us develop new features and provide a better service than Amtrak
							with a donation today. Consider{" "}
							<a
								href="https://buymeacoffee.com/seaneddy/membership"
								rel="noreferrer"
								target="_blank"
							>
								becoming a member
							</a>{" "}
							to ensure our continued funding for months to come. In the
							interest of total financial transparency, see our progress towards
							this month's fundraising goal below.
						</p>
					) : (
						<p>
							RailForLess.us relies entirely on donations to cover operating
							costs. We are <u>not affiliated with Amtrak</u> and{" "}
							<u>do not benefit monetarily</u> from providing this service. Help
							us develop new features and provide a better service than Amtrak
							with a donation today. Consider{" "}
							<a
								href="https://buymeacoffee.com/seaneddy/membership"
								rel="noreferrer"
								target="_blank"
							>
								becoming a member
							</a>{" "}
							to ensure our continued funding for months to come.
						</p>
					)}
					{donations && <Divider />}
					{donations && (
						<div>
							<div>
								<div id="budget-container">
									<h3>{`${donations.period} Budget`}</h3>
									<div>
										<div>
											<span>Expenses:</span>
											<strong>{`$${donations.expenses.toFixed(2)}`}</strong>
											<Tooltip
												arrow
												title={
													"Monthly operating costs include proxies to ensure a reliable connection to the Amtrak API and other cloud computing services"
												}
											>
												<IconButton size="small">
													<InfoIcon fontSize="small" />
												</IconButton>
											</Tooltip>
										</div>
										<div>
											<span>Donations:</span>
											<strong
												className={`${donations.fundingClass}-funding`}
											>{`$${donations.donations.toFixed(2)}`}</strong>
										</div>
									</div>
								</div>
								<DonateButton />
							</div>
							<Divider
								flexItem
								orientation={
									window.innerWidth > 480 ? "vertical" : "horizontal"
								}
							/>
							<div>
								<span>Special thanks to our recent supporters:</span>
								<div>
									{donations.names.map((name, i) => (
										<span key={`donation-${i}`}>{name}</span>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</AccordionDetails>
		</Accordion>
	) : (
		<Skeleton id="donation-skeleton" variant="rectangular" />
	);
}
