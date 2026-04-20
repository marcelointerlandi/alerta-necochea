// frontend/app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: '#2d2d2b', color: '#9c9a94', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', marginTop: '16px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', borderBottom: '1px solid #333' }}>

        {/* Logo y contacto */}
        <div>
          <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '28px', fontWeight: 700, letterSpacing: '-.02em', textTransform: 'uppercase', marginBottom: '12px' }}>
          <span style={{ color: '#e8000d' }}>ALERTA</span> NECOCHEA
          </div>
          <p style={{ fontSize: '10px', color: '#6b6b68', lineHeight: 1.6, marginBottom: '16px' }}>
            Periodismo independiente sin filtros. Noticias locales, nacionales e internacionales con contexto y profundidad.
          </p>

          {/* Datos de contacto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="mailto:alertanecochea@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9c9a94', textDecoration: 'none', fontSize: '11px' }}>
              <span style={{ color: '#e8000d' }}>✉</span>
              alertanecochea@gmail.com
            </a>
            <a href="https://wa.me/542262677470" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9c9a94', textDecoration: 'none', fontSize: '11px' }}>
              <span style={{ color: '#25D366' }}>●</span>
              WhatsApp: 2262 677470
            </a>
            <a href="https://instagram.com/alertanecochea" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9c9a94', textDecoration: 'none', fontSize: '11px' }}>
              <span style={{ color: '#E1306C' }}>◆</span>
              IG @alertanecochea
            </a>
          </div>
        </div>

        {/* Links */}
        
      </div>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#4a4845' }}>
        <span>© {new Date().getFullYear()} el NO diario · Todos los derechos reservados</span>
        <span>Buenos Aires, Argentina</span>
        <span>Privacidad · Términos · Cookies</span>
      </div>
    </footer>
  );
}

