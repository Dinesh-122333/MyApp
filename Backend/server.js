const express = require('express');
const multer = require('multer');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('image', 10), async (req, res) => {
  try {
    const urls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      urls.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    res.json({ urls });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});


app.listen(5100, () => {
  console.log('Server running on port 5100');
});
