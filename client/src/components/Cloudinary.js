import config from "../config";

const uploadImgToCloudinary = async (files) => {
	if (!Array.isArray(files) || files.length === 0) {
	  throw new Error('Please provide an array of files to upload.');
	}
  
	const url = `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`;
	const uploadPromises = files.map(async (file) => {
	  const formData = new FormData();
	  formData.append('file', file);
	  formData.append('upload_preset', config.cloudinary.uploadPreset);
  
	  try {
		const response = await fetch(url, {
		  method: 'POST',
		  body: formData,
		});
		if (!response.ok) {
		  throw new Error(`Failed to upload file: ${file.name}`);
		}
		const data = await response.json();
		return data.secure_url;
	  } catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	  }
	});
  
	return Promise.all(uploadPromises);
  };


const uploadFilesToCloudinary = async (files) => {
	if (!Array.isArray(files) || files.length === 0) {
	  throw new Error('Please provide an array of files to upload.');
	}
  
	const url = `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/raw/upload`;
	const uploadPromises = files.map(async (file) => {
	  const formData = new FormData();
	  formData.append('file', file);
	  formData.append('upload_preset', config.cloudinary.uploadPreset);
  
	  try {
		const response = await fetch(url, {
		  method: 'POST',
		  body: formData,
		});
		if (!response.ok) {
		  throw new Error(`Failed to upload file: ${file.name}`);
		}
		const data = await response.json();
		return data.secure_url;
	  } catch (error) {
		console.error('Error uploading file:', error);
		throw error;
	  }
	});
  
	return Promise.all(uploadPromises);
  };
  
  
  export {uploadImgToCloudinary, uploadFilesToCloudinary};
  