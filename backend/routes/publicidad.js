// backend/routes/publicidad.js

const express = require('express');
const db      = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function formatFecha(f) {
  if (!f || f === 'undefined' || f === 'null') return null;
  const d = new Date(f);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

router.get('/', async (req, res) => {
  try {
    const { posicion } = req.query;
    const hoy = new Date().toISOString().split('T')[0];
    let query = `SELECT id, anunciante, imagen_url, url_destino, posicion FROM avisos WHERE activo = TRUE AND (fecha_inicio IS NULL OR fecha_inicio <= ?) AND (fecha_fin IS NULL OR fecha_fin >= ?)`;
    const params = [hoy, hoy];
    if (posicion) { query += ' AND posicion = ?'; params.push(posicion); }
    query += ' ORDER BY prioridad DESC';
    const [rows] = await db.query(query, params);
    if (rows.length) {
      const ids = rows.map(r => r.id);
      await db.query(`UPDATE avisos SET impresiones = impresiones + 1 WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
    }
    res.json(rows);
  } catch (err) {
    console.error('GET /avisos error:', err);
    res.status(500).json({ error: 'Error al obtener avisos' });
  }
});

router.post('/:id/click', async (req, res) => {
  await db.query('UPDATE avisos SET clicks = clicks + 1 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

router.get('/admin/todos', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM avisos ORDER BY creado_en DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener avisos' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { anunciante, imagen_url, url_destino, posicion, prioridad, fecha_inicio, fecha_fin } = req.body;
    const [result] = await db.query(
      `INSERT INTO avisos (anunciante, imagen_url, url_destino, posicion, prioridad, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [anunciante, imagen_url || null, url_destino || null, posicion, prioridad || 0, formatFecha(fecha_inicio), formatFecha(fecha_fin)]
    );
    res.status(201).json({ id: result.insertId, mensaje: 'Aviso creado' });
  } catch (err) {
    console.error('POST /avisos error:', err);
    res.status(500).json({ error: 'Error al crear aviso' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { anunciante, imagen_url, url_destino, posicion, prioridad, activo, fecha_inicio, fecha_fin } = req.body;
    await db.query(
      `UPDATE avisos SET anunciante=?, imagen_url=?, url_destino=?, posicion=?, prioridad=?, activo=?, fecha_inicio=?, fecha_fin=? WHERE id=?`,
      [anunciante, imagen_url || null, url_destino || null, posicion, prioridad || 0, activo ? 1 : 0, formatFecha(fecha_inicio), formatFecha(fecha_fin), req.params.id]
    );
    res.json({ mensaje: 'Aviso actualizado' });
  } catch (err) {
    console.error('PUT /avisos error:', err);
    res.status(500).json({ error: 'Error al actualizar aviso' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM avisos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Aviso eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar aviso' });
  }
});

module.exports = router;
