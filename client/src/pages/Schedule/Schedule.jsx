import React, { useState } from "react";


import PinMap from "../../components/PinMap";
import FormModal from "../../components/FormModal";
import { Typography } from "@mui/material";

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
    <>
     <Typography variant="h4" gutterBottom>
               Schedule Survey
    </Typography>
      <PinMap showFormModal={handleShowModal} />
      <FormModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        regionName={regionName}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default Schedule;
