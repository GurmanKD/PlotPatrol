import { Box, Stack } from "@mui/material";
import React from "react";
import Navbar from "../components/Navbars/Navbar";
import MainNav from "../components/Navbars/MainNav";

const Dashboard = (props) => {
  return (
    <Stack direction="row" height="100vh">
      <Navbar />

      <Box width={1} sx={{ position:"relative", overflowY: "auto" }}>
		{/* <MainNav /> */}
        <Box  mt={0} px={3} py={1.6}>
          {props.element}
        </Box>
      </Box>
    </Stack>
  );
};

export default Dashboard;
