// backend/setup-db.js
// Ejecutar UNA SOLA VEZ para crear las tablas y el usuario admin
// Comando: node setup-db.js

require('dotenv').config();
const mysql  = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function setup() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'el_no_diario',
    ssl: false,
  });

  console.log('✅ Conectado a MySQL');

  // ── TABLAS ──────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      nombre         VARCHAR(100) NOT NULL,
      email          VARCHAR(150) NOT NULL UNIQUE,
      password_hash  VARCHAR(255) NOT NULL,
      rol            ENUM('superadmin','admin') DEFAULT 'admin',
      activo         BOOLEAN DEFAULT TRUE,
      ultimo_login   DATETIME,
      creado_en      DATETIME DEFAULT NOW()
    )
  `);
  console.log('✅ Tabla usuarios OK');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS secciones (
      id      INT AUTO_INCREMENT PRIMARY KEY,
      nombre  VARCHAR(100) NOT NULL,
      slug    VARCHAR(100) NOT NULL UNIQUE,
      color   VARCHAR(20)  DEFAULT '#cc0000',
      orden   INT          DEFAULT 0,
      activa  BOOLEAN      DEFAULT TRUE
    )
  `);
  console.log('✅ Tabla secciones OK');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS autores (
      id      INT AUTO_INCREMENT PRIMARY KEY,
      nombre  VARCHAR(100) NOT NULL,
      bio     TEXT,
      avatar  VARCHAR(255)
    )
  `);
  console.log('✅ Tabla autores OK');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS noticias (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      titulo            VARCHAR(300) NOT NULL,
      slug              VARCHAR(320) NOT NULL UNIQUE,
      copete            TEXT,
      cuerpo            LONGTEXT,
      imagen_url        VARCHAR(500),
      imagen_caption    VARCHAR(300),
      imagen_url_2      VARCHAR(500),
      imagen_caption_2  VARCHAR(300),
      imagen_url_3      VARCHAR(500),
      imagen_caption_3  VARCHAR(300),
      video_url         VARCHAR(500),
      es_video          BOOLEAN DEFAULT FALSE,
      seccion_id        INT NOT NULL,
      autor_id          INT,
      autor_externo     VARCHAR(150),
      es_destacada      BOOLEAN DEFAULT FALSE,
      es_breaking       BOOLEAN DEFAULT FALSE,
      es_opinion        BOOLEAN DEFAULT FALSE,
      publicada         BOOLEAN DEFAULT FALSE,
      fecha_publicacion DATETIME DEFAULT NOW(),
      vistas            INT DEFAULT 0,
      creado_en         DATETIME DEFAULT NOW(),
      FOREIGN KEY (seccion_id) REFERENCES secciones(id),
      FOREIGN KEY (autor_id)   REFERENCES autores(id)
    )
  `);
  console.log('✅ Tabla noticias OK');

  await conn.query(`
    CREATE TABLE IF NOT EXISTS avisos (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      anunciante   VARCHAR(150) NOT NULL,
      imagen_url   VARCHAR(500),
      url_destino  VARCHAR(500),
      posicion     VARCHAR(50) DEFAULT 'lateral',
      prioridad    INT DEFAULT 0,
      activo       BOOLEAN DEFAULT TRUE,
      fecha_inicio DATE,
      fecha_fin    DATE,
      impresiones  INT DEFAULT 0,
      clicks       INT DEFAULT 0,
      creado_en    DATETIME DEFAULT NOW()
    )
  `);
  console.log('✅ Tabla avisos OK');

  // ── SECCIONES INICIALES ─────────────────────────────────
  const [secciones] = await conn.query('SELECT COUNT(*) AS total FROM secciones');
  if (secciones[0].total === 0) {
    await conn.query(`
      INSERT INTO secciones (nombre, slug, color, orden) VALUES
        ('Local',          'local',          '#cc0000', 1),
        ('Nacional',       'nacional',       '#1a1a2e', 2),
        ('Internacional',  'internacional',  '#0f3460', 3),
        ('Deportes',       'deportes',       '#16213e', 4),
        ('Economía',       'economia',       '#533483', 5),
        ('Videos',         'videos',         '#e94560', 6),
        ('Opinión',        'opinion',        '#444444', 7)
    `);
    console.log('✅ Secciones creadas');
  } else {
    console.log('ℹ️  Secciones ya existen, no se modificaron');
  }

  // ── USUARIOS ─────────────────────────────────────────────
  const usuarios = [
    { nombre: 'Marcelo', email: 'marcelo@gmail.com',                  password: 'Admin2026!super', rol: 'superadmin' },
    { nombre: 'Administrador', email: 'admin@informatenecochea.com.ar', password: 'Admin2026!',     rol: 'admin'      },
  ];

  for (const u of usuarios) {
    const [existe] = await conn.query('SELECT id FROM usuarios WHERE email = ?', [u.email]);
    const hash = await bcrypt.hash(u.password, 10);
    if (existe.length === 0) {
      await conn.query(
        `INSERT INTO usuarios (nombre, email, password_hash, rol, activo) VALUES (?, ?, ?, ?, TRUE)`,
        [u.nombre, u.email, hash, u.rol]
      );
      console.log(`✅ Usuario creado: ${u.email} (${u.rol})`);
    } else {
      await conn.query(
        'UPDATE usuarios SET nombre = ?, password_hash = ?, rol = ?, activo = TRUE WHERE email = ?',
        [u.nombre, hash, u.rol, u.email]
      );
      console.log(`✅ Usuario actualizado: ${u.email} (${u.rol})`);
    }
  }

  await conn.end();
  console.log('\n🎉 Setup completo. Ya podés iniciar sesión en el admin.');
}

setup().catch(err => {
  console.error('❌ Error en setup:', err.message);
  process.exit(1);
});
