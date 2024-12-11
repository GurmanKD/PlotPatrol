'use client';

import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import GoogleMapInput from './GoogleMapInput';
import { Box } from '@mui/system';

export default function Complaint() {
  const [complaint, setComplaint] = React.useState({
    description: '',
    attachment: [],
    address: '',
    coords: undefined,
  });

  console.log(complaint);

  const [files, setFiles] = React.useState([]);

  const handleComplaint = (event) => {
    setComplaint({ ...complaint, [event.target.name]: event.target.value });
  };

  const handleFile = (event) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  };

  const handleReset = () => {
    setComplaint({ description: '', attachment: [], address: '', coords: undefined });
    setFiles([]);
  };

  const handleAddressChange = ({ coords, address }) => {
    setComplaint((prev) => ({ ...prev, address, coords }));
  };

  return (
	<Box sx={{ padding: 2, borderRadius: 2  }}>
    
    <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }} color='primary'>
      Register Complaint
    </Typography>
    
    <Paper elevation={10} sx={{ padding: 4, width:"100%" }}>
      <Stack spacing={4} >


     
      <Box width={"70%"} sx={{ border: "1px dashed var(--secondary-color)",borderRadius: 2 }}>
        <GoogleMapInput onChange={handleAddressChange} onUseCurrentLocation={undefined} onPlaceSelected={undefined} />
      </Box>
      
      <TextField
        id="outlined-description"
        label="Description"
        variant="outlined"
        name="description"
        value={complaint.description}
        onChange={handleComplaint}
        multiline
        rows={6}
        fullWidth
      />


      <label htmlFor="file-input" style={{alignSelf:"flex-start", display: 'flex', alignItems: 'flex-end' }} id="file-label">
        <Button
          variant="outlined"
          sx={{
            px: { xs: 2, md: 4 },
            fontSize: '16px',
            borderWidth: files ? '2px' : '1px',
            borderRadius: 0.8,
            py: 0.6,
            borderColor: files.length!==0 ? 'var(--primary-color)' : 'var(--secondary-color)',
            color: files.length!==0 ? 'var(--primary-color)' : 'var(--secondary-color)',
            '&:hover': {
              borderColor: files.length!==0 ? 'var(--primary-color)' : 'var(--secondary-color)',
              borderWidth: files.length!==0 ? '2px' : '2px',
              backgroundColor: 'transparent',
            },
          }}
          startIcon={<AddIcon />}
          component="span"
        >
          Attach Files
        </Button>

        <Typography variant="body2" sx={{ color: 'gray', ml: 2, mb: '2px', fontSize: '16px' }}>
          {files ? `${String(files?.length)} files selected` : ''}
        </Typography>

        <input id="file-input" type="file" onChange={handleFile} multiple style={{ display: 'none' }} />
      </label>

      <Divider />

      <Stack direction="row" gap={2} sx={{ mt: 0.6, justifyContent: { xs: 'center', md: 'flex-end' } }}>
        <Button
          onClick={() => {
            handleReset();
          }}
          sx={{
            fontWeight: 600,
            borderRadius: 1,
            px: 5,
            background: 'var(--secondary-color)',
            color: 'white',
            '&:hover': { background: 'var(--secondary-dark-color)' },
          }}
          variant="contained"
        >
          Reset
        </Button>
        <LoadingButton
          variant="contained"
          disabled={complaint.description === '' || files.length === 0 || complaint.address === ''}
          sx={{
            fontWeight: 600,
            borderRadius: 1,
            px: 5,
          }}
        >
          Submit
        </LoadingButton>
      </Stack>
      </Stack>

    </Paper>
	</Box>
  );
}
