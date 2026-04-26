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
	const graphYValues = graphYData.filter((fare) => fare !== null);

	const showMark = graphYData.some(
		(y, i) =>
			y !== null &&
			(graphYData[i - 1] ?? null) === null &&
			(graphYData[i + 1] ?? null) === null
	);

	if (graphYValues.length === 0) {
		return null;
	}

	return (
		<Accordion defaultExpanded>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				Price graph
			</AccordionSummary>
			<AccordionDetails>
				<div id="graph-container">
					<LineChart
						height={224}
						hideLegend
						margin={{ top: 16, right: 16, bottom: 28, left: 56 }}
						series={[
							{
								area: true,
								color: "#4693FF",
								data: graphYData,
								showMark,
								valueFormatter: graphYFormatter,
							},
						]}
						sx={{
							width: "100%",
							"& .MuiAreaElement-root": {
								fill: "#4693FF",
								fillOpacity: 0.12,
							},
							"& .MuiLineElement-root": {
								stroke: "#4693FF",
							},
						}}
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
								max: Math.max(...graphYValues),
								min: Math.min(...graphYValues) * (3 / 4),
								valueFormatter: graphYAxisFormatter,
							},
						]}
					/>
				</div>
			</AccordionDetails>
		</Accordion>
	);
}
