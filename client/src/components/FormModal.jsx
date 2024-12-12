import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const FormModal = ({ isOpen, onClose, regionName, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Schedule Survey</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <TextField
              label="Upload Approved Plan (JPG)"
              type="file"
              name="approvedPlan"
              accept="image/jpeg"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Date of Drone Swarm"
              type="date"
              name="droneDate"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time of Drone Swarm"
              type="time"
              name="droneTime"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth required>
              <InputLabel id="monitor-dl">Monitor Data for Last</InputLabel>
              <Select
                name="monitorYears"
                label="Monitor Data for Last"
                id="monitorYears"
                labelId="MonitorDL"
              >
                <MenuItem value="1">1 Year</MenuItem>
                <MenuItem value="2">2 Years</MenuItem>
                <MenuItem value="3">3 Years</MenuItem>
                <MenuItem value="4">4 Years</MenuItem>
                <MenuItem value="5">5 Years</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormModal;
