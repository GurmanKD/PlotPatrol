import React, { useState } from 'react';
import {
  ExpandMore,
  CheckCircleOutline,
  CancelOutlined,
  Close,
} from '@mui/icons-material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Stack,
  Avatar,
  IconButton,
  Collapse,
} from '@mui/material';

import Compare from './Compare';
import { Build } from '@mui/icons-material';
import MapAreaLock from '../Buildings/Buildings';

const dummyComplaints = [
  {
    description:
      'Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.Complaint about loud noise during nighttime. Complaint about loud noise during nighttime.',
    attachment: ['/me.png', '/me.png'],
    address: '123 Elm Street, Springfield',
    coords: { lat: 40.7128, lng: -74.006 },
    user: {
      name: 'John Doe',
    },
  },
  {
    description: 'Broken streetlight at the main intersection.',
    attachment: ['/me.png'],
    address: '456 Oak Avenue, Springfield',
    coords: { lat: 40.7129, lng: -74.007 },
    user: {
      name: 'Jane Smith',
    },
  },
];

const SatCompare = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [complaints, setComplaints] = React.useState(dummyComplaints);
  const [expanded, setExpanded] = React.useState(-1);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleExpandClick1 = (index) => {
    setExpanded(expanded === index ? -1 : index);
  };
  const handleExpandClick2 = (index) => {
    setExpanded(expanded === index ? -1 : index);
  };

  const handleImageClick1 = (url) => {
    setSelectedImage(url);
  };

  const handleImageClick2 = (url) => {
    setSelectedImage(url);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };
  
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: 4,
        }}
      >
        <Typography
          variant='h3'
          gutterBottom
          sx={{
            color: 'primary.main',
            marginBottom: 4,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          Satellite Image Timeline
        </Typography>

        <Box
          sx={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: 2,
            padding: 2,
            backgroundColor: '#fff',
            boxShadow: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 300,
              border: '1px solid #ccc',
              borderRadius: 2,
              marginBottom: 2,
              backgroundColor: '#eaeaea',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant='body1' sx={{ color: '#666' }}>
              Image Container
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 2,
            }}
          >
            {[1, 2, 3, 4, 5].map((number) => (
              <Button
                key={number}
                variant='outlined'
                sx={{ flex: 1, margin: '0 4px' }}
              >
                {number}
              </Button>
            ))}
          </Box>

          <Button
            variant='contained'
            color='primary'
            onClick={handleOpen}
            sx={{ width: '100%', marginTop: 2 }}
          >
            Show Flag
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
          <DialogContent>
            <Compare />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <MapAreaLock />

      <Box sx={{ padding: 2, borderRadius: 2 }}>
        <Typography
          variant='h3'
          sx={{ fontWeight: 600, mb: 6}}
          color='primary'
        >
          Flags from Complaints
        </Typography>

        <Paper elevation={10} sx={{ width: '100%', p: 3 }}>
          <Stack spacing={2}>
            {complaints.map((complaint, index) => {
              const isExpanded = expanded === index;
              return (
                <React.Fragment key={index}>
                  <Stack
                    direction='row'
                    spacing={2}
                    sx={{
                      px: 2,
                      py: 0.8,
                      background: isExpanded ? '#f5f5f5' : '#f3f3f3',
                      borderRadius: 1,
                      border: isExpanded
                        ? '2px solid var(--primary-color)'
                        : '1px dashed var(--secondary-color)',
                      transition: 'all 0.3s ease',
                    }}
                    alignItems='center'
                  >
                    <Avatar>{complaint.user.name[0]}</Avatar>
                    <Typography variant='body1' sx={{ flexGrow: 1 }}>
                      {complaint.user.name}
                    </Typography>

                    <IconButton
                      size='medium'
                      onClick={() => handleExpandClick1(index)}
                      aria-expanded={isExpanded}
                      aria-label='show more'
                    >
                      {isExpanded ? (
                        <ExpandLessIcon fontSize='inherit' />
                      ) : (
                        <ExpandMore fontSize='inherit' />
                      )}
                    </IconButton>
                  </Stack>

                  <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ pl: 7, pt: 1, mb: 3 }}>
                      <Typography
                        variant='body1'
                        fontSize='16px'
                        color='text.secondary'
                      >
                        {complaint.description}
                      </Typography>
                      <Typography
                        variant='body1'
                        fontSize='15px'
                        mt={1}
                        color='var(--primary-color)'
                      >
                        {complaint.address}
                      </Typography>

                      <Stack direction='row' spacing={2} mt={2}>
                        {complaint.attachment.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Attachment ${idx + 1}`}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 4,
                              cursor: 'pointer',
                            }}
                            onClick={() => handleImageClick1(url)}
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
          <Dialog
            open={Boolean(selectedImage)}
            onClose={handleCloseImageDialog}
          >
            <DialogTitle>
              <IconButton
                aria-label='close'
                onClick={handleCloseImageDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <img
                src={selectedImage}
                alt='Selected'
                style={{ width: '100%', height: 'auto', borderRadius: 4 }}
              />
            </DialogContent>
          </Dialog>
        )}
      </Box>

      <Box sx={{ padding: 2, borderRadius: 2 }}>
        <Typography
          variant='h3'
          sx={{ fontWeight: 600, mb: 6}}
          color='primary'
        >
          Buildings Under Construction
        </Typography>

        <Paper elevation={10} sx={{ width: '100%', p: 3 }}>
          <Stack spacing={2}>
            {complaints.map((complaint, index) => {
              const isExpanded = expanded === index;
              return (
                <React.Fragment key={index}>
                  <Stack
                    direction='row'
                    spacing={2}
                    sx={{
                      px: 2,
                      py: 0.8,
                      background: isExpanded ? '#f5f5f5' : '#f3f3f3',
                      borderRadius: 1,
                      border: isExpanded
                        ? '2px solid var(--primary-color)'
                        : '1px dashed var(--secondary-color)',
                      transition: 'all 0.3s ease',
                    }}
                    alignItems='center'
                  >
                    <Avatar>{complaint.user.name[0]}</Avatar>
                    <Typography variant='body1' sx={{ flexGrow: 1 }}>
                      {complaint.user.name}
                    </Typography>

                    <IconButton
                      size='medium'
                      onClick={() => handleExpandClick2(index)}
                      aria-expanded={isExpanded}
                      aria-label='show more'
                    >
                      {isExpanded ? (
                        <ExpandLessIcon fontSize='inherit' />
                      ) : (
                        <ExpandMore fontSize='inherit' />
                      )}
                    </IconButton>
                  </Stack>

                  <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                    <Box sx={{ pl: 7, pt: 1, mb: 3 }}>
                      <Typography
                        variant='body1'
                        fontSize='16px'
                        color='text.secondary'
                      >
                        {complaint.description}
                      </Typography>
                      <Typography
                        variant='body1'
                        fontSize='15px'
                        mt={1}
                        color='var(--primary-color)'
                      >
                        {complaint.address}
                      </Typography>

                      <Stack direction='row' spacing={2} mt={2}>
                        {complaint.attachment.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Attachment ${idx + 1}`}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 4,
                              cursor: 'pointer',
                            }}
                            onClick={() => handleImageClick2(url)}
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
          <Dialog
            open={Boolean(selectedImage)}
            onClose={handleCloseImageDialog}
          >
            <DialogTitle>
              <IconButton
                aria-label='close'
                onClick={handleCloseImageDialog}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <img
                src={selectedImage}
                alt='Selected'
                style={{ width: '100%', height: 'auto', borderRadius: 4 }}
              />
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default SatCompare;
