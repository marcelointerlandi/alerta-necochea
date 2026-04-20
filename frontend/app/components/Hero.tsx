import Link from 'next/link';

interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  copete: string;
  imagen_url: string | null;
  seccion_nombre: string;
  seccion_slug: string;
  seccion_color: string;
  autor_nombre: string;
  fecha_publicacion: string;
}

function tiempoRelativo(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Hace menos de 1 hora';
  if (h < 24) return `Hace ${h} hora${h > 1 ? 's' : ''}`;
  const d = Math.floor(h / 24);
  return `Hace ${d} día${d > 1 ? 's' : ''}`;
}

export default function Hero({ destacadas }: { destacadas: Noticia[] }) {
  if (!destacadas?.length) return null;
  const principal = destacadas[0];
  const secundarias = destacadas.slice(1, 4);

  return (
    <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e0da' }}>
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 0;
        }
        .hero-main {
          padding-right: 22px;
          border-right: 1px solid #e2e0da;
          padding-bottom: 20px;
        }
        .hero-secondary {
          padding-left: 22px;
          padding-bottom: 20px;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; }
          .hero-main { padding-right: 0; border-right: none; border-bottom: 1px solid #e2e0da; margin-bottom: 16px; }
          .hero-secondary { padding-left: 0; }
        }
      `}</style>

      <div className="hero-grid">
        <div className="hero-main">
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: '#e8000d', marginBottom: '8px' }}>
            {principal.seccion_nombre}
          </div>
          <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '10px' }}>
            <Link href={`/noticia/${principal.slug}`} style={{ color: '#111110', textDecoration: 'none' }}>{principal.titulo}</Link>
          </h1>
          {principal.imagen_url ? (
            <img src={principal.imagen_url} alt={principal.titulo} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', marginBottom: '10px', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#edecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#9c9a94', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '10px' }}>Sin imagen</div>
          )}
          {principal.copete && (
            <p style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontStyle: 'italic', fontSize: '15px', lineHeight: 1.6, color: '#2d2d2b', marginBottom: '10px' }}>{principal.copete}</p>
          )}
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6b6b68' }}>
            <strong style={{ color: '#2d2d2b' }}>{principal.autor_nombre}</strong> · {tiempoRelativo(principal.fecha_publicacion)}
          </div>
        </div>

        <div className="hero-secondary">
          {secundarias.map((n, i) => (
            <div key={n.id} style={{ padding: '12px 0', borderBottom: i < secundarias.length - 1 ? '1px solid #e2e0da' : 'none' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: n.seccion_color, marginBottom: '5px' }}>
                {n.seccion_nombre}
              </div>
              <h2 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '16px', fontWeight: 600, lineHeight: 1.25, marginBottom: '4px' }}>
                <Link href={`/noticia/${n.slug}`} style={{ color: '#111110', textDecoration: 'none' }}>{n.titulo}</Link>
              </h2>
              {n.copete && (
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12.5px', color: '#2d2d2b', lineHeight: 1.5 }}>{n.copete}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}