import React from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Carousel from "react-material-ui-carousel";
import Model from '../../components/model';

const modelSize={
	1:335,
	2:295,
	3:290,
	4:295
  }

const Report = () => {
  const params = useParams();
  const id = params.id;
  const [pincode, setPincode] = useState("");
  const [date, setDate] = useState("");

  const fetchPincode = async () => {
    try {
      const res = await axios.get(
        config.api.baseUrl + "/inspection/fetch/" + id
      );

      if (res.status === 200) {
        setPincode(res.data.area_pincode);
        setDate(res.data.date);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const [data,setData]=useState({
	total_nodes:25,
	previous_flags:2,
	builder_projects:4,
	complaints:5,
	nodes:[
		{id:"ghjkjhjklkj",name:"1bnbnbvbh"},
		{id:"ghjkjhjklka",name:"1bnbnbvbh"},
		{id:"ghjkjhjklkd",name:"1bnbnbvbh"},
		{id:"ghjkjhjklkf",name:"1bnbnbvbh"},
		{id:"ghjkjhjklkv",name:"1bnbnbvbh"},
		{id:"ghjkjhjk",name:"1bnbnbvbh"},
		{id:"lkv",name:"1bnbnbvbh"},
	]
  })

  const [nodeIdx,setNodeIdx]=useState(-1);
  const coords = { lat: 30.3515615, lng: 73.3622106 };
  const [nodeData,setNodeData]=useState({

  })
  const droneImgs = {
    1:["https://i.ibb.co/zZH85d0/Whats-App-Image-2024-12-09-at-21-01-45-ca32ec1e.jpg",],
    2:["https://i.ibb.co/rQs5V25/Whats-App-Image-2024-12-09-at-21-00-07-d9e90c9e.jpg"],
    3:["https://i.ibb.co/pd1VPs0/Whats-App-Image-2024-12-09-at-20-57-11-a9ba30b0.jpg",],
    4:["https://i.ibb.co/7rBwChg/Whats-App-Image-2024-12-09-at-20-44-48-8ef2472b.jpg"],

  };

  const currStage=3;
  const [stageNum,setStageNum]=useState(currStage);
  const [mode, setMode] = React.useState(1);
  // 1->drone
  // 2->satellite
  // 3->Heatmap
  // 4->3D


  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAbclwHdrmNLwoUpd-6qTiD8uF6-95gxxc",
    libraries: ['places'],
  });

  useEffect(() => {
    // fetchPincode()
    // fetchInitialData();
  }, [pincode]);

  return (
    <Box p={2}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }} color="primary">
        Survey Report{" "}
        <span style={{ color: "black", fontWeight: 500, fontSize: "36px" }}>
          {" "}
          - {pincode} | {dayjs(date).format("DD MMMM YYYY")}
        </span>
      </Typography>

      <Stack direction="row" gap={4}>
        <Paper sx={{ p: 2, width: 1 }} elevation={6}>
			<Stack gap={2} width={1} direction="row" alignItems="center" justifyContent="space-between">
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.total_nodes}</Typography>
					<Typography variant="h6" >Total Nodes</Typography>
				</Paper>
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.previous_flags}</Typography>
					<Typography variant="h6" >Previous Flags</Typography>
				</Paper>
			</Stack>
			<Stack gap={2} width={1} mt={2} direction="row" alignItems="center" justifyContent="space-between">
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.builder_projects}</Typography>
					<Typography variant="h6" >Buildings</Typography>
				</Paper>
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.complaints}</Typography>
					<Typography variant="h6" >Complaints</Typography>
				</Paper>
			</Stack>
        </Paper>
        <Paper sx={{ p: 2, width: 1 }} elevation={6}></Paper>
      </Stack>

		<Stack mt={3} direction="row" gap={4}>
			<Paper sx={{width:"0.25",p:2,pr:0.4}} elevation={6}>
			<Typography variant="h4" sx={{ fontWeight:600,lineHeight: 1, mb: 1 }}>
            Nodes
          </Typography>

			<Stack
                  sx={{
					width:1,
                    height: "38vh",
                    overflowY: "auto",
					pr:2,
                  }}
                >
                  {data.nodes.map((node, index) => (
                    <Box
                      key={index}
                      sx={{
						width:1,
						py:0.5,
						my:1,
						textAlign:"center",
						cursor:"pointer",
						px:2,
                        position: "relative",
                        border: "1px solid #ccc",
						transition:"ease-in-out 0.25s",
                        borderRadius: "8px",
						color:nodeIdx===index?"white":"var(--primary-color)",
						background:nodeIdx===index?"var(--primary-color)":"#f9f9f9",
                      }}
					  onClick={()=>{if(index!==nodeIdx)setNodeIdx(index)}}
                    >
                      <Typography
                        variant="h6"
                        lineHeight={1.3}
                        mb={1}
                        mt={1}
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
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              justifyContent="space-evenly"
              mb={2}
            >
              {[1, 2, 3, 4, ].map((el) => {
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
                    {!droneImgs[stageNum] || droneImgs[stageNum].length === 0
                      ? null
                      : droneImgs[stageNum].map((val) => (
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


                {mode === 4 && 
                  <Box height={1}>
                    <Model stage={stageNum} size={modelSize[stageNum]}/>
                  </Box>
                }
              </Box>
            </Stack>
          </Paper>


		</Stack>
		

    </Box>
  );
};

export default Report;
