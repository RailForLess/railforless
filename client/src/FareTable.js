import React from "react";
import "./FareTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function FareTable({ fares }) {
	const addInfo = fares.shift();

	const headerSet = new Set(["route", "date"]);
	const fareTypes = {};

	fares.forEach((fare) => {
		Object.keys(fare).forEach((header) => {
			if (
				[
					"coach",
					"business",
					"first",
					"roomette",
					"bedroom",
					"familyBedroom",
				].includes(header)
			) {
				headerSet.add(header);
				fareTypes[header] = { values: new Set() };
			}
		});
	});

	headerSet.add("departs");
	headerSet.add("duration");
	headerSet.add("arrives");

	const formattedFares = [];
	for (let i = 0; i < fares.length; i++) {
		formattedFares.push({});
		headerSet.forEach((header) => {
			if (!Object.keys(fares[i]).includes(header)) {
				formattedFares[i][header] = "";
			} else {
				formattedFares[i][header] = fares[i][header];
			}
		});
		Object.keys(fareTypes).forEach((fareType) => {
			if (Object.keys(fares[i]).includes(fareType)) {
				fareTypes[fareType].values.add(fares[i][fareType].replace(/[$,]/g, ""));
			}
		});
	}

	Object.keys(fareTypes).forEach((fareType) => {
		fareTypes[fareType].min = Math.min(...fareTypes[fareType].values);
	});

	const headerArray = Array.from(headerSet);
	if (headerArray.includes("familyBedroom")) {
		headerArray[headerArray.indexOf("familyBedroom")] = "Family Bedroom";
	}

	function rowHasMinValue(fare) {
		const minValueIndices = new Set();
		for (let i = 0; i < Object.keys(fare).length; i++) {
			const fareType = Object.keys(fare)[i];
			if (
				Object.keys(fareTypes).includes(fareType) &&
				fare[fareType].replace(/[$,]/g, "") == fareTypes[fareType].min
			) {
				minValueIndices.add(i);
			}
		}
		return minValueIndices;
	}

	return (
		<div class="fare-table fade-in">
			{Object.keys(addInfo).length > 0 && (
				<div class="table-info">
					<div class="table-stations">
						<h2>{addInfo.deptStation}</h2>
						<FontAwesomeIcon icon={faArrowRight} size="lg" />
						<h2>{addInfo.arrivalStation}</h2>
					</div>
				</div>
			)}
			<table>
				<thead>
					<tr key="headers">
						{headerArray.map((header) => (
							<th key={header}>
								{header.charAt(0).toUpperCase() + header.slice(1)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{formattedFares.map((fare, trIndex) => (
						<tr key={`tr-${trIndex}`}>
							{Object.values(fare).map((value, tdIndex) => (
								<td
									key={`td-${trIndex}${tdIndex}`}
									style={{
										color: rowHasMinValue(fare).has(tdIndex)
											? "green"
											: "white",
										fontSize: rowHasMinValue(fare).has(tdIndex)
											? "1.25rem"
											: "1rem",
										fontWeight: rowHasMinValue(fare).has(tdIndex)
											? "500"
											: "400",
									}}
								>
									{value}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			{Object.keys(addInfo).length > 0 && (
				<div class="table-info">
					<h3>
						{"last updated " +
							new Date(JSON.parse(addInfo.requestTime)).toLocaleString()}
					</h3>
				</div>
			)}
		</div>
	);
}
