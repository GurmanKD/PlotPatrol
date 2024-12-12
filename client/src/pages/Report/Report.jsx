import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Carousel from "react-material-ui-carousel";
import Model from "../../components/model";
import axios from "axios";
import config from "../../config";
import MapWithMarkers from "../DronePath/DroneMap";
import DownloadIcon from "@mui/icons-material/Download"; // Import the desired icon
import Compare from "../SatCompare/Compare";


const modelSize = {
  1: 335,
  2: 295,
  3: 290,
  4: 295,
};

const Report = () => {
  const params = useParams();
  const id = params.id;

  const fetchInitialData = async () => {
    try {
      const res = await axios.get(
        config.api.baseUrl + "/inspection/fetch/" + id
      );

      if (res.status === 200) {
        setData(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMapData = async () => {
    try {
      const res = await axios.get(
        config.api.baseUrl + "/inspection/fetch-coords/" + id
      );

      if (res.status === 200) {
        setMapData(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNodeData = async () => {
    try {
      const res = await axios.post(
        config.api.baseUrl + "/inspection/fetch-node-data/",
        {
          node_id: data.nodes[nodeIdx].id,
        }
      );

      console.log(res.data);
      if (res.status === 200) {
        setNodeData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [data, setData] = useState({
    nodes: [],
  });

  const [nodeIdx, setNodeIdx] = useState(-1);
  const [nodeData, setNodeData] = useState([]);
  const [mapData, setMapData] = useState([]);
  useEffect(() => {
    if (nodeIdx !== -1) {
      fetchNodeData();
    }
  }, [nodeIdx]);

  const [loading, setLoading] = useState(false);

  const handleOverallReport = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        config.api.baseUrl + "/inspection/download-report/",
        {
          inspection_id: id,
        }
      );
      setLoading(false);

      if (res.status === 200) {
        const url = res.data.download_url;
        console.log(url);
        window.open(url, "_blank");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handleNodalReport = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        config.api.baseUrl + "/inspection/download-node-report/",
        {
          node_id: data.nodes[nodeIdx].id,
          inspection_id: id,
        }
      );
      setLoading(false);

      if (res.status === 200) {
        const url = res.data.download_url;
        console.log(url);
        window.open(url, "_blank");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const currStage = 3;
  const [stageNum, setStageNum] = useState(currStage);
  const [mode, setMode] = React.useState(1);
  // 1->drone
  // 2->satellite
  // 3->Heatmap
  // 4->3D

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc",
    libraries: ["places"],
  });

  useEffect(() => {
    fetchInitialData();
    fetchMapData();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 4 }} color="primary">
        Survey Report{" "}
        <span style={{ color: "black", fontWeight: 500, fontSize: "32px" }}>
          {" "}
          - {data.area_pincode} | {dayjs(data.date).format("DD MMMM YYYY")}
        </span>
      </Typography>

      <Stack mt={5} direction="row" gap={4}>
        <Paper sx={{ width: "0.25", p: 2, pr: 0.4 }} elevation={6}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, lineHeight: 1, mb: 2 }}
          >
            Path Nodes
          </Typography>

          <Stack
            sx={{
              width: 1,
              height: "38vh",
              overflowY: "auto",
              pr: 2,
            }}
          >
            {data.nodes.map((node, index) => (
              <Box
                key={index}
                sx={{
                  width: 1,
                  py: 0.3,
                  my: 1,
                  textAlign: "center",
                  cursor: "pointer",
                  px: 2,
                  position: "relative",
                  border: "1px solid #ccc",
                  transition: "ease-in-out 0.25s",
                  borderRadius: "8px",
                  color: nodeIdx === index ? "white" : "var(--primary-color)",
                  background:
                    nodeIdx === index ? "var(--primary-color)" : "#f9f9f9",
                }}
                onClick={() => {
                  if (index !== nodeIdx) setNodeIdx(index);
                }}
              >
                <Typography
                  variant="h6"
                  lineHeight={1.3}
                  mb={1}
                  mt={1}
                  fontSize={17}
                  gutterBottom
                >
                  {node.name}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper
          elevation={10}
          sx={{
            p: 2,
            background: "#f5f5f5",
            borderRadius: 2,
            width: 0.52,
          }}
        >
          {nodeIdx === -1 ? (
            <Typography variant="h5" textAlign="center" sx={{ mb: 1, mt: 23 }}>
              Select a node to view details
            </Typography>
          ) : (
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 2, fontWeight: 500, fontSize: "28px" }}
                  color={nodeData[0]?.active ? "#3B6441" : "error"}
                >
                  {nodeData[0]?.active ? "Active" : "InActive"}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mb: 2, fontWeight: 500, fontSize: "28px" }}
                  color={!nodeData[0]?.is_flagged ? "#3B6441" : "error"}
                >
                  {nodeData[0]?.is_flagged ? "Flagged" : "Unflagged"}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                gap={2}
                alignItems="center"
                justifyContent="space-evenly"
                mb={2}
              >
                {nodeData.map((el, i) => {
                  return (
                    <Button
                      key={i}
                      sx={{
                        width: 1,
                        color:
                          i + 1 !== stageNum ? "var(--primary-color)" : "white",
                        borderWidth: "2px",
                        borderRadius: 2,
                        py: 0.6,
                        fontSize: "14px",
                      }}
                      variant={i + 1 === stageNum ? "contained" : "outlined"}
                      onClick={() => {
                        if (i + 1 !== stageNum) setStageNum(i + 1);
                      }}
                    >
                      {i + 1} {nodeData[0]?.active && i === 0 && "(Current)"}
                    </Button>
                  );
                })}
              </Stack>

              <Stack direction="row" alignItems="stretch">
                <Stack
                  alignItems="center"
                  width="25%"
                  justifyContent="space-evenly"
                >
                  <Button
                    sx={{
                      width: 0.9,
                      height: 1,
                      color: mode !== 1 ? "var(--primary-color)" : "white",
                      borderWidth: "2px",
                      borderRadius: 0.7,
                      py: 1,
                      fontSize: "16px",
                    }}
                    variant={mode === 1 ? "contained" : "outlined"}
                    onClick={() => {
                      if (mode !== 1) setMode(1);
                    }}
                  >
                    Drone
                  </Button>

                  <Button
                    sx={{
                      width: 0.9,
                      height: 1,
                      color: mode !== 2 ? "var(--primary-color)" : "white",
                      borderWidth: "2px",
                      borderRadius: 0.7,
                      py: 1,
                      fontSize: "16px",
                    }}
                    variant={mode === 2 ? "contained" : "outlined"}
                    onClick={() => {
                      if (mode !== 2) setMode(2);
                    }}
                  >
                    Satellite
                  </Button>
                  <Button
                    sx={{
                      width: 0.9,
                      height: 1,
                      color: mode !== 3 ? "var(--primary-color)" : "white",
                      borderWidth: "2px",
                      borderRadius: 0.7,
                      py: 1,
                      fontSize: "16px",
                    }}
                    variant={mode === 3 ? "contained" : "outlined"}
                    onClick={() => {
                      if (mode !== 3) setMode(3);
                    }}
                  >
                    Compare Model
                  </Button>
                  <Button
                    sx={{
                      width: 0.9,
                      height: 1,
                      color: mode !== 4 ? "var(--primary-color)" : "white",
                      borderWidth: "2px",
                      borderRadius: 0.7,
                      py: 1,
                      fontSize: "16px",
                    }}
                    variant={mode === 4 ? "contained" : "outlined"}
                    onClick={() => {
                      if (mode !== 4) setMode(4);
                    }}
                  >
                    3D Model
                  </Button>
                </Stack>

                <Box
                  width={1}
                  height="32vh"
                  sx={{ position: "relative", mt: 2, bgcolor: "#f5f5f5" }}
                >
                  {mode === 1 && (
                    <Box>
                      {!nodeData[stageNum - 1]?.images ||
                      Object.values(nodeData[stageNum - 1]?.images).length ===
                        0 ? (
                        <Typography textAlign="center" mt={18}>
                          No images available
                        </Typography>
                      ) : (
                        <Carousel
                          strictIndexing
                          autoPlay={false}
                          cycleNavigation={false}
                          animation="slide"
                          navButtonsAlwaysVisible
                          interval={5000}
                          sx={{
                            width: 1,
                            height: "100%",
                          }}
                        >
                          {Object.values(nodeData[stageNum - 1]?.images).map(
                            (val) => (
                              <Stack
                                key={val}
                                sx={{
                                  width: 1,
                                  height: 1,
                                  bgcolor: "#f5f5f5",
                                  position: "relative",
                                  overflow: "hidden",
                                }}
                                alignItems="center"
                                justifyContent="center"
                              >
                                <img
                                  src={val}
                                  alt="drone"
                                  style={{
                                    maxHeight: "32vh",
                                    width: "auto",
                                    objectFit: "contain",
                                    backgroundColor: "#f5f5f5",
                                    display: "block",
                                    margin: "0 auto",
                                  }}
                                />
                              </Stack>
                            )
                          )}
                        </Carousel>
                      )}
                    </Box>
                  )}

                  {mode === 2 && (
                    <>
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          center={{
                            lat: nodeData[stageNum - 1]?.latitude,
                            lng: nodeData[stageNum - 1]?.longitude,
                          }}
                          zoom={15}
                          options={{
                            mapTypeId: "satellite",
                            disableDefaultUI: true,
                            zoomControl: true,
                          }}
                        >
                          <Marker
                            position={{
                              lat: nodeData[stageNum - 1]?.latitude,
                              lng: nodeData[stageNum - 1]?.longitude,
                            }}
                          />
                        </GoogleMap>
                      ) : loadError ? (
                        <Typography
                          variant="body1"
                          color="error"
                          align="center"
                        >
                          Failed to load map. Please try again.
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <CircularProgress color="primary" />
                        </Box>
                      )}
                    </>
                  )}
                
                  {mode === 3 && (
                    <Modal>
                      <Compare node_id={id}/>
                    </Modal>
                  )}

                  {mode === 4 && (
                    <Box height={1}>
                      <Model
                        stage={stageNum - 1}
                        size={modelSize[stageNum - 1]}
                      />
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
          )}
        </Paper>

        <Stack justifyContent="center" spacing={2}>
          
		  <Button
            variant="outlined"
            color="primary"
            sx={{
              width: 1,
              borderRadius: 1,
              fontWeight: 500,
              fontSize: "18px",
              borderWidth: "2px",
              py: 2,
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1, 
            }}
            disabled={nodeIdx === -1 || loading}
            onClick={handleNodalReport}
          >
            <DownloadIcon /> 
            Nodal Report
          </Button>

		  <Button
            variant="outlined"
            color="primary"
            sx={{
              width: 1,
              borderRadius: 1,
              fontWeight: 500,
              fontSize: "18px",
              borderWidth: "2px",
              py: 2,
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1, 
            }}
            onClick={handleOverallReport}
            disabled={loading}
          >
            <DownloadIcon /> 
             Overall Report
          </Button>
		  
		  


        </Stack>
      </Stack>

      <Stack direction="row" gap={4} mt={4}>
        <Paper sx={{ p: 2, width: 1 }} elevation={6}>
          <Stack
            gap={2}
            width={1}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Paper elevation={10} sx={{ width: 1, p: 2 }}>
              <Typography variant="h2" color="var(--primary-color)">
                {data.total_nodes}
              </Typography>
              <Typography variant="h6">Total Nodes</Typography>
            </Paper>
            <Paper elevation={10} sx={{ width: 1, p: 2 }}>
              <Typography variant="h2" color="var(--primary-color)">
                {data.previous_flags}
              </Typography>
              <Typography variant="h6">Previous Flags</Typography>
            </Paper>
          </Stack>
          <Stack
            gap={2}
            width={1}
            mt={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Paper elevation={10} sx={{ width: 1, p: 2 }}>
              <Typography variant="h2" color="var(--primary-color)">
                {data.builder_projects}
              </Typography>
              <Typography variant="h6">Buildings</Typography>
            </Paper>
            <Paper elevation={10} sx={{ width: 1, p: 2 }}>
              <Typography variant="h4" color="var(--primary-color)">
                {data.complaints}
              </Typography>
              <Typography variant="h6">Complaints</Typography>
            </Paper>
          </Stack>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            width: 1,
            overflow: "hidden",
          }}
        >
          <Typography variant="h5" sx={{ p: 2 }}>
            Drone Path
          </Typography>

          <Box sx={{ height: "calc(100% - 48px)" }}>
            <MapWithMarkers locations={mapData} />
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default Report;
