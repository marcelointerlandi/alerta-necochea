// backend/middleware/auth.js
// Protege las rutas del panel admin verificando el token JWT

const jwt = require('jsonwebtoken');

// Verifica que el request tenga un token JWT válido
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, nombre, email, rol }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Solo permite acceso a superadmin
function requireSuperAdmin(req, res, next) {
  if (req.usuario?.rol !== 'superadmin') {
    return res.status(403).json({ error: 'Acceso restringido a superadministradores' });
  }
  next();
}

module.exports = { requireAuth, requireSuperAdmin };