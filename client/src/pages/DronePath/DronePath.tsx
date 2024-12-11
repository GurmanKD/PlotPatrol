import React, { useState } from "react";
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

const DronePath = () => {
  const [mode, setMode] = useState(1);
  // 1--> Buildings (Registered by builders)
  // 2--> Complaints
  // 3--> Places

  const data = {
    1: [
      {
        name: "Greenfield High School",
        builder: "Ravi Mehta",
        complaint_category: "Noise Complaint",
        lat: 28.5355,
        lng: 77.391,
        type: "School",
      },
      {
        name: "Sunshine Academy",
        builder: "Neha Sharma",
        complaint_category: "",
        lat: 28.7041,
        lng: 77.1025,
        type: "School",
      },
      {
        name: "Harmony Public School",
        builder: "Ansh Sehrawat",
        complaint_category: "Pavement Issue",
        lat: 19.076,
        lng: 72.8777,
        type: "School",
      },
      {
        name: "Little Star School",
        builder: "Arjun Kapoor",
        complaint_category: "",
        lat: 12.9716,
        lng: 77.5946,
        type: "School",
      },
      {
        name: "Rainbow Kids School",
        builder: "Ravi Mehta",
        complaint_category: "Waterlogging",
        lat: 22.5726,
        lng: 88.3639,
        type: "School",
      },
    ],
    2: [
      {
        name: "Sunnyvale Residency",
        builder: "Neha Sharma",
        complaint_category: "Extended Pavement",
        lat: 19.076,
        lng: 72.8777,
        type: "Residential",
      },
      {
        name: "Blue Ridge Apartments",
        builder: "",
        complaint_category: "Extra Floor",
        lat: 28.5355,
        lng: 77.391,
        type: "Residential",
      },
      {
        name: "Maple Grove Apartments",
        builder: "Arjun Kapoor",
        complaint_category: "Inside Parking",
        lat: 12.9716,
        lng: 77.5946,
        type: "Residential",
      },
      {
        name: "Green Valley Residency",
        builder: "Ravi Mehta",
        complaint_category: "Encroachment on Public Property",
        lat: 28.7041,
        lng: 77.1025,
        type: "Residential",
      },
      {
        name: "Hilltop Residency",
        builder: "Neha Sharma",
        complaint_category: "Extended Balcony",
        lat: 22.5726,
        lng: 88.3639,
        type: "Residential",
      },
    ],
    3: [
      {
        name: "Harmony Business Park",
        builder: "Arjun Kapoor",
        complaint_category: "",
        lat: 12.9716,
        lng: 77.5946,
        type: "Commercial",
      },
      {
        name: "Blue Horizon Offices",
        builder: "Ravi Mehta",
        complaint_category: "Noise Complaint",
        lat: 28.5355,
        lng: 77.391,
        type: "Commercial",
      },
      {
        name: "Green Public School",
        builder: "",
        complaint_category: "",
        lat: 28.7041,
        lng: 77.1025,
        type: "School",
      },
      {
        name: "tata Steels & Co.",
        builder: "Neha Sharma",
        complaint_category: "Pavement Issue",
        lat: 19.076,
        lng: 72.8777,
        type: "Industry",
      },
      {
        name: "Emerald Business Hub",
        builder: "Arjun Kapoor",
        complaint_category: "Power Outage",
        lat: 22.5726,
        lng: 88.3639,
        type: "Commercial",
      },
      {
        name: "Golden Valley Public School",
        builder: "",
        complaint_category: "Waterlogging",
        lat: 12.9716,
        lng: 77.5946,
        type: "School",
      },
    ],
  };

  const [nodeList, setNodeList] = useState([
    {
      name: "Sunnyvale Residency",
      builder: "Neha Sharma",
      complaint_category: "Extended Pavement",
      lat: 19.076,
      lng: 72.8777,
      type: "Residential",
    },
    {
      name: "Blue Ridge Apartments",
      builder: "",
      complaint_category: "Extra Floor",
      lat: 28.5355,
      lng: 77.391,
      type: "Residential",
    },
    {
      name: "Maple Grove Apartments",
      builder: "Arjun Kapoor",
      complaint_category: "Inside Parking",
      lat: 12.9716,
      lng: 77.5946,
      type: "Residential",
    },
    {
      name: "Green Valley Residency",
      builder: "Ravi Mehta",
      complaint_category: "Encroachment on Public Property",
      lat: 28.7041,
      lng: 77.1025,
      type: "Residential",
    },
    {
      name: "Hilltop Residency",
      builder: "Neha Sharma",
      complaint_category: "Extended Balcony",
      lat: 22.5726,
      lng: 88.3639,
      type: "Residential",
    },
  ]);

  const handleRemove = (index) => {
    setNodeList(nodeList.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          height: "35vh",
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
          <Typography variant="h6" sx={{ p: 1 }}>
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
          <Typography variant="h6" sx={{ p: 1 }}>
            Drone Path
          </Typography>
          <Box sx={{ height: "calc(100% - 48px)" }}>
            <PincodeMap pincode="110081" />
          </Box>
        </Paper>
      </Box>

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
            <Button size="small" variant="contained">
              Add All
            </Button>
          </Stack>
          <Stack sx={{ border: "2px solid var(--primary-color)", py: 1 }}>
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
                >
                  <Box>
                    <Typography lineHeight={1} fontSize="20px" variant="h6">
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
                    onClick={() => {}}
                  >
                    <Add fontSize="inherit" />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Paper>

        <Paper elevation={6} sx={{ p: 2, width: 1 }}>
          <Typography variant="h5" sx={{ lineHeight: 1, mb: 0.2 }}>
            Nodes in Drone Path
          </Typography>

          <Stack direction="row" sx={{ border:"2px solid var(--primary-color)" ,p:1,mt:2}}>
          <Stack direction="row" sx={{ flexWrap: "wrap",height:"38vh",overflowY
:"auto"
		  }}>
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
                  backgroundColor: "#f9f9f9",
				  m:1.5
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleRemove(index)}
                  sx={{
                    position: "absolute",
                    top: 1,
                    right: 1,
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <Typography variant="h6" lineHeight={1} mb={1} mt={1} gutterBottom>
                  {node.name}
                </Typography>
                <Typography color="var(--primary-color)" fontWeight={600} variant="body2">
				{`${node.lat.toFixed(6)}, ${node.lng.toFixed(6)}`}
                </Typography>

				<Box sx={{border:"2px solid var(--primary-color)",borderRadius:4,width:"fit-content",px:2,mt:1}}>
                <Typography textAlign="center" fontWeight={600} variant="body2">
                	{node.type}
                </Typography>
				</Box>
              </Box>
            ))}
          </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default DronePath;
