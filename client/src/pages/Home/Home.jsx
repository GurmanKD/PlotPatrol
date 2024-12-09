import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Carousel from "react-material-ui-carousel";
import { Close } from "@mui/icons-material";
import ComplaintLog from "./ComplaintLog";

const Home = () => {
  const building = "Building Name";
  const address = "21 Rohini, Delhi";
  const coords = { lat: 30.3515615, lng: 73.3622106 };

  const [popupMode, setPopupMode] = React.useState(-1);
  // 1->images
  // 2->complaints
  // 3->3d model

  const status = 2;
  const currStage = 3;
  const [stageNum, setStageNum] = React.useState(3);
  const stage = "Construction";

  const [mode, setMode] = React.useState(1);
  // 1->drone
  // 2->satellite
  // 3->Heatmap
  // 4->3D

  const [review, setReview] = React.useState("");

  const droneImgs = ["/me.png", "/me.png", "/me.png", "/me.png", "/me.png"];
  const originalImgs = ["/me.png", "/me.png", "/me.png", "/me.png", "/me.png"];


  const complaints=[
    {
      description:
        "Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaiut loud noise during nighttime.",
      attachment: ["/me.png", "/me.png"],
      address: "123 Elm Street, Springfield",
      coords: { lat: 40.7128, lng: -74.006 },
      user: {
        name: "John Doe",
      },
    },
    {
      description: "Broken streetlight at the main intersection.",
      attachment: ["/me.png"],
      address: "456 Oak Avenue, Springfield",
      coords: { lat: 40.7129, lng: -74.007 },
      user: {
        name: "Jane Smith",
      },
    },
  ];



  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc",
  });

  return (
    <Box sx={{ p: 5 }}>
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        mb={2}
      >
        <Box>
          <Typography variant="h3" color="primary.main">
            {building}
          </Typography>
          <Typography variant="h6" color="text.secondary" pl={1}>
            {address}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 5, py: 1, fontSize: "16px", color: "white" }}
        >
          View Previous
        </Button>
      </Stack>

      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="center"
        gap={6}
        width={1}
      >
        <Box width={0.7}>
          <Paper
            elevation={10}
            sx={{
              p: 2,
              mb: 3,
              background: "#f5f5f5",
              borderRadius: 2,
              width: "100%",
              height: "40vh",
            }}
          >
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={coords}
                zoom={15}
                options={{
                  mapTypeId: "roadmap",
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                <Marker position={coords} />
              </GoogleMap>
            ) : loadError ? (
              <Typography variant="body1" color="error" align="center">
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
          </Paper>

          <Paper sx={{ w: 1, background: "#f5f5f5", p: 2 }} elevation={8}>
            <Stack
              direction="row"
              alignItems="stretch"
              justifyContent="space-evenly"
              gap={2}
            >
              <Box
                sx={{
                  width: 1,
                  background:
                    status === 1 ? "red" : status === 2 ? "#ff7000" : "green",

                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <Typography textAlign="center" variant="h6" color="white">
                  Status
                </Typography>

                <Typography textAlign="center" variant="body1" color="White">
                  {status === 1
                    ? "Under Review"
                    : status === 2
                    ? "Wrapping Up"
                    : " Clear "}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 1,
                  border: "2px solid var(--primary-color)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <Typography textAlign="center" variant="h6">
                  Stage
                </Typography>
                <Typography
                  textAlign="center"
                  variant="body1"
                  color="var(--primary-color)"
                >
                  {stage}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 1,
                  border: "2px solid var(--primary-color)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": {
                    background: "var(--primary-color)",
                    color: "white",
                  },
                  transition: "0.25s ease-in-out",
                }}
              >
                <Typography
                  textAlign="center"
                  sx={{ fontSize: "18px" }}
                  variant="h6"
                >
                  View Original 3D model
                </Typography>
              </Box>
            </Stack>

            <Stack
              mt={2}
              direction="row"
              alignItems="stretch"
              justifyContent="space-evenly"
              gap={2}
            >
              <Box
                onClick={() => setPopupMode(2)}
                sx={{
                  width: 1,
                  border: "2px solid var(--primary-color)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": {
                    background: "var(--primary-color)",
                    color: "white",
                  },
                  transition: "0.25s ease-in-out",
                }}
              >
                <Typography
                  textAlign="center"
                  sx={{ fontSize: "18px" }}
                  variant="h6"
                >
                  {" "}
                  View Complaint Log
                </Typography>
              </Box>

              <Box
                onClick={() => setPopupMode(1)}
                sx={{
                  width: 1,
                  border: "2px solid var(--primary-color)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": {
                    background: "var(--primary-color)",
                    color: "white",
                  },
                  transition: "0.25s ease-in-out",
                }}
              >
                <Typography
                  textAlign="center"
                  sx={{ fontSize: "18px" }}
                  variant="h6"
                >
                  View Original Pictures
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 1,
                  border: "2px solid var(--primary-color)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                tbd
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Stack width={1}>
          <Paper
            elevation={8}
            sx={{
              width: 1,
              borderRadius: 2,
              px: 2,
              py: 1,
              mb: 2,
              background:
                status === 1 ? "red" : status === 2 ? "#ff7000" : "green",
            }}
          >
            <Typography textAlign="center" color="white" variant="h6">
              Building Stage :
              <span
                style={{ fontSize: "16px", fontWeight: 400, marginLeft: "2%" }}
              >
                {stage}
              </span>
            </Typography>
          </Paper>

          <Paper
            elevation={10}
            sx={{
              p: 2,
              background: "#f5f5f5",
              borderRadius: 2,
              width: 1,
            }}
          >
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              justifyContent="space-evenly"
              mb={2}
            >
              {[1, 2, 3, 4, 5, 6].map((el) => {
                return (
                  <Button
                    key={el}
                    sx={{
                      width: 1,
                      color: el !== stageNum ? "var(--primary-color)" : "white",
                      borderWidth: "2px",
                      borderRadius: 2,
                      py: 0.6,
                      fontSize: "14px",
                    }}
                    variant={el === stageNum ? "contained" : "outlined"}
                    disabled={el > currStage}
                    onClick={() => {
                      if (el !== stageNum) setStageNum(el);
                    }}
                  >
                    {el}
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
                  HeatMap
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
                    {!droneImgs || droneImgs.length === 0
                      ? null
                      : droneImgs.map((val) => (
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
                        ))}
                  </Carousel>
                )}

                {mode === 2 && (
                  <>
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={coords}
                        zoom={15}
                        options={{
                          mapTypeId: "satellite",
                          disableDefaultUI: true,
                          zoomControl: true,
                        }}
                      >
                        <Marker position={coords} />
                      </GoogleMap>
                    ) : loadError ? (
                      <Typography variant="body1" color="error" align="center">
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

                {mode === 3 && <Box></Box>}
              </Box>
            </Stack>
          </Paper>

          <Paper
            elevation={8}
            sx={{
              width: 1,
              borderRadius: 2,
              p: 2,
              mt: 3,
            }}
          >
            <Stack direction="row" gap={2} alignItems="stretch">
              <Stack width={1}>
                <TextField
                  variant="outlined"
                  label="Leave your review"
                  multiline
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1, alignSelf: "flex-end", color: "white", px: 4 }}
                >
                  Submit
                </Button>
              </Stack>

              <Divider orientation="vertical" flexItem />

              <Stack
                width={0.3}
                height={1}
                mt={3}
                alignItems="center"
                justifyContent="space-evenly"
              >
                <Button
                  fullWidth
                  sx={{ py: 2, color: "white", borderRadius: 2, my: 1 }}
                  variant="contained"
                  color="success"
                >
                  Approve
                </Button>
                <Button
                  fullWidth
                  sx={{ py: 2, color: "white", borderRadius: 2, my: 1 }}
                  variant="contained"
                  color="error"
                >
                  Hold
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>

    
    
    
    
      {popupMode === 1 && (
        <Dialog
          open={popupMode === 1}
          onClose={() => setPopupMode(-1)}
          sx={{
            "& .MuiDialog-paper": {
              width: "40%", // Set the dialog width to 45%
              maxWidth: "40%",
              height: "68vh",
            },
          }}
        >
          {" "}
          <DialogTitle>
            <Typography variant="h4" color="var(--primary-color)" fontWeight={600} >
              Original Pictures
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setPopupMode(-1)}
              sx={{ position: "absolute", right: 8, top: 8, zIndex: 1000 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ width: 1 }}>
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
              {!originalImgs || originalImgs.length === 0
                ? null
                : originalImgs.map((val) => (
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
                          maxHeight: "66vh",
                          width: "auto",
                          objectFit: "contain",
                          backgroundColor: "#f5f5f5",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </Stack>
                  ))}
            </Carousel>
          </DialogContent>
        </Dialog>
      )}
    
    
      {popupMode === 2 && (
        <Dialog
          open={popupMode === 2}
          onClose={() => setPopupMode(-1)}
          sx={{
            "& .MuiDialog-paper": {
              width: "40%",
              maxWidth: "40%",
              height: "68vh",
            },
          }}
        >
          {" "}
          <DialogTitle>
            <Typography variant="h4" color="var(--primary-color)" fontWeight={600} >
              Complaint Log
            </Typography>
            <IconButton
              aria-label="close"
              onClick={() => setPopupMode(-1)}
              sx={{ position: "absolute", right: 8, top: 8, zIndex: 1000 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ width: 1 }}>
            <ComplaintLog complaints={complaints} />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default Home;
