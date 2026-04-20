'use client';
import Link from 'next/link';
import { useState } from 'react';

const secciones = [
  { nombre: 'Local',         slug: 'local'         },
  { nombre: 'Nacional',      slug: 'nacional'       },
  { nombre: 'Internacional', slug: 'internacional'  },
  { nombre: 'Deportes',      slug: 'deportes'       },
  { nombre: 'Economía',      slug: 'economia'       },
  { nombre: 'Videos',        slug: 'videos'         },
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header>
      <style>{`
        .nav-desktop { display: flex !important; }
        .hamburger   { display: none !important; }
        .nav-mobile  { display: none !important; }
        .nav-mobile.abierto { display: flex !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger   { display: flex !important; }
          .logo-size   { font-size: 48px !important; }
        }
      `}</style>

      <div style={{ padding: '16px 0 0', borderBottom: '1px solid #111110' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 20px' }}>

          <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: '14px' }}>
            <span className="logo-size" style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(42px, 8vw, 86px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: '.95', textTransform: 'uppercase', display: 'block' }}>
              <span style={{ color: '#e8000d' }}>ALERTA</span>
              <span style={{ color: '#111110' }}> NECOCHEA</span>
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#9c9a94', display: 'block', marginTop: '6px' }}>
              Periodismo sin filtros · Argentina y el mundo
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ background: '#111110', alignItems: 'stretch' }}>
            {secciones.map((s) => (
              <Link key={s.slug} href={`/seccion/${s.slug}`} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: '#b0aea8', textDecoration: 'none', padding: '10px 20px', borderRight: '1px solid #222' }}>
                {s.nombre}
              </Link>
            ))}
          </nav>

          {/* Mobile nav */}
          <div style={{ background: '#111110', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
            <button
              className="hamburger"
              onClick={() => setMenuAbierto(!menuAbierto)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '12px', fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.1em', color: '#b0aea8' }}>SECCIONES</span>
              {menuAbierto ? '✕' : '☰'}
            </button>
          </div>

          <nav className={`nav-mobile${menuAbierto ? ' abierto' : ''}`} style={{ background: '#111110', flexDirection: 'column', borderTop: '1px solid #222' }}>
            {secciones.map((s) => (
              <Link key={s.slug} href={`/seccion/${s.slug}`} onClick={() => setMenuAbierto(false)} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: '#b0aea8', textDecoration: 'none', padding: '14px 16px', borderBottom: '1px solid #222', display: 'block' }}>
                {s.nombre}
              </Link>
            ))}
          </nav>

        </div>
      </div>
    </header>
  );
}