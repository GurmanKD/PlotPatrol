import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  OutlinedInput,
} from "@mui/material";
import React, { useEffect } from "react";
import dayjs from "dayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../../config";

const Surveys = () => {

  const [initActiveSurveys, setInitActiveSurveys] = React.useState([]);
  const [initPastSurveys, setInitPastSurveys] = React.useState([]);

  const [activeSurveys, setActiveSurveys] = React.useState(initActiveSurveys);
  const [pastSurveys, setPastSurveys] = React.useState(initPastSurveys);

  const [searchFiltersActive, setSearchFiltersActive] = React.useState({
    pincode: "",
    date: null,
  });
  const [searchFiltersPast, setSearchFiltersPast] = React.useState({
    pincode: "",
    date: null,
  });

  const navigate=useNavigate();

  const handleSearch = (surveyType) => {
    const searchFilters = surveyType === 'active' ? searchFiltersActive : searchFiltersPast;
  
    const filteredSurveys = (surveys) => {
      return surveys.filter((survey) => {
        // Compare pincode
        const isPincodeMatch = survey.pincode.includes(searchFilters.pincode) || !searchFilters.pincode;
  
        // Compare date using dayjs objects
        const isDateMatch = !searchFilters.date || dayjs(survey.date).isSame(searchFilters.date, 'day');
  
        return isPincodeMatch && isDateMatch;
      });
    };
  
    if (surveyType === 'active') {
      setActiveSurveys(filteredSurveys(activeSurveys));
    } else if (surveyType === 'past') {
      setPastSurveys(filteredSurveys(pastSurveys));
    }
  };

  const fetchData=async()=>{
    try {
      const response = await axios.get(config.api.baseUrl+'/inspection/fetch-all/');
      if (response.status === 200) {
        setInitActiveSurveys(response.data.active);
        setInitPastSurveys(response.data.past);
        setActiveSurveys(response.data.active);
        setPastSurveys(response.data.past);
      }
    } catch (error) {
      console.log("Error fetching data.",error);
    }
  }

  useEffect(()=>{
    fetchData();
  },[])

  const handleClearFilters = (str) => {
    if(str === 'active') {
      setSearchFiltersActive({
        pincode: "",
        date: null,
      });
      setActiveSurveys(initActiveSurveys);
    } else if(str === 'past') {
      setSearchFiltersPast({
        pincode: "",
        date: null,
      });
      setPastSurveys(initPastSurveys);
    }
};

  const handleChangePincode = (event,str) => {
    if(str === 'active') {
      setSearchFiltersActive({ ...searchFiltersActive, pincode: event.target.value });
    } else if(str === 'past') {
      setSearchFiltersPast({ ...searchFiltersPast, pincode: event.target.value });
    }
  };

  const handleChangeDate = (newValue,str) => {
    if(str === 'active') {
      setSearchFiltersActive({
        ...searchFiltersActive,
        date: newValue,
      });
    } else if(str === 'past') {
      setSearchFiltersPast({
        ...searchFiltersPast,
        date: newValue,
      });
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 4}} color="primary">
        Dashboard
      </Typography>

      <Stack direction="row" gap={5} alignItems="stretch">
        <Paper sx={{ p: 2, width: 1,minHeight:"65vh" }} elevation={10}>
          <Stack direction="row" gap={2} alignItems="center" justifyContent="space-between">
          <Typography variant="h4" sx={{ p: 1 }}>
            Active Surveys
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 1, mt: 1, mb: 1 }}
            onClick={()=>navigate('/schedule/')} 
          >
            Create Survey
          </Button>
          </Stack>

          <Box mt={2}>
            <Stack direction="row" gap={2} mb={2} alignItems="center" justifyContent="space-around">
            <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={1}>

              <OutlinedInput
                value={searchFiltersActive.pincode}
                size="small"
                onChange={(e)=>handleChangePincode(e,"active")}
                placeholder="Search By Pincode"
                sx={{ width: "38%" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={searchFiltersActive.date}
                  sx={{py:0.1}}
                  slotProps={{ textField: { size: 'small',sx:{width:"34%"} } }}
                  onChange={(e)=>handleChangeDate(e,"active")}
                  renderInput={(props) => (
                    <OutlinedInput {...props} size="small" sx={{ width: "20%" }} />
                  )}
                  placeholder="Search By Date"
                />
              </LocalizationProvider>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={1}>

              <IconButton
                variant="contained"
                color="primary"
                size="medium"
                sx={{border:"1px solid var(--primary-color)"}}
                onClick={() => handleSearch('active')}
                >
                <SearchIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="medium"
                sx={{border:"1px solid var(--primary-color)"}}
                onClick={()=>handleClearFilters("past")}
                >
                <CloseIcon fontSize="inherit" />
              </IconButton>
                </Stack>
            </Stack>


            {activeSurveys.length === 0 ? (
              <Typography variant="h5" sx={{ textAlign: "center", mt: 20 }}>
                No results
              </Typography>
            ) : (
              <Stack direction="row" sx={{ flexWrap: "wrap", maxHeight: "44vh", overflowY: "auto", justifyContent: "space-evenly" }}>
                {activeSurveys.map((survey, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      position: "relative",
                      border: "2px solid var(--primary-color)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 2,
                      gap: 1,
                      minWidth: "32%",
                      maxHeight: "12vh",
                      backgroundColor: "#f9f9f9",
                      m: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": { boxShadow: "0 0 7px 0 var(--primary-color)" },
                    }}
                  >
                    <Typography variant="h5" color="var(--primary-color)" sx={{ fontWeight: 600 }}>
                      {survey.pincode}
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                      <Typography variant="body1">{dayjs(survey.date).format("DD MMMM YYYY")}</Typography>
                      <IconButton variant="outlined" onClick={()=>navigate('/drone-path/'+survey.id)} size="small" sx={{ border: "2px solid var(--primary-color)" }} color="primary">
                        <ArrowForwardIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>

        <Paper sx={{ p: 2, width: 1 }} elevation={10}>
          <Typography variant="h4" sx={{ p: 1 }}>
            Past Surveys
          </Typography>

          <Box mt={2}>
          <Stack direction="row" gap={2} mb={2} alignItems="center" justifyContent="space-around">
            <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={1}>

              <OutlinedInput
                value={searchFiltersPast.pincode}
                size="small"
                onChange={(e)=>handleChangePincode(e,"past")}
                placeholder="Search By Pincode"
                sx={{ width: "38%" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={searchFiltersPast.date}
                  sx={{py:0.1}}
                  slotProps={{ textField: { size: 'small',sx:{width:"34%"} } }}
                  onChange={(e)=>handleChangeDate(e,"past")}
                  renderInput={(props) => (
                    <OutlinedInput {...props} size="small" sx={{ width: "20%" }} />
                  )}
                  placeholder="Search By Date"
                />
              </LocalizationProvider>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={1}>

              <IconButton
                variant="contained"
                color="primary"
                size="medium"
                sx={{border:"1px solid var(--primary-color)"}}
                onClick={() => handleSearch('past')}
                >
                <SearchIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                variant="contained"
                color="primary"
                size="medium"
                sx={{border:"1px solid var(--primary-color)"}}
                onClick={()=>handleClearFilters("past")}
                >
                <CloseIcon fontSize="inherit" />
              </IconButton>
                </Stack>
            </Stack>

            {pastSurveys.length === 0 ? (
              <Typography variant="h5" sx={{ textAlign: "center", mt: 24 }}>
              No results
            </Typography>
            ) : (
              <Stack direction="row" sx={{ flexWrap: "wrap", maxHeight: "44vh", overflowY: "auto", justifyContent: "space-evenly" }}>
                {pastSurveys.map((survey, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      position: "relative",
                      border: "2px solid var(--primary-color)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 2,
                      gap: 1,
                      minWidth: "32%",
                      maxHeight: "12vh",
                      backgroundColor: "#f9f9f9",
                      m: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": { boxShadow: "0 0 7px 0 var(--primary-color)" },
                    }}
                  >
                    <Typography variant="h5" color="var(--primary-color)" sx={{ fontWeight: 600 }}>
                      {survey.pincode}
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
                      <Typography variant="body1">{dayjs(survey.date).format("DD MMMM YYYY")}</Typography>
                      <IconButton variant="outlined" onClick={()=>navigate('/drone-path/'+survey.id)}  size="small" sx={{ border: "2px solid var(--primary-color)" }} color="primary">
                        <ArrowForwardIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Surveys;
