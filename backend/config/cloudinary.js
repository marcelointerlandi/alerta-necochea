// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage para imágenes
const imagenStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'el-no-diario/imagenes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
  },
});

// Storage para videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'el-no-diario/videos',
    resource_type:  'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
  },
});

const subirImagen = multer({ storage: imagenStorage });
const subirVideo  = multer({ storage: videoStorage });

module.exports = { cloudinary, subirImagen, subirVideo };