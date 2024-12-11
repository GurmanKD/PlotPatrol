import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import EarthMap from "./pages/EarthMap/EarthMap";
import Protected from "./layouts/Protected";
import Dashboard from "./layouts/Dashboard";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Complaint from "./pages/Complaint/Complaint";
import Complaint2 from "./pages/Complaint/Complaint2";
import Compare from "./pages/Compare/Compare";
import BuilderForm from "./pages/BuilderForm/BuilderForm";
import GoogleMapInput from "./pages/Test/test";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4169E1", 
    },
    secondary: {
      main: "#979797",
    },
    error: {
      main: "#c3122f", 
    },
    success:{
      main:"#4cbb17",
    }
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif",
  },
});

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        <BrowserRouter>
          <Routes>
            
            <Route
              path="/"
              element={<Protected element={<Dashboard element={<Home />} />} />}
            ></Route>
            
            <Route path="/maps" element={<EarthMap />}></Route>
            <Route path="/complaint" element={<Protected element={<Dashboard element={<Complaint />} />} />}></Route>
            <Route path="/complaint2" element={<Protected element={<Dashboard element={<Complaint2 />} />} />}></Route>
            <Route path="/compare" element={<Protected element={<Dashboard element={<Compare />} />} />}></Route>
            <Route path="/builder-form" element={<Protected element={<Dashboard element={<BuilderForm />} />} />}></Route>
            <Route path="/test" element={<Protected element={<Dashboard element={<GoogleMapInput />} />} />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
