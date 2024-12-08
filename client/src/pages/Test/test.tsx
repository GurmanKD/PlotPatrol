import React, { useState } from 'react';
import uploadToCloudinary from '../../components/Cloudinary';

const Test = () => {
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadToCloudinary(files);
      setUploadedUrls(urls);
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '400px', margin: '0 auto' }}>
      <h3>Upload Multiple Files</h3>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
      {uploadedUrls.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h4>Uploaded Files:</h4>
          <ul>
            {uploadedUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Test;
