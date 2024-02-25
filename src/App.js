import { useState } from "react";
import UpdateBar from "./UpdateBar";
import Navbar from "./Navbar";
import AppRouter from "./AppRouter";
import Footer from "./Footer";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function App() {
	const [updateBarClose, setUpdateBarClose] = useState(true);

	const primary = {
		main: "#89B3F7",
		hover: "#9DC0F9",
	};

	const darkTheme = createTheme({
		palette: {
			mode: "dark",
			primary: primary,
		},
		typography: {
			button: {
				textTransform: "none",
			},
		},
	});

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<div className="fade-in">
					{!updateBarClose && (
						<UpdateBar setUpdateBarClose={setUpdateBarClose} />
					)}
					<Navbar />
					<AppRouter updateBarClose={updateBarClose} />
					<Footer />
				</div>
			</LocalizationProvider>
		</ThemeProvider>
	);
}
