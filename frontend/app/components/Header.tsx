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
    <header style={{ borderBottom: '1px solid #e2e0da' }}>

      {/* Masthead */}
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '24px' }}>

        {/* Logo ícono */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="Informate Necochea" style={{ height: '72px', width: 'auto', display: 'block' }} />
        </Link>

        {/* Divisor */}
        <div style={{ width: '1px', height: '64px', background: '#ddd', flexShrink: 0 }} />

        {/* Nombre */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, textTransform: 'uppercase' }}>
            <span style={{ color: '#e8000d' }}>INFORMATE</span>
            <span style={{ color: '#111110' }}> NECOCHEA</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#9c9a94', marginTop: '6px' }}>
            Tu diario digital de Necochea
          </div>
        </Link>

      </div>

      {/* Nav bar */}
      <div style={{ background: '#111110' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

          {/* Desktop */}
          <nav className="nav-desktop" style={{ alignItems: 'stretch' }}>
            {secciones.map((s) => (
              <Link key={s.slug} href={`/seccion/${s.slug}`} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: '#b0aea8', textDecoration: 'none', padding: '10px 20px', borderRight: '1px solid #222' }}>
                {s.nombre}
              </Link>
            ))}
            <a href="https://admin.informatenecochea.com" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: '#e8000d', textDecoration: 'none', padding: '10px 20px', borderLeft: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⚙ Admin
            </a>
          </nav>

          {/* Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
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
            <a href="https://admin.informatenecochea.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: '#e8000d', textDecoration: 'none', padding: '14px 16px', borderBottom: '1px solid #222', display: 'block' }}>
              ⚙ Admin
            </a>
          </nav>

        </div>
      </div>

    </header>
  );
}
