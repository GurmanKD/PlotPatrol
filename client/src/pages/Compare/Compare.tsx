import React, { useRef, useState } from 'react';
import { Box, Button, CircularProgress, Typography, IconButton, Stack } from '@mui/material';
import { Upload } from '@mui/icons-material';

const Compare = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [dragging1, setDragging1] = useState(false);
  const [dragging2, setDragging2] = useState(false);


const [finalResult, setFinalResult] = useState("https://i.pinimg.com/736x/a2/a3/97/a2a397e610d4a4573ec212fb8420044d.jpg");

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

  const handleDragEnter1 = (e) => {
    e.preventDefault();
    setDragging1(true);
  };

  const handleDragLeave1 = (e) => {
    e.preventDefault();
    setDragging1(false);
  };

  const handleDrop1 = (e) => {
    e.preventDefault();
    setDragging1(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, setImage1);
    }
  };

  const handleDragEnter2 = (e) => {
    e.preventDefault();
    setDragging2(true);
  };

  const handleDragLeave2 = (e) => {
    e.preventDefault();
    setDragging2(false);
  };

  const handleDrop2 = (e) => {
    e.preventDefault();
    setDragging2(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, setImage2);
    }
  };

  const handleProceed = () => {
    if (!image1 || !image2) return;

    setLoading(true);
    setApiResult(null);

    setTimeout(() => {
      setLoading(false);
    }, 180000);
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
        <Box
          onDragEnter={handleDragEnter1}
          onDragLeave={handleDragLeave1}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop1}
          sx={{
            border: '2px dashed var(--primary-color)',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 300,
            height: 300,
            background: image1 ? 'none' : dragging1 ? '#e0e0e0' : '#f5f5f5',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          {image1 ? (
            <img src={image1} alt="Image 1" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <>
              <IconButton color="primary" component="span" onClick={() => fileInput1.current.click()}>
                <Upload />
              </IconButton>
              <Typography textAlign="center" variant="body2">
                Drag and Drop or Upload Image 1
              </Typography>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInput1}
                onChange={handleFileChange1}
              />
            </>
          )}
        </Box>

        <Typography variant="h5">+</Typography>

        <Box
          onDragEnter={handleDragEnter2}
          onDragLeave={handleDragLeave2}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop2}
          sx={{
            border: '2px dashed var(--primary-color)',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 300,
            height: 300,
            background: image2 ? 'none' : dragging2 ? '#e0e0e0' : '#f5f5f5',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          {image2 ? (
            <img src={image2} alt="Image 2" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <>
              <IconButton color="primary" component="span" onClick={() => fileInput2.current.click()}>
                <Upload />
              </IconButton>
              <Typography textAlign="center" variant="body2">
                Drag and Drop or Upload Image 2
              </Typography>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInput2}
                onChange={handleFileChange2}
              />
            </>
          )}
        </Box>
      </Box>
		{!apiResult &&(

			<Button
			variant="contained"
			color="primary"
			onClick={handleProceed}
			disabled={!image1 || !image2 || loading}
			sx={{ mt: 5, fontSize: '18px', borderRadius: 2, width: '20%' }}
			>
        {loading ? 'Processing...' : 'Proceed'}
      </Button>
	)}


		  {(loading||apiResult)&&(
			<>
			  <Box sx={{display:'flex',justifyContent:'center',marginTop:1}}>
					<Typography variant="h1" fontSize="104px" color="var(--primary-color)">
							&#8595; 
					</Typography>
			  </Box>


        <Box
		sx={{
			border: '2px dashed var(--primary-color)',
			padding: 2,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			width: 500,
			height: 500,
			mt:6,
			mb:6,
		  background: image2 ? 'none' : loading ? '#e0e0e0' : '#f5f5f5',
		  borderRadius: 2,
		  cursor: 'pointer',
		}}
		>
		{loading && (
          <CircularProgress />
		)}
		{apiResult && (
            <img src={finalResult} alt="Image 2" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) }
        </Box>
		</>

		  )}

    </Stack>
  );
};

export default Compare;
