import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import EarthMap from "./pages/EarthMap/EarthMap";
import Protected from "./layouts/Protected";
import Dashboard from "./layouts/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FEA900", 
    },
    secondary: {
      main: "#979797",
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
  },
});

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Resets browser styling */}
        <BrowserRouter>
          <Routes>
            
            <Route
              path="/"
              element={<Protected element={<Dashboard element={<Home />} />} />}
            ></Route>
            
            <Route path="/maps" element={<EarthMap />}></Route>
            <Route path="/test" element={<EarthMap />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
