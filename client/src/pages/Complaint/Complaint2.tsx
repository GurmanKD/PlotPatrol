'use client';

import * as React from 'react';
import { ExpandMore, CheckCircleOutline, CancelOutlined, Close } from '@mui/icons-material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {
  IconButton,
  Avatar,
  Stack,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Collapse,
} from '@mui/material';

const dummyComplaints = [
  {
    description:
      "Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.",
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

export default function Complaint2() {
  const [complaints, setComplaints] = React.useState(dummyComplaints);
  const [expanded, setExpanded] = React.useState(-1);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleExpandClick = (index) => {
    setExpanded(expanded === index ? -1 : index);
  };

  const handleApproval = (index) => {
    console.log(`Complaint approved:`, complaints[index]);
  };

  const handleDisapproval = (index) => {
    console.log(`Complaint disapproved:`, complaints[index]);
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 2 }}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }} color="primary">
        Approve Complaint
      </Typography>

      <Paper elevation={10} sx={{ width: "100%", p: 3 }}>
        <Stack spacing={2}>
          {complaints.map((complaint, index) => {
            const isExpanded = expanded === index;
            return (
              <React.Fragment key={index}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    px: 2,
                    py: 0.8,
                    background: isExpanded ? "#f5f5f5" : "#f3f3f3",
                    borderRadius: 1,
                    border: isExpanded ? "2px solid var(--primary-color)" : "1px dashed var(--secondary-color)",
                    transition: "all 0.3s ease",
                  }}
                  alignItems="center"
                >
                  <Avatar>{complaint.user.name[0]}</Avatar>
                  <Typography variant="body1" sx={{ flexGrow: 1 }}>
                    {complaint.user.name}
                  </Typography>

                  <IconButton
                    color="success"
                    size="small"
                    sx={{ border: "2px solid" }}
                    onClick={() => handleApproval(index)}
                  >
                    <DoneIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    sx={{ border: "2px solid" }}
                    onClick={() => handleDisapproval(index)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    size="medium"
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={isExpanded}
                    aria-label="show more"
                  >
                    {isExpanded ? <ExpandLessIcon fontSize="inherit" /> : <ExpandMore fontSize="inherit" />}
                  </IconButton>
                </Stack>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 7, pt: 1,mb:3 }}>
                    <Typography variant="body1" fontSize="16px" color="text.secondary">
                      {complaint.description}
                    </Typography>
                    <Typography variant="body1" fontSize="15px" mt={1} color="var(--primary-color)">
                      {complaint.address}
                    </Typography>

                    <Stack direction="row" spacing={2} mt={2}>
                      {complaint.attachment.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Attachment ${idx + 1}`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(url)}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Collapse>
              </React.Fragment>
            );
          })}
        </Stack>
      </Paper>

      {selectedImage && (
        <Dialog open={Boolean(selectedImage)} onClose={handleCloseImageDialog}>
          <DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseImageDialog}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <img
              src={selectedImage}
              alt="Selected"
              style={{ width: "100%", height: "auto", borderRadius: 4 }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}
