import  { useState } from 'react';
import { Box, Button, IconButton, TextField, Typography, Paper, Divider, Stack, Dialog, DialogTitle, DialogContent, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import MapPinComp from './MapPin';
import { Close } from '@mui/icons-material';
import { uploadFilesToCloudinary, uploadImgToCloudinary } from '../../components/Cloudinary';
import { LoadingButton } from '@mui/lab';

import axios from 'axios';
import config from '../../config';

const BuilderForm = () => {
  const [images, setImages] = useState([]);
  const [docs, setDocs] = useState({});

  const [projName, setProjName] = useState('');

  const [markers, setMarkers] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');

	
  const [miscDocs, setMiscDocs] = useState({});
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  const [currentTitle, setCurrentTitle] = useState('');
  const [currentFile, setCurrentFile] = useState(null);

  const [disputeError,setDisputeError] = useState([]);
  const [showDisputePopup,setShowDisputePopup] = useState(false);


  const [loading,setLoading] = useState(false);
  const [success, setSuccess] = useState(false);




  	function signedArea(coords) {
		let area = 0;
		for (let i = 0; i < coords.length; i++) {
			const next = (i + 1) % coords.length;
			area += coords[i].lat * coords[next].lng - coords[next].lat * coords[i].lng;
		}
		return 0.5 * area;
  	}

	function centroid(coords) {
		let cx = 0, cy = 0;
		for (let i = 0; i < coords.length; i++) {
			const next = (i + 1) % coords.length;
			const commonFactor = (coords[i].lat * coords[next].lng - coords[next].lat * coords[i].lng);
			cx += (coords[i].lat + coords[next].lat) * commonFactor;
			cy += (coords[i].lng + coords[next].lng) * commonFactor;
		}
		const area = signedArea(coords);
		const factor = 1 / (6 * area);
		return { lat: factor * cx, lng: factor * cy };
	}


  const handleCloseDisputePopup = () => {
  	setShowDisputePopup(false);
  };
	

  const handleAddDoc = () => {
    if (currentTitle!=="" && currentFile){
      setMiscDocs((prevDocs) => ({
        ...prevDocs,
        [currentTitle]: currentFile,
      }));
      setCurrentTitle('');
	  setCurrentFile(null);
      setIsAddingDoc(false);
    }
  };

  const handleRemoveDoc = (title) => {
    setMiscDocs((prevDocs) => {
      const updatedDocs = { ...prevDocs };
      delete updatedDocs[title];
      return updatedDocs;
    });
  };



  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: uuidv4(),
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleFileChange = (event, name) => {

	if(disputeError.includes(name)){
		setDisputeError(disputeError.filter((error)=>error!==name));
	}

	setDocs((prevDocs) => ({
	  ...prevDocs,
	  [name]: event.target.files[0],
	}));
  };
  

  const ResetSnackBar = (event, reason)=> {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };
 
  const handleSubmit = async () => {

	try{

		
	
	setLoading(true);
	
	const area = Math.abs(signedArea(markers));
    const center = centroid(markers);

	const newimgs=images.map((img)=>img.file);
	const imgs=await uploadImgToCloudinary(newimgs);
	const formatImgs = {};
	for (let i=0; i<imgs.length; i++) {
	    formatImgs[i] = imgs[i];
	}

	const uploadedDocs={};
	for (const [key, value] of Object.entries(docs)){
		if(!value) continue;
		const res=await uploadFilesToCloudinary([value]);
		uploadedDocs[key]=res[0];
	}

	const miscDocsUrls={};
	for (const [key, value] of Object.entries(miscDocs)){
		if(!value) continue;
		const res=await uploadFilesToCloudinary([value]);
		miscDocsUrls[key]=res[0];
	}

	const randomIndex = Math.floor(Math.random() * 3);
	const ids=["LIC123456","LIC123457","LIC123458"];




	const data={
		name: projName,
		builder: ids[randomIndex],
		location_name: searchLocation,
		images: formatImgs,
		dwg_file: uploadedDocs.dwg,
		ownership_file: uploadedDocs.ownership,
		structure_file: uploadedDocs.structure,
		application_file: uploadedDocs.application,
		other_files: miscDocsUrls,
		longitude: center.lng,
		latitude: center.lat,
		area: area,
	  }

	const res= await axios.post(config.api.baseUrl+"/project/create",data);
	if(res.data?.error){
		setDisputeError(res.data.error);
		setShowDisputePopup(true);
		setLoading(false);
	}
	else{
		setLoading(false);
		setCurrentFile(null);
		setCurrentTitle("");
		setDocs({});
		setImages([]);
		setMarkers([]);
		setSearchLocation("");
		setMiscDocs({});
		setSuccess(true);
	}
}
catch(err){
	setLoading(false);
	console.log(err);
}
  };

  return (
    <Box sx={{ p: 2 }}>
          <Typography variant="h3" color="primary.main" sx={{fontWeight:600,mb:2}}>
		  Builder Form
      </Typography>

		<Paper elevation={8} sx={{p:3,background:"#f5f5f5"}}>

		<TextField
		  label="Project Name"
		  variant="outlined"
		  sx={{width:"40%",mb:2}}
			  value={projName}
		  onChange={(e) => setProjName(e.target.value)}
		/>



		<Divider sx={{borderWidth:"1px", my:2}}/>

	
		<Typography variant="h5" sx={{mt:3,mb:0}}>
		  Mark the Area
      </Typography>
		<Box mb={4}>
			<MapPinComp markers={markers} setMarkers={setMarkers} searchLocation={searchLocation} setSearchLocation={setSearchLocation} />
		</Box>

		<Divider sx={{borderWidth:"1px", my:2}}/>


		<Typography variant="h5" sx={{mb:1.6}}>
		  Upload Images
      </Typography>

	  <label htmlFor="image-input" style={{alignSelf:"flex-start", display: 'flex', alignItems: 'center' , marginBottom:"0.8%"}} id="file-label">
        <Button
          variant="outlined"
          sx={{
            px: 3,
            fontSize: '15px',
            borderWidth: images ? '2px' : '1px',
            borderRadius: 0.8,
            py: 0.4,
			fontWeight:600,
            borderColor: images.length!==0 ? 'var(--primary-color)' : 'var(--secondary-color)',  
            color: images.length!==0 ? 'var(--primary-color)' : 'var(--secondary-color)',
            '&:hover': {
              borderColor: images.length!==0 ? 'var(--primary-color)' : 'var(--secondary-color)',
              borderWidth: images.length!==0 ? '2px' : '2px',
              backgroundColor: 'transparent',
            },
          }}
          startIcon={<AddIcon />}
          component="span"
        >
          Attach Images
        </Button>

        <Typography variant="body2" sx={{ color: 'gray', ml: 2, fontSize: '16px' }}>
          {images ? `${String(images?.length)} images selected` : ''}
        </Typography>
        <input type="file" id="image-input" hidden accept="image/*"  onChange={handleImageUpload}  multiple style={{ display: 'none' }}  />

      </label>

		  
      <Box sx={{ display: 'flex', justifyContent:"flex-start" }}>
        {images.map((img) => (
          <Box sx={{
			scale:0.6,
			position: 'relative',
			border: '4px solid var(--secondary-dark-color)',
			borderRadius: 2,
			m:"-15px",
			p:0.3,
			overflow: 'hidden',
			'& img': {
			  width:80,
			  height: 80,
			  objectFit: 'cover',
			},
			'& .close-icon': {
			  position: 'absolute',
			  top: '0px',
			  right: '0px',
			  scale:0.9	,
			  background: '#fff',
			  borderRadius: '50%',
			}
		  }} key={img.id}>
            <img src={img.url} alt="uploaded" />
            <IconButton
              size="small"
              className="close-icon"
              onClick={() => handleImageRemove(img.id)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

		<Divider sx={{borderWidth:"1px", my:2}}/>


      {/* DWG File */}
	  <Typography variant="h5" sx={{mt:3,lineHeight:1,mb:0.2}}>
        DWG File <span style={{color:"var(--error)"}} >*</span> 	
      </Typography>
		{ disputeError.includes('dwg') && (
			<Typography variant="body1"  color="var(--error)" sx={{mb:0}}>
			Dispute Error</Typography>
		)}

	  <Stack direction="row" alignItems="flex-end" justifyContent="flex-start" mt={1.5} gap={2} mb={3} >

      <Button variant="outlined" sx={{borderWidth:"2px"}} component="label" >
        Choose DWG File
        <input type="file" 
		accept='.dwg' 
		hidden  onChange={(e)=>handleFileChange(e,"dwg")} />
      </Button>
      {docs?.dwg && <Typography fontWeight={400} color='var(--secondary-dark-color)' >{docs.dwg.name}</Typography>}
	  </Stack>


	  <Divider sx={{borderWidth:"1px", my:2}}/>





		 {/* OwnerShip Doc */}
		 <Typography variant="h5" sx={{mt:3,lineHeight:1,mb:0.2}}>
        Ownership Doc <span style={{color:"var(--error)"}} >*</span> 
      </Typography>
		{ disputeError.includes("ownership") && (
			<Typography variant="body1"  color="var(--error)" sx={{mb:0}}>
			Dispute Error</Typography>
	)
		}

	  <Stack direction="row" alignItems="flex-end" justifyContent="flex-start" mt={1.5} gap={2} mb={3} >

      <Button variant="outlined" sx={{borderWidth:"2px"}} component="label" >
        Choose File
        <input type="file"  hidden  onChange={(e)=>handleFileChange(e,"ownership")} />
      </Button>
      {docs?.ownership && <Typography fontWeight={400} color='var(--secondary-dark-color)' >{docs.ownership.name}</Typography>}
	  </Stack>


	  <Divider sx={{borderWidth:"1px", my:2}}/>

		 {/* Structure Integration */}
		 <Typography variant="h5" sx={{mt:3,lineHeight:1,mb:0.2}}>
		 Structure Integration Doc <span style={{color:"var(--error)"}} >*</span> 
      </Typography>
		{ disputeError.includes("structure") && (
			<Typography variant="body1"  color="var(--error)" sx={{mb:0}}>
			Dispute Error</Typography>
		)
		}

	  <Stack direction="row" alignItems="flex-end" justifyContent="flex-start" mt={1.5} gap={2} mb={3} >

      <Button variant="outlined" sx={{borderWidth:"2px"}} component="label" >
        Choose File
        <input type="file"  hidden  onChange={(e)=>handleFileChange(e,"structure")} />
      </Button>
      {docs?.structure && <Typography fontWeight={400} color='var(--secondary-dark-color)' >{docs.structure.name}</Typography>}
	  </Stack>


	  <Divider sx={{borderWidth:"1px", my:2}}/>




		 {/* Application Form */}
		 <Typography variant="h5" sx={{mt:3,lineHeight:1,mb:0.2}}>
        Application Form <span style={{color:"var(--error)"}} >*</span> 
      </Typography>
		{ disputeError.includes("application") && (
			<Typography variant="body1"  color="var(--error)" sx={{mb:0}}>
			Dispute Error</Typography>
		)
		}

	  <Stack direction="row" alignItems="flex-end" justifyContent="flex-start" mt={1.5} gap={2} mb={3} >

      <Button variant="outlined" sx={{borderWidth:"2px"}} component="label" >
        Choose File
        <input type="file"  hidden  onChange={(e)=>handleFileChange(e,"application")} />
      </Button>
      {docs?.application && <Typography fontWeight={400} color='var(--secondary-dark-color)' >{docs.application.name}</Typography>}
	  </Stack>


	  <Divider sx={{borderWidth:"1px", my:2}}/>

		 


      {/* Miscellaneous */}
	  <Stack direction="row" alignItems="center" sx={{mt:3,mb:3}} gap={2}>

	  <Typography variant="h5" color="primary.main" >
       Add Other Docs 

      </Typography>
	  {!isAddingDoc && (
        <IconButton
          variant="outlined"
          sx={{border:"2px solid var(--primary-color)",color:"var(--primary-color)" }}
		  size='small'
          onClick={() => setIsAddingDoc(true)}
        >
          <AddIcon fontSize='inherit'/>
        </IconButton>
      )}
	  </Stack>
     
	 
	  {Object.entries(miscDocs).map(([title, file]) => (
        <Paper key={title} sx={{ px: 2,py:0.6, mb: 1.5, display: 'flex',width:"fit-content", justifyContent: 'flex-start', alignItems: 'center',gap:2 }}>
          <Stack direction="row" alignItems="flex-end" gap={1}>
            <Typography variant='h6' fontSize="17px" lineHeight={1}>{title}</Typography>
            {file && <Typography fontSize="12px">{file.name}</Typography>}
          </Stack>
          <IconButton
            variant="outlined"
            color="error"
			size='small'
            onClick={() => handleRemoveDoc(title)}
          >
            <CloseIcon fontSize='inherit'/>
          </IconButton>
        </Paper>
      ))}


	  
      

      {isAddingDoc && (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 2 }}>
          <TextField
            label="Title"
            size="small"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
          />
          <Button variant="contained" sx={{fontWeight:600,px:3,mb:'1px'}} component="label">
		  {currentFile?currentFile.name:"Choose File"}
			
            <input
              type="file"
              hidden
              onChange={(e) => setCurrentFile(e.target.files[0])}
              disabled={!currentTitle.trim()}
            />
          </Button>
		  
		  

          <Button variant="outlined" size='small' sx={{mb:'2px'}} onClick={handleAddDoc}>
            Add
          </Button>
        </Box>
      )}

<Divider sx={{borderWidth:"1px", my:2}}/>


      {/* Submit */}
      <Stack sx={{ mt: 2,w:1 }}>
        <LoadingButton loading={loading} variant="contained" sx={{px:6,width:"15%",fontSize:"17px",alignSelf:"flex-end"}} color="primary" onClick={handleSubmit}
		disabled={!(markers.length && images.length && docs.dwg && docs.ownership && docs.structure && docs.application ) && disputeError.length===0}
		>
          Submit
        </LoadingButton>
      </Stack>
		</Paper>


		{showDisputePopup && (
        <Dialog open={Boolean(showDisputePopup)} onClose={handleCloseDisputePopup}
		sx={{
            "& .MuiDialog-paper": {
              width: "30%", 
              maxWidth: "30%",
              height: "35vh",
            },
          }}
		>
          <DialogTitle>
		  <Typography variant="h4" color="var(--error)" fontWeight={600} >
              Dispute Error
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseDisputePopup}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant='h6' textAlign="justify">
				There {disputeError.length>1?"are ":"is "} {disputeError.length} dispute {disputeError.length>1?"errors":"error"} in the form documents including&nbsp;
				<span style={{color:"var(--primary-color)"}}>
						{disputeError.join(", ")}
					</span> files. Please resolve them before submitting the form.
			</Typography>
          </DialogContent>
        </Dialog>
      )}


<Snackbar open={success} autoHideDuration={2500} onClose={ResetSnackBar}>
        <Alert onClose={ResetSnackBar} variant="filled" severity='success'  sx={{ width: '100%' }}>
          Project Registered Successfully
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default BuilderForm;
