import React, { useState } from 'react';
import axios from 'axios';

export default function ImageUpload() {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);


  const handleImageChange = (e) => {
    const sortedFiles = [...e.target.files]
      .sort((a, b) => b.lastModifiedDate - a.lastModifiedDate); // or use getTime()
    setImages(sortedFiles);
  };
  
  

  const handleUpload = async () => {
    const uploaded = [];
  
    for (const image of images) {
      const formData = new FormData();
      formData.append('image', image);
        console.log(image);
        
      try {
        const res = await axios.post('http://localhost:5100/upload', formData);
  
        uploaded.push({
          url: res.data.url,
          lastModifiedDate: image.lastModifiedDate
        });
      } catch (err) {
        console.error(err);
      }
    }
  
    setUploadedImages(prev => [...prev, ...uploaded]);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Multiple Images</h2>
      <input type="file" multiple onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        {uploadedImages.map((url, idx) => (
            <div key={idx}>
                <img
                src={url}
                alt={`uploaded-${idx + 1}`}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
                <p style={{ fontSize: '12px', color: '#666' }}>
                {images[idx]?.lastModifiedDate?.toLocaleString()}
                </p>
            </div>
        ))}
      </div>
    </div>
  );
}
