// backend/server.js
// Punto de entrada de la API

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ---- CORS ----
// Permite requests desde el frontend y el admin
const origenes = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({
  origin: origenes,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' })); // para cuerpos grandes con HTML

// ---- RUTAS ----
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/noticias',  require('./routes/noticias'));
app.use('/api/secciones', require('./routes/secciones'));
app.use('/api/avisos',    require('./routes/publicidad'));
app.use('/api/upload',    require('./routes/upload'));

// ---- HEALTH CHECK (Railway lo usa para saber si el servidor está vivo) ----
app.get('/health', (req, res) => res.json({ ok: true, timestamp: new Date() }));

// ---- 404 ----
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ---- ERROR GLOBAL ----
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ---- INICIAR ----
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
});