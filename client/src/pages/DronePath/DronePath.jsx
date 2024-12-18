import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PincodeMap from "./PincodeMap";
import { Add } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { getPlacesInPincode } from "./PinCodePlaces";
import axios from "axios";
import config from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import MapWithMarkers from "./DroneMap";

const DronePath = () => {
  const params = useParams();
  const id = params.id;
  const [pincode, setPincode] = useState("");
  const [mode, setMode] = useState(1);
  // 1--> Buildings (Registered by builders)
  // 2--> Complaints
  // 3--> Places

  const navigate=useNavigate();

  const [data, setData] = useState({
    1: [],
    2: [],
    3: [],
  });

  const [nodeList, setNodeList] = useState([]);

  const apiKey = "AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc";

  const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined") {
        resolve(); // Already loaded
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Google Maps API"));

      document.head.appendChild(script);
    });
  };

  const fetchPlaces = async () => {
    try {
      await loadGoogleMapsAPI();
      const res = await getPlacesInPincode(pincode, apiKey);
      const uniquePlaces = res.filter(
        (item) => !nodeList.some((node) => node.name === item.name)
      );

      const shuffledPlaces = uniquePlaces.sort(() => Math.random() - 0.5);

      const randomPlaces = shuffledPlaces.slice(0, 20);

      const transformedPlaces = randomPlaces.map((place) => ({
        ...place,
        latitude: place.lat,
        longitude: place.lng,
        builder:"",
      }));

      setData((prevData) => ({
        ...prevData,
        3: transformedPlaces,
      }));
    } catch (error) {
      console.error(error);
    }
  };


  const fetchInitialData = async () => {
    try {
      const res = await axios.post(
        config.api.baseUrl + "/inspection/fetch-building-complaints/",
        {
          area_pincode: pincode,
          inspection_id: id,
        }
      );

      if (res.status === 200) {
        const data = res.data;
        setData((prevData) => ({
          ...prevData,
          1: data[1],
          2: data[2],
        }));
        console.log(data[3]);
        setNodeList(data[3]);
        setLocations(nodeList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPincode = async () => {
    try {
      const res = await axios.get(
        config.api.baseUrl + "/inspection/fetch/" + id
      );

      if (res.status === 200) {
        if(res.data.is_path_finalized){
          navigate('/survey-report/'+id);
        }
        setPincode(res.data.area_pincode);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPincode();
    fetchInitialData();
    fetchPlaces();
  }, [pincode]);

  const handleAddNode = async (data) => {
    try {
      const res = await axios.post(
        config.api.baseUrl + "/inspection/add-node/",
        {
          data: data,
          area_pincode: pincode,
          inspection_id: id,
        }
      );

      if (res.status === 200) {

        fetchInitialData();
        fetchPlaces();
        setLocations([...locations, { lat: res.data.lat, lng: res.data.lng }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNode = async (idx) => {
    try {
      const res = await axios.post(
        config.api.baseUrl + "/inspection/remove-node/",
        {
          node_id: idx,
          inspection_id: id,
        }
      );

      if (res.status === 200) {
        fetchInitialData();
        fetchPlaces();
        removeLocation(res.data)
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [locations, setLocations] = useState(nodeList);



  const removeLocation = ({ lat, lng }) => {
    const newLocations = locations.filter(location => !(location.lat === lat && location.lng === lng));
    setLocations(newLocations);
  };


  const [loading,setLoading]=useState(false);
  const handleLockButton=async()=>{
    try {
      setLoading(true);
      const res = await axios.post(
        config.api.baseUrl + "/inspection/finalize-path/",
        {
        inspection_id: id,
        }
      );
      setLoading(false);
  
      if (res.status === 200) {
        navigate("/survey-report/"+id);
      }
      } catch (error) {
      setLoading(false);
      console.error(error);
      }
    }

  return (
    <Box p={2}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }} color="primary">
        Drone Paths Survey{" "}
        <span style={{ color: "black", fontWeight: 500, fontSize: "36px" }}>
          {" "}
          - {pincode}
        </span>
      </Typography>
     

      <Stack direction="row" gap={4} alignItems="stretch" mt={5}>
        <Paper elevation={6} sx={{ p: 2, width: 1, background: "#f5f5f5" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="flex-end">
              <Button
                sx={{
                  fontSize: "16px",
                  minWidth: "10%",
                  borderWidth: "2px",
                  borderRadius: 0,
                }}
                variant={mode === 1 ? "contained" : "outlined"}
                onClick={() => {
                  if (mode !== 1) setMode(1);
                }}
              >
                Buildings
              </Button>
              <Button
                sx={{
                  fontSize: "16px",
                  minWidth: "10%",
                  borderWidth: "2px",
                  borderRadius: 0,
                }}
                variant={mode === 2 ? "contained" : "outlined"}
                onClick={() => {
                  if (mode !== 2) setMode(2);
                }}
              >
                Complaints
              </Button>
              <Button
                sx={{
                  fontSize: "16px",
                  minWidth: "10%",
                  borderWidth: "2px",
                  borderRadius: 0,
                }}
                variant={mode === 3 ? "contained" : "outlined"}
                onClick={() => {
                  if (mode !== 3) setMode(3);
                }}
              >
                Places
              </Button>
            </Stack>
          </Stack>
          <Stack sx={{ border: "2px solid var(--primary-color)", py: 1 }}>
            {data[mode].length === 0 ? (
              <Typography
                variant="h6"
                textAlign="center"
                color="var(--primary-color)"
                my={19.5}
              >
                No data available
              </Typography>
            ) : (
              <Stack
                alignItems="center"
                width={1}
                sx={{ overflowY: "auto", py: 2 }}
                height="38vh"
              >
                {data[mode].map((item, index) => (
                  <Stack
                    direction="row"
                    key={index}
                    sx={{
                      border: "1px solid #797979",
                      background: "#f5f5f5",
                      borderRadius: 1,
                      width: 0.9,
                      px: 3,
                      py: 0.7,
                      my: 1,
                    }}
                    alignItems="flex-end"
                    justifyContent="space-between"
                    gap={2}
                  >
                    <Box>
                      <Typography lineHeight={1.3} fontSize="20px" variant="h6">
                        {item.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        lineHeight={1}
                        fontWeight={600}
                        mt="3px"
                        fontSize="13px"
                        color="var(--primary-color)"
                      >
                        {mode === 1
                          ? item.builder
                          : mode === 2
                          ? item.complaint_category
                          : item.type}
                      </Typography>
                    </Box>

                    <IconButton
                      color="primary"
                      size="small"
                      sx={{ border: "2px solid" }}
                      onClick={() => {
                        handleAddNode(item);
                      }}
                    >
                      <Add fontSize="inherit" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>

        <Paper elevation={6} sx={{ p: 2, width: 1 }}>
          <Typography variant="h5" sx={{ lineHeight: 1, mb: 0.2 }}>
            Nodes in Drone Path
          </Typography>

          <Stack
            direction="row"
            alignItems="stretch"
            gap={1}
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              sx={{
                width: 0.8,
                border: "2px solid var(--primary-color)",
                p: 1,
                mt: 2,
              }}
            >
              {nodeList.length === 0 ? (
                <Typography
                  variant="h6"
                  width={1}
                  textAlign="center"
                  color="var(--primary-color)"
                  my={19.5}
                >
                  No data available
                </Typography>
              ) : (
                <Stack
                  direction="row"
                  sx={{
                    flexWrap: "wrap",
                    height: "38vh",
                    overflowY: "auto",
                    alignItems: "stretch",
                    justifyContent: "space-evenly",
                  }}
                >
                  {nodeList.map((node, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: 2,
                        minWidth: 200,
                        maxWidth: 300,
                        maxHeight: "23vh",
                        backgroundColor: "#f9f9f9",
                        m: 1.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteNode(node.id)}
                        sx={{
                          position: "absolute",
                          top: 1,
                          right: 1,
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="h6"
                        lineHeight={1.3}
                        mb={1}
                        mt={1}
                        gutterBottom
                      >
                        {node.name}
                      </Typography>
                      <Typography
                        color="var(--primary-color)"
                        fontWeight={600}
                        variant="body2"
                      >
                        {`${node?.lat?.toFixed(6)}, ${node?.lng?.toFixed(6)}`}
                      </Typography>

                      <Box
                        sx={{
                          border: "2px solid var(--primary-color)",
                          borderRadius: 4,
                          width: "fit-content",
                          px: 2,
                          mt: 1,
                        }}
                      >
                        <Typography
                          textAlign="center"
                          fontWeight={600}
                          variant="body2"
                        >
                          {node.type}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
            
            <Button variant="contained" color="misc" sx={{color:"white",height:"40.1vh",width:0.2,borderRadius:1,mt:2,fontWeight:600, fontSize:"22px"}} disabled={loading} onClick={handleLockButton}>
              Lock<br/>Path
            </Button>

          </Stack>
        </Paper>
      </Stack>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          height: "35vh",
          mt:4,
        }}
      >
        {/* Left Section - Video Stream */}
        <Paper
          elevation={3}
          sx={{
            width: "43%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Typography variant="h5" sx={{ p: 2 }}>
            Drone Footage
          </Typography>
          <Box
            component="iframe"
            sx={{
              width: "100%",
              height: "calc(100% - 48px)", // Subtract header height
              border: "none",
            }}
            src="rtsp://192.168.1.1:7070/webcam.sdp"
          />
        </Paper>

        {/* Right Section - Map */}
        <Paper
          elevation={3}
          sx={{
            width: "55%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Typography variant="h5" sx={{ p: 2 }}>
            Drone Path
          </Typography>
          <Box sx={{ height: "calc(100% - 48px)" }}>
            <MapWithMarkers locations={locations}/>
          </Box>
        </Paper>
      </Box>

    </Box>
  );
};

export default DronePath;
