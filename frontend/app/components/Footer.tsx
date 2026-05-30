// frontend/app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#1e1e1c', color: '#c8c6c0', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', marginTop: '16px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '48px 20px 36px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', borderBottom: '1px solid #3a3a38' }}>

        {/* Logo y contacto */}
        <div>
          <div style={{ background: '#fff', display: 'inline-block', padding: '10px 14px', borderRadius: '6px', marginBottom: '20px' }}>
            <img src="/logo.png" alt="Informate Necochea" style={{ height: '80px', width: 'auto', display: 'block' }} />
          </div>
          <p style={{ fontSize: '12px', color: '#a8a6a0', lineHeight: 1.8, marginBottom: '24px', maxWidth: '300px' }}>
            Tu diario digital de Necochea. Noticias locales, nacionales e internacionales con contexto y profundidad.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href="mailto:informatenecochea@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c8c6c0', textDecoration: 'none', fontSize: '12px' }}>
              <span style={{ color: '#e8000d', fontSize: '14px' }}>✉</span>
              informatenecochea@gmail.com
            </a>
            <a href="https://wa.me/542262218882" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c8c6c0', textDecoration: 'none', fontSize: '12px' }}>
              <span style={{ color: '#25D366', fontSize: '14px' }}>●</span>
              WhatsApp: 2262 218882
            </a>
            <a href="https://instagram.com/informatenecochea" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c8c6c0', textDecoration: 'none', fontSize: '12px' }}>
              <span style={{ color: '#E1306C', fontSize: '14px' }}>◆</span>
              IG @informatenecochea
            </a>
          </div>
        </div>

        {/* Secciones */}
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#e8000d', marginBottom: '20px', fontWeight: 600 }}>Secciones</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Local', 'Nacional', 'Internacional', 'Deportes', 'Economía', 'Videos'].map(s => (
              <Link key={s} href={`/seccion/${s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}`}
                style={{ color: '#b0aea8', textDecoration: 'none', fontSize: '12px' }}>
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Desarrollado por */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ borderTop: '1px solid #3a3a38', paddingTop: '20px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#7a7872', marginBottom: '8px' }}>Desarrollado por</div>
            <div style={{ fontSize: '14px', color: '#e8e6e0', fontWeight: 600, marginBottom: '4px' }}>Marcelo</div>
            <a href="https://wa.me/542262218882" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#a8a6a0', textDecoration: 'none' }}>
              2262 218882
            </a>
          </div>
        </div>

      </div>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7a7872' }}>
        <span>© {new Date().getFullYear()} Informate Necochea · Todos los derechos reservados</span>
        <span>Necochea, Buenos Aires, Argentina</span>
      </div>
    </footer>
  );
}
