// admin/src/components/Layout.tsx
import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate    = useNavigate();
  const usuarioStr  = localStorage.getItem('usuario');
  const usuario     = usuarioStr ? JSON.parse(usuarioStr) : null;
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  const navStyle = (activo: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '.1em',
    textTransform: 'uppercase' as const,
    textDecoration: 'none',
    color: activo ? '#fff' : '#9c9a94',
    background: activo ? '#e8000d' : 'transparent',
    borderLeft: activo ? '3px solid #e8000d' : '3px solid transparent',
    transition: 'all .15s',
  });

  const sidebar = (
    <aside style={{
      width: '100%',
      background: '#111110',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
      overflowY: 'auto',
    }}>
      <div style={{ padding: '24px 16px 20px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, marginBottom: '4px' }}>
            <span style={{ color: '#e8000d' }}>INFORMATE</span>
            <span style={{ color: '#fff' }}> NECOCHEA</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.1em', color: '#4a4845', marginTop: '4px' }}>Panel Admin</div>
        </div>
        {/* botón cerrar en móvil */}
        <button
          onClick={cerrarMenu}
          className="sidebar-close-btn"
          style={{ background: 'none', border: 'none', color: '#9c9a94', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}
        >✕</button>
      </div>

      <nav style={{ flex: 1, paddingTop: '16px' }}>
        <NavLink to="/" end style={({ isActive }) => navStyle(isActive)} onClick={cerrarMenu}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/noticias" style={({ isActive }) => navStyle(isActive)} onClick={cerrarMenu}>
          📰 Noticias
        </NavLink>
        {usuario?.rol === 'superadmin' && (
          <NavLink to="/publicidad" style={({ isActive }) => navStyle(isActive)} onClick={cerrarMenu}>
            📢 Publicidad
          </NavLink>
        )}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid #222' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', marginBottom: '8px' }}>
          {usuario?.nombre}<br />
          <span style={{ color: '#4a4845', fontSize: '9px' }}>{usuario?.rol}</span>
        </div>
        <button
          onClick={cerrarSesion}
          style={{ width: '100%', background: 'transparent', border: '1px solid #333', color: '#6b6b68', padding: '7px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* Sidebar desktop */}
      <div className="sidebar-desktop" style={{ width: '220px', flexShrink: 0 }}>
        {sidebar}
      </div>

      {/* Overlay móvil */}
      {menuAbierto && (
        <div
          className="sidebar-overlay"
          onClick={cerrarMenu}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      {/* Sidebar móvil (drawer) */}
      <div
        className="sidebar-mobile"
        style={{
          position: 'fixed',
          top: 0,
          left: menuAbierto ? 0 : '-240px',
          width: '240px',
          height: '100vh',
          zIndex: 100,
          transition: 'left .25s ease',
        }}
      >
        {sidebar}
      </div>

      {/* Contenido principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar móvil */}
        <header className="mobile-topbar" style={{
          background: '#111110',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #222',
        }}>
          <button
            onClick={() => setMenuAbierto(true)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', lineHeight: 1, padding: 0 }}
          >☰</button>
          <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '16px', fontWeight: 700, textTransform: 'uppercase' }}>
            <span style={{ color: '#e8000d' }}>INFORMATE</span>
            <span style={{ color: '#fff' }}> NECOCHEA</span>
          </div>
        </header>

        <main style={{ flex: 1, background: '#f7f6f3', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
