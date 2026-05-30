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

  const grandes    = destacadas.slice(0, 2);
  const secundarias = destacadas.slice(2, 7);

  return (
    <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e0da', paddingBottom: '4px' }}>
      <div className="seccion-cols">

        {/* Izquierda: 2 notas grandes con foto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {grandes.map((n, i) => (
            <div key={n.id} style={{ borderTop: i === 0 ? '2px solid #111110' : '1px solid #e2e0da', paddingTop: '12px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: n.seccion_color, marginBottom: '7px' }}>
                {n.seccion_nombre}
              </div>
              <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: i === 0 ? 'clamp(22px, 2.6vw, 32px)' : 'clamp(18px, 2vw, 24px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '10px' }}>
                <Link href={`/noticia/${n.slug}`} style={{ color: '#111110', textDecoration: 'none' }}>
                  {n.titulo}
                </Link>
              </h1>
              {n.imagen_url ? (
                <img
                  src={n.imagen_url}
                  alt={n.titulo}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', marginBottom: '10px' }}
                />
              ) : (
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#edecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#9c9a94', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '10px' }}>
                  Sin imagen
                </div>
              )}
              {n.copete && (
                <p style={{
                  fontFamily: "'IBM Plex Serif', Georgia, serif", fontStyle: 'italic',
                  fontSize: '14px', lineHeight: 1.6, color: '#2d2d2b', marginBottom: '8px',
                  display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {n.copete}
                </p>
              )}
              <div suppressHydrationWarning style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6b6b68' }}>
                <strong style={{ color: '#2d2d2b' }}>{n.autor_nombre}</strong> · {tiempoRelativo(n.fecha_publicacion)}
              </div>
            </div>
          ))}
        </div>

        {/* Derecha: hasta 5 notas con foto chica */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {secundarias.map((n, i) => (
            <div key={n.id} style={{
              display: 'flex',
              gap: '10px',
              flex: 1,
              paddingTop: '10px',
              paddingBottom: '10px',
              borderTop: i === 0 ? '2px solid #111110' : '1px solid #e2e0da',
            }}>
              {/* Foto chica */}
              <div style={{ width: '88px', flexShrink: 0 }}>
                {n.imagen_url ? (
                  <img
                    src={n.imagen_url}
                    alt={n.titulo}
                    style={{ width: '88px', height: '64px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '88px', height: '64px', background: '#edecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: '#9c9a94', textTransform: 'uppercase' }}>
                    Sin imagen
                  </div>
                )}
              </div>
              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', color: n.seccion_color, marginBottom: '5px' }}>
                  {n.seccion_nombre}
                </div>
                <h2 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '15px', fontWeight: 600, lineHeight: 1.25, marginBottom: '4px' }}>
                  <Link href={`/noticia/${n.slug}`} style={{ color: '#111110', textDecoration: 'none' }}>
                    {n.titulo}
                  </Link>
                </h2>
                {n.copete && (
                  <p style={{
                    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px',
                    color: '#2d2d2b', lineHeight: 1.45,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {n.copete}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
