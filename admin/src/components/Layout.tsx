// admin/src/components/Layout.tsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate  = useNavigate();
  const usuarioStr = localStorage.getItem('usuario');
  const usuario   = usuarioStr ? JSON.parse(usuarioStr) : null;

  function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  const navStyle = (activo: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      
      <aside style={{ width: '220px', background: '#111110', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        
        <div style={{ padding: '24px 16px 20px', borderBottom: '1px solid #222' }}>
          <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '22px', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1, marginBottom: '4px' }}>
            <span style={{ color: '#e8000d' }}>ALERTA</span>
            <span style={{ color: '#fff' }}> NECOCHEA</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.1em', color: '#4a4845', marginTop: '4px' }}>Panel Admin</div>
        </div>

        <nav style={{ flex: 1, paddingTop: '16px' }}>
          <NavLink to="/" end style={({ isActive }) => navStyle(isActive)}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/noticias" style={({ isActive }) => navStyle(isActive)}>
            📰 Noticias
          </NavLink>
          <NavLink to="/publicidad" style={({ isActive }) => navStyle(isActive)}>
            📢 Publicidad
          </NavLink>
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

      <main style={{ flex: 1, background: '#f7f6f3', overflow: 'auto' }}>
        <Outlet />
      </main>

    </div>
  );
}