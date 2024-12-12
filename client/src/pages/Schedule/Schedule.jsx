import React, { useState } from "react";


import PinMap from "../../components/PinMap";
import FormModal from "../../components/FormModal";
import { Box, Typography } from "@mui/material";
import config from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Schedule() {
  const [modalOpen, setModalOpen] = useState(false);
  const [regionName, setRegionName] = useState("");
  const navigate = useNavigate();

  const handleShowModal = (name) => {
    setRegionName(name);
    setModalOpen(true);
  };


  const handleCloseModal = () => setModalOpen(false);

  const handleSubmit = async (formData) => {
    try {
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      const date= data.droneDate+"T"+data.droneTime;
      const response = await axios.post(config.api.baseUrl+'/inspection/create/', {
        area_pincode: regionName,
        takeoff: date,
      });
      if (response.status === 201) {
        console.log("Data submitted successfully.");
        console.log(response.data);
        navigate('/drone-path/'+response.data.id);
      }


    } catch (error) {
      console.log("Error submitting data.");
    }
  
  
  };

  return (
    <Box p={2}>
     <Typography variant="h3" fontWeight={600} color="var(--primary-color)" gutterBottom>
               Schedule Survey
    </Typography>
      <PinMap showFormModal={handleShowModal} />
      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        regionName={regionName}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}

export default Schedule;
