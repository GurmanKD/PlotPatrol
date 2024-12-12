import React, { useRef, useState } from 'react';
import { Box, Button, CircularProgress, Typography, IconButton, Stack, Modal } from '@mui/material';
import { Upload } from '@mui/icons-material';

const Compare = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fileInput1 = useRef(null);
  const fileInput2 = useRef(null);

  const handleImageUpload = (file, setImage) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange1 = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, setImage1);
    }
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, setImage2);
    }
  };

  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://172.16.17.219:5500/uploadImage', {
        method: 'POST',
        body: formData,
      });
      return true;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const handleProceed = async () => {
    if (!image1 || !image2) return;

    setLoading(true);
    try {
      const file1 = fileInput1.current.files[0];
      const file2 = fileInput2.current.files[0];

      const uploadedImage1 = await uploadToBackend(file1);
      const uploadedImage2 = await uploadToBackend(file2);

      if (uploadedImage1 && uploadedImage2) {
        console.log('Images uploaded:', uploadedImage1, uploadedImage2);
        const response = await fetch('http://172.16.17.219:5500/runTest', {
          method: 'POST',
        });

        const data = await response.json();
   
          console.log(data)
          setFinalResult(data.link); // Use the URL from the response
          setOpenModal(true); // Open the modal to show the image
        
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Stack alignItems="center" p={2}>
      <Typography variant="h3" sx={{ alignSelf: 'flex-start' }} fontWeight={600} color="var(--primary-color)">
        Compare Maps
      </Typography>
      <Typography variant="h6" sx={{ alignSelf: 'flex-start' }}>
        Upload Two Images for Comparison
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 8 }}>
        {/* Image 1 Upload */}
        <Box
          sx={{
            border: '2px dashed var(--primary-color)',
            padding: 2,
            width: 300,
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <input type="file" ref={fileInput1} onChange={handleFileChange1} hidden />
          {image1 ? (
            <img src={image1} alt="Image 1" style={{ width: '100%', height: '100%' }} />
          ) : (
            <IconButton onClick={() => fileInput1.current.click()}>
              <Upload />
            </IconButton>
          )}
        </Box>

        {/* Image 2 Upload */}
        <Box
          sx={{
            border: '2px dashed var(--primary-color)',
            padding: 2,
            width: 300,
            height: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          <input type="file" ref={fileInput2} onChange={handleFileChange2} hidden />
          {image2 ? (
            <img src={image2} alt="Image 2" style={{ width: '100%', height: '100%' }} />
          ) : (
            <IconButton onClick={() => fileInput2.current.click()}>
              <Upload />
            </IconButton>
          )}
        </Box>
      </Box>

      <Button variant="contained" sx={{ mt: 5 }} onClick={handleProceed} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Compare'}
      </Button>
      <img src={finalResult} alt="Result" style={{ width: '100%' }} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comparison Result
          </Typography>
          {finalResult && <img src={finalResult} alt="Result" style={{ width: '100%' }} />}
          <Button variant="contained" sx={{ mt: 3 }} onClick={handleCloseModal}>
            Close
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
};

export default Compare;
