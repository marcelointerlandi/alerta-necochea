// backend/routes/upload.js
const express = require('express');
const { subirImagen, subirVideo } = require('../config/cloudinary');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/upload/imagen — sube una imagen a Cloudinary
router.post('/imagen', requireAuth, subirImagen.single('archivo'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
    res.json({
      url:       req.file.path,
      public_id: req.file.filename,
      mensaje:   'Imagen subida correctamente',
    });
  } catch (err) {
    console.error('Error subiendo imagen:', err);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

// POST /api/upload/video — sube un video a Cloudinary
router.post('/video', requireAuth, subirVideo.single('archivo'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });
    res.json({
      url:       req.file.path,
      public_id: req.file.filename,
      mensaje:   'Video subido correctamente',
    });
  } catch (err) {
    console.error('Error subiendo video:', err);
    res.status(500).json({ error: 'Error al subir video' });
  }
});

module.exports = router;