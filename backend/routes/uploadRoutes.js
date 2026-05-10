import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'disasterlink/credentials',
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file to Cloudinary' });
  }
});

export default router;
