import { useEffect, useState } from "react";
import "./DateGrid.css";
import AmtrakForm from "./AmtrakForm";
import AdjustIcon from "@mui/icons-material/Adjust";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export default function DateGrid({
	dateGrid,
	travelerTypes,
	roundTrip,
	fareFormatter,
	usePoints,
}) {
	const maxNumRows = window.innerWidth > 768 ? 7 : 5;
	const maxNumCols = window.innerWidth > 768 ? 7 : 3;
	const [row, setRow] = useState(Math.max(0, dateGrid.length - maxNumRows));
	const [col, setCol] = useState(0);

	useEffect(() => {
		const newRow = Math.max(0, dateGrid.length - maxNumRows);
		setRow(newRow);
		setCol(0);
		setDateGridDisplayed(updateDateGridDisplayed(newRow, 0));
	}, [dateGrid]);

	const updateDateGridDisplayed = (newRow, newCol) =>
		dateGrid.slice(newRow, newRow + maxNumRows).map((row) => ({
			...row,
			departures: row.departures.slice(newCol, newCol + maxNumCols),
		}));

	const [dateGridDisplayed, setDateGridDisplayed] = useState(
		updateDateGridDisplayed(row, col)
	);

	useEffect(() => {
		setDateGridDisplayed(updateDateGridDisplayed(row, col));
	}, [row, col]);

	const minFareDisplayed = Math.min(
		...dateGridDisplayed
			.map((row) =>
				row.departures.filter((col) => col.option).map((col) => col.option.fare)
			)
			.flat()
	);

	const [rowHighlight, setRowHighlight] = useState();
	const [colHighlight, setColHighlight] = useState();

	const [anchor, setAnchor] = useState(null);
	const [option, setOption] = useState(null);

	return (
		<Accordion defaultExpanded={window.innerWidth > 480}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				Date grid
			</AccordionSummary>
			<AccordionDetails>
				<div id="date-grid-container">
					<div className="date-grid-seek-container">
						<span>Departure</span>
						<div>
							<IconButton disabled={!col} onClick={() => setCol(col - 1)}>
								<ChevronLeftIcon />
							</IconButton>
							<IconButton
								disabled={col + maxNumCols >= dateGrid[0].departures.length}
								onClick={() => setCol(col + 1)}
							>
								<ChevronRightIcon />
							</IconButton>
						</div>
					</div>
					{window.innerWidth <= 480 && dateGridDisplayed.length > 1 && (
						<div className="date-grid-seek-container">
							<span>Return</span>
							<div>
								<IconButton
									disabled={!row}
									onClick={() => setRow(row - 1)}
									sx={{ transform: "rotate(90deg)" }}
								>
									<ChevronLeftIcon />
								</IconButton>
								<IconButton
									disabled={row + maxNumRows >= dateGrid.length}
									onClick={() => setRow(row + 1)}
									sx={{ transform: "rotate(90deg)" }}
								>
									<ChevronRightIcon />
								</IconButton>
							</div>
						</div>
					)}
					<div>
						<Table>
							<TableHead>
								<TableRow>
									{dateGridDisplayed[0].departures.map((departure, j) => (
										<TableCell align="center" key={`date-grid-${-1}-${j}`}>
											<div
												onMouseEnter={() => setColHighlight(j)}
												onMouseLeave={() => setColHighlight(null)}
												style={{
													background:
														j === colHighlight
															? "rgba(137, 179, 247, 0.15)"
															: "",
												}}
											></div>
											{departure.date.format("ddd MMM D")}
										</TableCell>
									))}
									{dateGridDisplayed.length > 1 && (
										<TableCell align="center">
											{(!(row + maxNumRows >= dateGrid.length) ||
												Boolean(col)) && (
												<IconButton
													onClick={() => {
														setRow(Math.max(0, dateGrid.length - maxNumRows));
														setCol(0);
													}}
												>
													<AdjustIcon fontSize="large" />
												</IconButton>
											)}
										</TableCell>
									)}
								</TableRow>
							</TableHead>
							<TableBody>
								{dateGridDisplayed.map((returnTrip, i) => (
									<TableRow key={`date-grid-${i}-${-1}`}>
										{returnTrip.departures.map((departure, j) => (
											<TableCell
												align="center"
												key={`date-grid-${i}-${j}`}
												sx={{
													background:
														departure.option &&
														departure.option.fare === minFareDisplayed
															? "rgba(129, 201, 149, 0.2)"
															: "",

													color:
														departure.option &&
														departure.option.fare === minFareDisplayed
															? "#81c995"
															: "",
												}}
											>
												<div
													onClick={(e) => {
														if (departure.option) {
															setOption(departure.option);
															setAnchor(e.currentTarget.parentElement);
														}
													}}
													onMouseEnter={() => {
														if (departure.option) {
															setRowHighlight(i);
															setColHighlight(j);
														}
													}}
													onMouseLeave={() => {
														if (!anchor) {
															setRowHighlight(null);
															setColHighlight(null);
														}
													}}
													style={{
														background:
															i === rowHighlight || j === colHighlight
																? "rgba(137, 179, 247, 0.15)"
																: "",
														border:
															i === rowHighlight && j === colHighlight
																? "3px solid rgba(137, 179, 247, 0.5)"
																: "",
														cursor: departure.option ? "pointer" : "auto",
													}}
												></div>
												{departure.option
													? fareFormatter(departure.option.fare)
													: ""}
											</TableCell>
										))}
										{dateGridDisplayed.length > 1 && (
											<TableCell align="center" variant="head">
												<div
													onMouseEnter={() => setRowHighlight(i)}
													onMouseLeave={() => setRowHighlight(null)}
													style={{
														background:
															i === rowHighlight
																? "rgba(137, 179, 247, 0.15)"
																: "",
													}}
												></div>
												{returnTrip.date.format("ddd MMM D")}
											</TableCell>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
						{window.innerWidth > 480 && dateGridDisplayed.length > 1 && (
							<div className="date-grid-seek-container">
								<span>Return</span>
								<div>
									<IconButton
										disabled={!row}
										onClick={() => setRow(row - 1)}
										sx={{ transform: "rotate(90deg)" }}
									>
										<ChevronLeftIcon />
									</IconButton>
									<IconButton
										disabled={row + maxNumRows >= dateGrid.length}
										onClick={() => setRow(row + 1)}
										sx={{ transform: "rotate(90deg)" }}
									>
										<ChevronRightIcon />
									</IconButton>
								</div>
							</div>
						)}
					</div>
				</div>
			</AccordionDetails>
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
				<div style={{ padding: "0.5rem" }}>
					<AmtrakForm
						i={-1}
						option={option}
						travelerTypes={travelerTypes}
						roundTrip={roundTrip}
						usePoints={usePoints}
					/>
				</div>
			</Popover>
		</Accordion>
	);
}
