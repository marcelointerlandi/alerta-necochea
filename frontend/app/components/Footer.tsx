// frontend/app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#2d2d2b', color: '#9c9a94', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', marginTop: '16px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '40px 20px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '48px', borderBottom: '1px solid #3a3a38' }}>

        {/* Logo y contacto */}
        <div>
          <div style={{ background: '#fff', display: 'inline-block', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px' }}>
            <img src="/logo.png" alt="Informate Necochea" style={{ height: '80px', width: 'auto', display: 'block' }} />
          </div>
          <p style={{ fontSize: '11px', color: '#6b6b68', lineHeight: 1.7, marginBottom: '20px', maxWidth: '300px' }}>
            Tu diario digital de Necochea. Noticias locales, nacionales e internacionales con contexto y profundidad.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="mailto:informatenecochea@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9c9a94', textDecoration: 'none', fontSize: '11px' }}>
              <span style={{ color: '#e8000d' }}>✉</span>
              informatenecochea@gmail.com
            </a>
            <a href="https://wa.me/542262218882" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9c9a94', textDecoration: 'none', fontSize: '11px' }}>
              <span style={{ color: '#25D366' }}>●</span>
              WhatsApp: 2262 218882
            </a>
            <a href="https://instagram.com/informatenecochea" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9c9a94', textDecoration: 'none', fontSize: '11px' }}>
              <span style={{ color: '#E1306C' }}>◆</span>
              IG @informatenecochea
            </a>
          </div>
        </div>

        {/* Secciones */}
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#e8000d', marginBottom: '16px' }}>Secciones</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Local', 'Nacional', 'Internacional', 'Deportes', 'Economía', 'Videos'].map(s => (
              <Link key={s} href={`/seccion/${s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')}`} style={{ color: '#6b6b68', textDecoration: 'none', fontSize: '11px', transition: 'color .15s' }}>
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Desarrollado por */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ borderTop: '1px solid #3a3a38', paddingTop: '16px' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#4a4845', marginBottom: '6px' }}>Desarrollado por</div>
            <div style={{ fontSize: '12px', color: '#6b6b68' }}>Marcelo</div>
            <a href="https://wa.me/542262218882" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#9c9a94', textDecoration: 'none' }}>
              2262 218882
            </a>
          </div>
        </div>

      </div>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#4a4845' }}>
        <span>© {new Date().getFullYear()} Necoticias · Todos los derechos reservados</span>
        <span>Necochea, Buenos Aires, Argentina</span>
      </div>
    </footer>
  );
}

