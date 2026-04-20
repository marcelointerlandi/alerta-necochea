// backend/routes/secciones.js

const express = require('express');
const db      = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/secciones — todas las secciones activas
router.get('/', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM secciones WHERE activa = TRUE ORDER BY orden ASC'
  );
  res.json(rows);
});

// PUT /api/secciones/:id — editar color u orden (solo admin)
router.put('/:id', requireAuth, async (req, res) => {
  const { color, orden, activa } = req.body;
  await db.query(
    'UPDATE secciones SET color=?, orden=?, activa=? WHERE id=?',
    [color, orden, activa ? 1 : 0, req.params.id]
  );
  res.json({ mensaje: 'Sección actualizada' });
});

module.exports = router;