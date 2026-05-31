// frontend/app/noticia/[slug]/page.tsx
export const dynamic = 'force-dynamic';

import axios from 'axios';
import Header from '../../components/Header';
import BreakingTicker from '../../components/BreakingTicker';
import AdBanner from '../../components/AdBannerClient';
import AdBannerMain from '../../components/AdBannerMainClient';
import AdLateral from '../../components/AdLateral';
import Footer from '../../components/Footer';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SITE = 'https://informatenecochea.com';

export default async function PaginaNoticia({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let noticia: any = null;
  let breaking: any[] = [];
  let avisosIzq: any[] = [];
  let avisosDer: any[] = [];
  let avisosBannerTop: any[] = [];
  let avisosBannerMedio: any[] = [];
  let main1: any[] = [], main2: any[] = [], main3: any[] = [];
  let main4: any[] = [], main5: any[] = [], main6: any[] = [];

  try {
    const [notRes, breakRes, izqRes, derRes, topRes, medioRes, m1, m2, m3, m4, m5, m6] = await Promise.all([
      axios.get(`${API}/api/noticias/${slug}`),
      axios.get(`${API}/api/noticias?breaking=true&limite=8`),
      axios.get(`${API}/api/avisos?posicion=lateral-izquierda`),
      axios.get(`${API}/api/avisos?posicion=lateral-derecha`),
      axios.get(`${API}/api/avisos?posicion=banner-top`),
      axios.get(`${API}/api/avisos?posicion=banner-horizontal`),
      axios.get(`${API}/api/avisos?posicion=banner-main-1`),
      axios.get(`${API}/api/avisos?posicion=banner-main-2`),
      axios.get(`${API}/api/avisos?posicion=banner-main-3`),
      axios.get(`${API}/api/avisos?posicion=banner-main-4`),
      axios.get(`${API}/api/avisos?posicion=banner-main-5`),
      axios.get(`${API}/api/avisos?posicion=banner-main-6`),
    ]);
    noticia           = notRes.data;
    breaking          = breakRes.data.noticias || [];
    avisosIzq         = izqRes.data;
    avisosDer         = derRes.data;
    avisosBannerTop   = topRes.data;
    avisosBannerMedio = medioRes.data;
    main1 = m1.data; main2 = m2.data; main3 = m3.data;
    main4 = m4.data; main5 = m5.data; main6 = m6.data;
  } catch {
    noticia = null;
  }

  if (!noticia) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'IBM Plex Sans', sans-serif" }}>
        <Header />
        <div style={{ maxWidth: '680px', margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94', marginBottom: '16px' }}>404</div>
          <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Noticia no encontrada</h1>
          <Link href="/" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#e8000d', textDecoration: 'none' }}>← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>{noticia.titulo}</title>
      <meta name="description" content={noticia.copete || noticia.titulo} />
      <meta property="og:title" content={noticia.titulo} />
      <meta property="og:description" content={noticia.copete || ''} />
      <meta property="og:url" content={`${SITE}/noticia/${noticia.slug}`} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Informate Necochea" />
      {noticia.imagen_url && <meta property="og:image" content={noticia.imagen_url} />}
      {noticia.imagen_url && <meta property="og:image:width" content="1200" />}
      {noticia.imagen_url && <meta property="og:image:height" content="630" />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={noticia.titulo} />
      <meta name="twitter:description" content={noticia.copete || ''} />
      {noticia.imagen_url && <meta name="twitter:image" content={noticia.imagen_url} />}

    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <Header />
      <BreakingTicker noticias={breaking} />

      <AdBannerMain slots={[main1, main2, main3, main4, main5, main6]} />

      <div className="noticia-grid">
        <aside className="noticia-col-izq">
          <AdLateral avisos={avisosIzq} lado="izquierda" />
        </aside>

        <article style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ color: '#9c9a94', textDecoration: 'none' }}>Inicio</Link>
            <span>/</span>
            <Link href={`/seccion/${noticia.seccion_slug}`} style={{ color: noticia.seccion_color, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>
              {noticia.seccion_nombre}
            </Link>
          </div>

          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: noticia.seccion_color, marginBottom: '12px' }}>
            {noticia.seccion_nombre}
          </div>

          <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: '16px', color: '#111110' }}>
            {noticia.titulo}
          </h1>

          {noticia.copete && (
            <p style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontStyle: 'italic', fontSize: '18px', lineHeight: 1.6, color: '#2d2d2b', marginBottom: '20px', borderLeft: `3px solid ${noticia.seccion_color}`, paddingLeft: '16px' }}>
              {noticia.copete}
            </p>
          )}

          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e0da' }}>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#111110' }}>
              {noticia.autor_nombre || noticia.autor_externo || 'Redacción'}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94' }}>
              {new Date(noticia.fecha_publicacion).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}{noticia.vistas} lecturas
            </div>
          </div>

          <AdBanner avisos={avisosBannerTop} />

          {noticia.video_url && (
            <div style={{ marginBottom: '28px' }}>
              <video src={noticia.video_url} controls style={{ width: '100%', maxHeight: '520px', display: 'block', background: '#000' }} />
            </div>
          )}

          {noticia.imagen_url && (
            <figure style={{ margin: '0 0 28px' }}>
              <img src={noticia.imagen_url} alt={noticia.titulo} style={{ width: '100%', display: 'block', maxHeight: '500px', objectFit: 'cover' }} />
              {noticia.imagen_caption && (
                <figcaption style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', marginTop: '8px', fontStyle: 'italic' }}>{noticia.imagen_caption}</figcaption>
              )}
            </figure>
          )}

          {noticia.cuerpo && (
            <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '17px', lineHeight: 1.8, color: '#2d2d2b', marginBottom: '32px' }} dangerouslySetInnerHTML={{ __html: noticia.cuerpo }} />
          )}

          {noticia.imagen_url_2 && (
            <figure style={{ margin: '0 0 28px' }}>
              <img src={noticia.imagen_url_2} alt={noticia.imagen_caption_2 || ''} style={{ width: '100%', display: 'block', maxHeight: '500px', objectFit: 'cover' }} />
              {noticia.imagen_caption_2 && (
                <figcaption style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', marginTop: '8px', fontStyle: 'italic' }}>{noticia.imagen_caption_2}</figcaption>
              )}
            </figure>
          )}

          {noticia.imagen_url_3 && (
            <figure style={{ margin: '0 0 28px' }}>
              <img src={noticia.imagen_url_3} alt={noticia.imagen_caption_3 || ''} style={{ width: '100%', display: 'block', maxHeight: '500px', objectFit: 'cover' }} />
              {noticia.imagen_caption_3 && (
                <figcaption style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', marginTop: '8px', fontStyle: 'italic' }}>{noticia.imagen_caption_3}</figcaption>
              )}
            </figure>
          )}

          <AdBanner avisos={avisosBannerMedio} />

          {noticia.relacionadas?.length > 0 && (
            <div style={{ borderTop: '2px solid #111110', paddingTop: '24px' }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: '#111110', marginBottom: '16px' }}>
                También en {noticia.seccion_nombre}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {noticia.relacionadas.map((r: any) => (
                  <div key={r.slug} style={{ borderTop: `2px solid ${r.seccion_color}`, paddingTop: '10px' }}>
                    <h3 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '14px', fontWeight: 600, lineHeight: 1.3 }}>
                      <Link href={`/noticia/${r.slug}`} style={{ color: '#111110', textDecoration: 'none' }}>{r.titulo}</Link>
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="noticia-col-der">
          <AdLateral avisos={avisosDer} lado="derecha" />
        </aside>
      </div>

      <Footer />
    </div>
    </>
  );
}