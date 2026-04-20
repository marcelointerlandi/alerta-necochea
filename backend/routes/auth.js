// backend/routes/auth.js
// Login y perfil del usuario admin

const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    // Buscar usuario activo
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];

    // Verificar contraseña con bcrypt
    const ok = await bcrypt.compare(password, usuario.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Actualizar último login
    await db.query(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?',
      [usuario.id]
    );

    // Generar token JWT (expira en 8 horas)
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id:     usuario.id,
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol,
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/auth/perfil — devuelve datos del usuario logueado
router.get('/perfil', requireAuth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, nombre, email, rol, ultimo_login FROM usuarios WHERE id = ?',
    [req.usuario.id]
  );
  res.json(rows[0]);
});

// POST /api/auth/cambiar-password
router.post('/cambiar-password', requireAuth, async (req, res) => {
  try {
    const { password_actual, password_nuevo } = req.body;

    const [rows] = await db.query(
      'SELECT password_hash FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    const ok = await bcrypt.compare(password_actual, rows[0].password_hash);
    if (!ok) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

    const hash = await bcrypt.hash(password_nuevo, 10);
    await db.query(
      'UPDATE usuarios SET password_hash = ? WHERE id = ?',
      [hash, req.usuario.id]
    );

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;