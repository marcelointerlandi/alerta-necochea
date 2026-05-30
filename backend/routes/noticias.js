// backend/routes/noticias.js
const express  = require('express');
const slugify  = require('slugify');
const db       = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ============================================================
// RUTAS PÚBLICAS
// ============================================================

router.get('/', async (req, res) => {
  try {
    const { seccion, pagina = 1, limite = 10, destacada, breaking } = req.query;
    const offset = (Number(pagina) - 1) * Number(limite);

    let query = `
      SELECT
        n.id, n.titulo, n.slug, n.copete, n.imagen_url, n.imagen_caption,
        n.imagen_url_2, n.imagen_caption_2, n.imagen_url_3, n.imagen_caption_3,
        n.video_url, n.es_video,
        n.autor_externo, n.es_destacada, n.es_breaking, n.es_opinion,
        n.fecha_publicacion, n.vistas,
        s.nombre AS seccion_nombre, s.slug AS seccion_slug, s.color AS seccion_color,
        a.nombre AS autor_nombre, a.avatar AS autor_avatar
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      LEFT JOIN autores a ON n.autor_id = a.id
      WHERE n.publicada = TRUE
    `;
    const params = [];

    if (seccion)              { query += ' AND s.slug = ?';          params.push(seccion); }
    if (destacada === 'true') { query += ' AND n.es_destacada = TRUE'; }
    if (breaking === 'true')  { query += ' AND n.es_breaking = TRUE';  }

    const [total] = await db.query(
      `SELECT COUNT(*) AS total FROM noticias n
       JOIN secciones s ON n.seccion_id = s.id
       WHERE n.publicada = TRUE ${seccion ? 'AND s.slug = ?' : ''}`,
      seccion ? [seccion] : []
    );

    query += ' ORDER BY n.fecha_publicacion DESC LIMIT ? OFFSET ?';
    params.push(Number(limite), Number(offset));

    const [noticias] = await db.query(query, params);
    res.json({
      noticias,
      paginacion: {
        total:   total[0].total,
        pagina:  Number(pagina),
        limite:  Number(limite),
        paginas: Math.ceil(total[0].total / Number(limite)),
      }
    });
  } catch (err) {
    console.error('GET /noticias error:', err);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

router.get('/portada', async (req, res) => {
  try {
    const baseSelect = `
      SELECT n.id, n.titulo, n.slug, n.copete, n.imagen_url, n.video_url, n.es_video,
             n.es_destacada, n.fecha_publicacion,
             s.nombre AS seccion_nombre, s.slug AS seccion_slug, s.color AS seccion_color,
             a.nombre AS autor_nombre
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      LEFT JOIN autores a ON n.autor_id = a.id
      WHERE n.publicada = TRUE
    `;

    const [destacadas]      = await db.query(`${baseSelect} AND n.es_destacada = TRUE ORDER BY n.fecha_publicacion DESC LIMIT 7`);
    const [breaking]        = await db.query(`${baseSelect} AND n.es_breaking  = TRUE ORDER BY n.fecha_publicacion DESC LIMIT 8`);
    const [locales]         = await db.query(`${baseSelect} AND s.slug = 'local'         ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [nacionales]      = await db.query(`${baseSelect} AND s.slug = 'nacional'      ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [internacionales] = await db.query(`${baseSelect} AND s.slug = 'internacional' ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [deportes]        = await db.query(`${baseSelect} AND s.slug = 'deportes'      ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [economia]        = await db.query(`${baseSelect} AND s.slug = 'economia'      ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [videos]          = await db.query(`${baseSelect} AND s.slug = 'videos'        ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [opinion]         = await db.query(`${baseSelect} AND n.es_opinion = TRUE      ORDER BY n.fecha_publicacion DESC LIMIT 4`);

    res.json({ destacadas, breaking, locales, nacionales, internacionales, deportes, economia, videos, opinion });
  } catch (err) {
    console.error('GET /portada error:', err);
    res.status(500).json({ error: 'Error al obtener portada' });
  }
});

router.get('/admin/todas', requireAuth, async (req, res) => {
  try {
    const { seccion, publicada, pagina = 1, limite = 20 } = req.query;
    const offset = (Number(pagina) - 1) * Number(limite);

    let where = 'WHERE 1=1';
    const params = [];

    if (seccion)                 { where += ' AND s.slug = ?';      params.push(seccion); }
    if (publicada !== undefined) { where += ' AND n.publicada = ?'; params.push(publicada === 'true'); }

    const [noticias] = await db.query(`
      SELECT n.id, n.titulo, n.slug, n.es_destacada, n.es_breaking, n.es_video,
             n.imagen_url, n.imagen_url_2, n.imagen_url_3,
             n.imagen_caption, n.imagen_caption_2, n.imagen_caption_3,
             n.video_url, n.copete, n.cuerpo, n.autor_externo,
             n.publicada, n.fecha_publicacion, n.vistas,
             s.nombre AS seccion_nombre, s.color AS seccion_color
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      ${where}
      ORDER BY n.creado_en DESC
      LIMIT ? OFFSET ?
    `, [...params, Number(limite), Number(offset)]);

    res.json(noticias);
  } catch (err) {
    console.error('GET /admin/todas error:', err);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT n.*,
             s.nombre AS seccion_nombre, s.slug AS seccion_slug, s.color AS seccion_color,
             a.nombre AS autor_nombre, a.bio AS autor_bio, a.avatar AS autor_avatar
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      LEFT JOIN autores a ON n.autor_id = a.id
      WHERE n.slug = ? AND n.publicada = TRUE
    `, [req.params.slug]);

    if (!rows.length) return res.status(404).json({ error: 'Noticia no encontrada' });

    await db.query('UPDATE noticias SET vistas = vistas + 1 WHERE id = ?', [rows[0].id]);

    const [relacionadas] = await db.query(`
      SELECT n.titulo, n.slug, n.imagen_url, n.fecha_publicacion,
             s.nombre AS seccion_nombre, s.color AS seccion_color
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      WHERE n.seccion_id = ? AND n.id != ? AND n.publicada = TRUE
      ORDER BY n.fecha_publicacion DESC LIMIT 3
    `, [rows[0].seccion_id, rows[0].id]);

    res.json({ ...rows[0], relacionadas });
  } catch (err) {
    console.error('GET /:slug error:', err);
    res.status(500).json({ error: 'Error al obtener noticia' });
  }
});

// ============================================================
// RUTAS PRIVADAS (admin)
// ============================================================

router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      titulo, copete, cuerpo,
      imagen_url, imagen_caption,
      imagen_url_2, imagen_caption_2,
      imagen_url_3, imagen_caption_3,
      video_url, es_video,
      seccion_id, autor_id, autor_externo,
      es_destacada, es_breaking, es_opinion, publicada, fecha_publicacion
    } = req.body;

    if (!titulo || !seccion_id) {
      return res.status(400).json({ error: 'Título y sección son obligatorios' });
    }

    let slug = slugify(titulo, { lower: true, strict: true, locale: 'es' });
    const [existe] = await db.query('SELECT id FROM noticias WHERE slug = ?', [slug]);
    if (existe.length) slug = `${slug}-${Date.now()}`;

    const [result] = await db.query(`
      INSERT INTO noticias
        (titulo, slug, copete, cuerpo,
         imagen_url, imagen_caption,
         imagen_url_2, imagen_caption_2,
         imagen_url_3, imagen_caption_3,
         video_url, es_video,
         seccion_id, autor_id, autor_externo,
         es_destacada, es_breaking, es_opinion, publicada, fecha_publicacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      titulo, slug, copete || null, cuerpo || null,
      imagen_url || null, imagen_caption || null,
      imagen_url_2 || null, imagen_caption_2 || null,
      imagen_url_3 || null, imagen_caption_3 || null,
      video_url || null, es_video ? 1 : 0,
      seccion_id, autor_id || null, autor_externo || null,
      es_destacada ? 1 : 0, es_breaking ? 1 : 0, es_opinion ? 1 : 0,
      publicada ? 1 : 0,
      fecha_publicacion || new Date()
    ]);

    res.status(201).json({ id: result.insertId, slug, mensaje: 'Noticia creada' });
  } catch (err) {
    console.error('POST /noticias error:', err);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const {
      titulo, copete, cuerpo,
      imagen_url, imagen_caption,
      imagen_url_2, imagen_caption_2,
      imagen_url_3, imagen_caption_3,
      video_url, es_video,
      seccion_id, autor_id, autor_externo,
      es_destacada, es_breaking, es_opinion, publicada, fecha_publicacion
    } = req.body;

    let fecha;
    try {
      fecha = fecha_publicacion
        ? new Date(fecha_publicacion).toISOString().slice(0, 19).replace('T', ' ')
        : new Date().toISOString().slice(0, 19).replace('T', ' ');
    } catch {
      fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    await db.query(`
      UPDATE noticias SET
        titulo           = ?,
        copete           = ?,
        cuerpo           = ?,
        imagen_url       = ?,
        imagen_caption   = ?,
        imagen_url_2     = ?,
        imagen_caption_2 = ?,
        imagen_url_3     = ?,
        imagen_caption_3 = ?,
        video_url        = ?,
        es_video         = ?,
        seccion_id       = ?,
        autor_id         = ?,
        autor_externo    = ?,
        es_destacada     = ?,
        es_breaking      = ?,
        es_opinion       = ?,
        publicada        = ?,
        fecha_publicacion = ?
      WHERE id = ?
    `, [
      titulo           || null,
      copete           || null,
      cuerpo           || null,
      imagen_url       || null,
      imagen_caption   || null,
      imagen_url_2     || null,
      imagen_caption_2 || null,
      imagen_url_3     || null,
      imagen_caption_3 || null,
      video_url        || null,
      es_video         ? 1 : 0,
      seccion_id,
      autor_id         || null,
      autor_externo    || null,
      es_destacada     ? 1 : 0,
      es_breaking      ? 1 : 0,
      es_opinion       ? 1 : 0,
      publicada        ? 1 : 0,
      fecha,
      req.params.id
    ]);

    res.json({ mensaje: 'Noticia actualizada' });
  } catch (err) {
    console.error('PUT /noticias/:id error:', err);
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM noticias WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Noticia eliminada' });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
});

module.exports = router;

// ============================================================
// RUTAS PÚBLICAS (el frontend del diario las usa)
// ============================================================

// GET /api/noticias
// Query params: seccion, pagina, limite, destacada, breaking
router.get('/', async (req, res) => {
  try {
    const { seccion, pagina = 1, limite = 10, destacada, breaking } = req.query;
    const offset = (Number(pagina) - 1) * Number(limite);

    let query = `
      SELECT
        n.id, n.titulo, n.slug, n.copete, n.imagen_url, n.imagen_caption,
        n.autor_externo, n.es_destacada, n.es_breaking, n.es_opinion,
        n.fecha_publicacion, n.vistas,
        s.nombre AS seccion_nombre, s.slug AS seccion_slug, s.color AS seccion_color,
        a.nombre AS autor_nombre, a.avatar AS autor_avatar
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      LEFT JOIN autores a ON n.autor_id = a.id
      WHERE n.publicada = TRUE
    `;
    const params = [];

    if (seccion) {
      query += ' AND s.slug = ?';
      params.push(seccion);
    }
    if (destacada === 'true') {
      query += ' AND n.es_destacada = TRUE';
    }
    if (breaking === 'true') {
      query += ' AND n.es_breaking = TRUE';
    }

    // Total para paginación
    const [total] = await db.query(
      `SELECT COUNT(*) AS total FROM noticias n
       JOIN secciones s ON n.seccion_id = s.id
       WHERE n.publicada = TRUE
       ${seccion ? 'AND s.slug = ?' : ''}`,
      seccion ? [seccion] : []
    );

    query += ' ORDER BY n.fecha_publicacion DESC LIMIT ? OFFSET ?';
    params.push(Number(limite), Number(offset));

    const [noticias] = await db.query(query, params);

    res.json({
      noticias,
      paginacion: {
        total:    total[0].total,
        pagina:   Number(pagina),
        limite:   Number(limite),
        paginas:  Math.ceil(total[0].total / Number(limite)),
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

// GET /api/noticias/portada
// Devuelve todo lo necesario para armar la portada en un solo request
router.get('/portada', async (req, res) => {
  try {
    const baseSelect = `
      SELECT n.id, n.titulo, n.slug, n.copete, n.imagen_url,
             n.es_destacada, n.fecha_publicacion,
             s.nombre AS seccion_nombre, s.slug AS seccion_slug, s.color AS seccion_color,
             a.nombre AS autor_nombre
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      LEFT JOIN autores a ON n.autor_id = a.id
      WHERE n.publicada = TRUE
    `;

    const [destacadas]     = await db.query(`${baseSelect} AND n.es_destacada = TRUE ORDER BY n.fecha_publicacion DESC LIMIT 7`);
    const [breaking]       = await db.query(`${baseSelect} AND n.es_breaking = TRUE ORDER BY n.fecha_publicacion DESC LIMIT 8`);
    const [locales]        = await db.query(`${baseSelect} AND s.slug = 'local' ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [nacionales]     = await db.query(`${baseSelect} AND s.slug = 'nacional' ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [internacionales]= await db.query(`${baseSelect} AND s.slug = 'internacional' ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [deportes]       = await db.query(`${baseSelect} AND s.slug = 'deportes' ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [empleo]         = await db.query(`${baseSelect} AND s.slug = 'empleo' ORDER BY n.fecha_publicacion DESC LIMIT 4`);
    const [opinion]        = await db.query(`${baseSelect} AND n.es_opinion = TRUE ORDER BY n.fecha_publicacion DESC LIMIT 4`);

    res.json({ destacadas, breaking, locales, nacionales, internacionales, deportes, empleo, opinion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener portada' });
  }
});

// GET /api/noticias/:slug — noticia completa para página individual
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        n.*,
        s.nombre AS seccion_nombre, s.slug AS seccion_slug, s.color AS seccion_color,
        a.nombre AS autor_nombre, a.bio AS autor_bio, a.avatar AS autor_avatar
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      LEFT JOIN autores a ON n.autor_id = a.id
      WHERE n.slug = ? AND n.publicada = TRUE
    `, [req.params.slug]);

    if (!rows.length) return res.status(404).json({ error: 'Noticia no encontrada' });

    // Incrementar vistas
    await db.query('UPDATE noticias SET vistas = vistas + 1 WHERE id = ?', [rows[0].id]);

    // Noticias relacionadas (misma sección, excluyendo la actual)
    const [relacionadas] = await db.query(`
      SELECT n.titulo, n.slug, n.imagen_url, n.fecha_publicacion,
             s.nombre AS seccion_nombre, s.color AS seccion_color
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      WHERE n.seccion_id = ? AND n.id != ? AND n.publicada = TRUE
      ORDER BY n.fecha_publicacion DESC LIMIT 3
    `, [rows[0].seccion_id, rows[0].id]);

    res.json({ ...rows[0], relacionadas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener noticia' });
  }
});

// ============================================================
// RUTAS PRIVADAS (solo panel admin — requieren JWT)
// ============================================================

// GET /api/noticias/admin/todas — lista para el panel (incluye no publicadas)
router.get('/admin/todas', requireAuth, async (req, res) => {
  try {
    const { seccion, publicada, pagina = 1, limite = 20 } = req.query;
    const offset = (Number(pagina) - 1) * Number(limite);

    let where = 'WHERE 1=1';
    const params = [];

    if (seccion) { where += ' AND s.slug = ?'; params.push(seccion); }
    if (publicada !== undefined) { where += ' AND n.publicada = ?'; params.push(publicada === 'true'); }

    const [noticias] = await db.query(`
      SELECT n.id, n.titulo, n.slug, n.es_destacada, n.es_breaking,
             n.publicada, n.fecha_publicacion, n.vistas,
             s.nombre AS seccion_nombre, s.color AS seccion_color
      FROM noticias n
      JOIN secciones s ON n.seccion_id = s.id
      ${where}
      ORDER BY n.creado_en DESC
      LIMIT ? OFFSET ?
    `, [...params, Number(limite), Number(offset)]);

    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

// POST /api/noticias — crear nueva noticia
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      titulo, copete, cuerpo, imagen_url, imagen_caption,
      seccion_id, autor_id, autor_externo,
      es_destacada, es_breaking, es_opinion, publicada,
      fecha_publicacion
    } = req.body;

    if (!titulo || !seccion_id) {
      return res.status(400).json({ error: 'Título y sección son obligatorios' });
    }

    // Generar slug único
    let slug = slugify(titulo, { lower: true, strict: true, locale: 'es' });
    const [existe] = await db.query('SELECT id FROM noticias WHERE slug = ?', [slug]);
    if (existe.length) slug = `${slug}-${Date.now()}`;

    const [result] = await db.query(`
      INSERT INTO noticias
        (titulo, slug, copete, cuerpo, imagen_url, imagen_caption,
         seccion_id, autor_id, autor_externo,
         es_destacada, es_breaking, es_opinion, publicada, fecha_publicacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      titulo, slug, copete || null, cuerpo || null,
      imagen_url || null, imagen_caption || null,
      seccion_id, autor_id || null, autor_externo || null,
      es_destacada ? 1 : 0, es_breaking ? 1 : 0, es_opinion ? 1 : 0,
      publicada ? 1 : 0,
      fecha_publicacion || new Date()
    ]);

    res.status(201).json({ id: result.insertId, slug, mensaje: 'Noticia creada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
});

// PUT /api/noticias/:id — editar noticia
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const {
      titulo, copete, cuerpo, imagen_url, imagen_caption,
      seccion_id, autor_id, autor_externo,
      es_destacada, es_breaking, es_opinion, publicada, fecha_publicacion
    } = req.body;

    console.log('PUT /noticias/:id body:', req.body);

    // Fecha segura — si viene vacía o inválida usamos NOW()
    let fecha = fecha_publicacion;
    if (!fecha || fecha === 'undefined' || isNaN(Date.parse(fecha))) {
      fecha = new Date();
    }

    await db.query(`
      UPDATE noticias SET
        titulo          = ?,
        copete          = ?,
        cuerpo          = ?,
        imagen_url      = ?,
        imagen_caption  = ?,
        seccion_id      = ?,
        autor_id        = ?,
        autor_externo   = ?,
        es_destacada    = ?,
        es_breaking     = ?,
        es_opinion      = ?,
        publicada       = ?,
        fecha_publicacion = ?
      WHERE id = ?
    `, [
      titulo         || null,
      copete         || null,
      cuerpo         || null,
      imagen_url     || null,
      imagen_caption || null,
      seccion_id,
      autor_id       || null,
      autor_externo  || null,
      es_destacada   ? 1 : 0,
      es_breaking    ? 1 : 0,
      es_opinion     ? 1 : 0,
      publicada      ? 1 : 0,
      fecha,
      req.params.id
    ]);

    res.json({ mensaje: 'Noticia actualizada' });
  } catch (err) {
    console.error('PUT /noticias/:id error:', err);
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
});

// DELETE /api/noticias/:id — eliminar noticia
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM noticias WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Noticia eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
});

module.exports = router;