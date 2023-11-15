import "./FareTable.css";
import EastIcon from "@mui/icons-material/East";

export default function FareTable({ fares }) {
	const addInfo = fares.shift();

	const headerArray = ["date", "route"];
	const variableHeaderSet = new Set();
	const fareTypes = {};

	fares.forEach((fare) => {
		Object.keys(fare).forEach((header) => {
			if (
				[
					"coach",
					"business",
					"first",
					"rooms",
					"roomette",
					"bedroom",
					"familyRoom",
					"capacity",
				].includes(header)
			) {
				variableHeaderSet.add(header);
				if (header !== "capacity") {
					fareTypes[header] = { values: new Set() };
				}
			}
		});
	});

	[
		"coach",
		"business",
		"first",
		"rooms",
		"roomette",
		"bedroom",
		"familyRoom",
		"capacity",
	].forEach((fareType) => {
		if (variableHeaderSet.has(fareType)) {
			headerArray.push(fareType);
		}
	});
	headerArray.push("departs", "duration", "arrives");
	console.log(headerArray);

	const formattedFares = [];
	for (let i = 0; i < fares.length; i++) {
		formattedFares.push({});
		headerArray.forEach((header) => {
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

	if (headerArray.includes("familyRoom")) {
		headerArray[headerArray.indexOf("familyRoom")] = "Family Room";
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
		<div className="fare-table fade-in">
			{Object.keys(addInfo).length > 0 && (
				<div className="table-info">
					<div className="table-stations">
						<h2>{addInfo.deptStation}</h2>
						<EastIcon />
						<h2>{addInfo.arrivalStation}</h2>
					</div>
					<h3 id="traveler-info">{addInfo.travelerInfo}</h3>
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
				<div className="table-info">
					<h3>
						{"last updated " +
							new Date(JSON.parse(addInfo.requestTime)).toLocaleString()}
					</h3>
				</div>
			)}
		</div>
	);
}
