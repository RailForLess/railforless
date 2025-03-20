import dayjs from "dayjs";
import "./PriceGraph.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { LineChart } from "@mui/x-charts/LineChart";

export default function PriceGraph({ graphXData, graphYData, fareFormatter }) {
	const graphXFormatter = (date) => dayjs(date).format("M/D");
	const graphYAxisFormatter = (fare) => (fare ? fareFormatter(fare) : null);
	const graphYFormatter = (fare) =>
		fare ? `As low as ${graphYAxisFormatter(fare)}` : "No options available";

	const showMark = graphYData.some(
		(y, i) =>
			y !== null &&
			(graphYData[i - 1] ?? null) === null &&
			(graphYData[i + 1] ?? null) === null
	);

	return (
		<Accordion defaultExpanded>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				Price graph
			</AccordionSummary>
			<AccordionDetails>
				<div id="graph-container">
					<LineChart
						height={160}
						series={[
							{
								area: true,
								color: "#4693FF",
								data: graphYData,
								showMark,
								valueFormatter: graphYFormatter,
							},
						]}
						xAxis={[
							{
								data: graphXData,
								scaleType: "time",
								tickNumber: graphXData.length,
								valueFormatter: graphXFormatter,
							},
						]}
						yAxis={[
							{
								max: graphYData.reduce((a, b) => (a > b ? a : b)),
								min: graphYData.reduce((a, b) => (a < b ? a : b)) * (3 / 4),
								valueFormatter: graphYAxisFormatter,
							},
						]}
					>
						<linearGradient
							id="graph-gradient"
							x1="0%"
							y1="0%"
							x2="0%"
							y2="100%"
						>
							<stop offset="0%" stopColor="#4693FF" stopOpacity="1"></stop>
							<stop offset="40%" stopColor="#4693FF" stopOpacity="1"></stop>
							<stop offset="60%" stopColor="#4693FF" stopOpacity="0"></stop>
						</linearGradient>
					</LineChart>
					<div></div>
				</div>
			</AccordionDetails>
		</Accordion>
	);
}
