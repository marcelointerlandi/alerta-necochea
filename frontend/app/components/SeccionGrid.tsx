'use client';
import Link from 'next/link';

interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  copete: string;
  imagen_url: string | null;
  seccion_nombre: string;
  seccion_color: string;
  autor_nombre: string;
  fecha_publicacion: string;
}

interface Props {
  titulo: string;
  color: string;
  noticias: Noticia[];
}

function tiempoRelativo(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Hace menos de 1h';
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

export default function SeccionGrid({ titulo, color, noticias }: Props) {
  if (!noticias?.length) return null;

  const slugSeccion = titulo
    .toLowerCase()
    .replace('í','i').replace('é','e').replace('ó','o').replace('á','a').replace('ú','u');

  return (
    <div style={{ marginBottom: '24px' }}>
      <style>{`
        .seccion-grid-${slugSeccion} {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e2e0da;
        }
        @media (max-width: 768px) {
          .seccion-grid-${slugSeccion} {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .seccion-grid-${slugSeccion} {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', background: color, color: '#fff', padding: '6px 14px', whiteSpace: 'nowrap' }}>
          {titulo}
        </span>
        <div style={{ flex: 1, height: '1px', background: '#c8c5be' }} />
        <Link href={`/seccion/${slugSeccion}`} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 600, color: '#6b6b68', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Ver todo →
        </Link>
      </div>

      <div className={`seccion-grid-${slugSeccion}`}>
        {noticias.map((n) => (
          <div key={n.id} style={{ borderTop: `2px solid ${color}`, paddingTop: '10px' }}>
            {n.imagen_url ? (
              <img src={n.imagen_url} alt={n.titulo} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', marginBottom: '8px' }} />
            ) : (
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#edecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#9c9a94', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '8px' }}>
                Sin imagen
              </div>
            )}
            <h3 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '16px', fontWeight: 600, lineHeight: 1.25, marginBottom: '6px' }}>
              <Link href={`/noticia/${n.slug}`} style={{ color: '#111110', textDecoration: 'none' }}>
                {n.titulo}
              </Link>
            </h3>
            {n.copete && (
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#2d2d2b', lineHeight: 1.5, marginBottom: '6px' }}>
                {n.copete}
              </p>
            )}
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94' }}>
              {n.autor_nombre} · {tiempoRelativo(n.fecha_publicacion)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}