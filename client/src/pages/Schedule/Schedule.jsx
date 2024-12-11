import React, { useState } from "react";


import PinMap from "../../components/PinMap";
import FormModal from "../../components/FormModal";
import { Box, Typography } from "@mui/material";

function Schedule() {
  const [modalOpen, setModalOpen] = useState(false);
  const [regionName, setRegionName] = useState("");

  const handleShowModal = (name) => {
    setRegionName(name);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("https://your-api-endpoint.com/schedule", {
        method: "POST",
        body: formData,
      });
      if (response.ok) alert("Data submitted successfully!");
      else alert("Submission failed.");
    } catch (error) {
      alert("Error submitting data.");
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
