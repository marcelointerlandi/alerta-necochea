// frontend/app/seccion/[slug]/page.tsx
import axios from 'axios';
import Header from '../../components/Header';
import BreakingTicker from '../../components/BreakingTicker';
import AdLateral from '../../components/AdLateral';
import AdBanner from '../../components/AdBanner';
import Footer from '../../components/Footer';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const SECCIONES: Record<string, { nombre: string; color: string }> = {
  local:         { nombre: 'Local',         color: '#0052cc' },
  nacional:      { nombre: 'Nacional',       color: '#111111' },
  internacional: { nombre: 'Internacional',  color: '#1a5e2e' },
  deportes:      { nombre: 'Deportes',       color: '#7b1fa2' },
  economia:      { nombre: 'Economía',       color: '#e65100' },
  videos:        { nombre: 'Videos',         color: '#c41230' },
};

function tiempoRelativo(fecha: string) {
  const diff = Date.now() - new Date(fecha).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Hace menos de 1h';
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

async function getData(slug: string) {
  try {
    const [notsRes, breakRes, izqRes, derRes, bannerRes] = await Promise.all([
      axios.get(`${API}/api/noticias?seccion=${slug}&limite=12`),
      axios.get(`${API}/api/noticias?breaking=true&limite=8`),
      axios.get(`${API}/api/avisos?posicion=lateral-izquierda`),
      axios.get(`${API}/api/avisos?posicion=lateral-derecha`),
      axios.get(`${API}/api/avisos?posicion=banner-horizontal`),
    ]);
    return {
      noticias:     notsRes.data.noticias || [],
      breaking:     breakRes.data.noticias || [],
      avisosIzq:    izqRes.data || [],
      avisosDer:    derRes.data || [],
      avisosBanner: bannerRes.data || [],
    };
  } catch (err) {
    console.error(err);
    return { noticias: [], breaking: [], avisosIzq: [], avisosDer: [], avisosBanner: [] };
  }
}

export default async function PaginaSeccion({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const seccion = SECCIONES[slug];
  if (!seccion) return <div>Sección no encontrada</div>;

  const { noticias, breaking, avisosIzq, avisosDer, avisosBanner } = await getData(slug);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <Header />
      <BreakingTicker noticias={breaking} />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '148px 1fr 260px', gap: '24px' }}>

        <aside>
          <AdLateral avisos={avisosIzq} lado="izquierda" />
        </aside>

        <main style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', background: seccion.color, color: '#fff', padding: '6px 14px' }}>
              {seccion.nombre}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#c8c5be' }} />
          </div>

          {noticias.length === 0 ? (
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#9c9a94', padding: '40px 0' }}>
              No hay noticias en esta sección todavía.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
              {noticias.map((n: any) => (
                <div key={n.id} style={{ borderTop: `2px solid ${seccion.color}`, paddingTop: '12px' }}>
                  {n.imagen_url ? (
                    <img src={n.imagen_url} alt={n.titulo} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', marginBottom: '10px' }} />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '16/9', background: '#edecea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#9c9a94', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '10px' }}>
                      Sin imagen
                    </div>
                  )}
                  <h2 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '17px', fontWeight: 600, lineHeight: 1.25, marginBottom: '8px' }}>
                    <Link href={`/noticia/${n.slug}`} style={{ color: '#111110', textDecoration: 'none' }}>
                      {n.titulo}
                    </Link>
                  </h2>
                  {n.copete && (
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#2d2d2b', lineHeight: 1.5, marginBottom: '8px' }}>
                      {n.copete}
                    </p>
                  )}
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94' }}>
                    {n.autor_nombre} · {tiempoRelativo(n.fecha_publicacion)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <AdBanner avisos={avisosBanner} />
        </main>

        <aside>
          <AdLateral avisos={avisosDer} lado="derecha" />
        </aside>

      </div>

      <Footer />
    </div>
  );
}