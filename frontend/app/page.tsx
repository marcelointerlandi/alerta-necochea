// frontend/app/page.tsx
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import axios from 'axios';
import Header from './components/Header';
import BreakingTicker from './components/BreakingTicker';
import Hero from './components/Hero';
import SeccionGrid from './components/SeccionGrid';
import AdBanner from './components/AdBannerClient';
import AdBannerMain from './components/AdBannerMainClient';
import AdLateral from './components/AdLateral';
import Footer from './components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getPortada() {
  try {
    const { data } = await axios.get(`${API}/api/noticias/portada`);
    return data;
  } catch {
    return { destacadas: [], breaking: [], locales: [], nacionales: [], internacionales: [], deportes: [], economia: [], opinion: [] };
  }
}

async function getAvisos(posicion: string) {
  try {
    const { data } = await axios.get(`${API}/api/avisos?posicion=${posicion}`);
    return data;
  } catch {
    return [];
  }
}

export default async function Portada() {
  const cookieStore = await cookies();
  const previewCookie = cookieStore.get('__inf_preview');
  const isPreview = previewCookie?.value === process.env.PREVIEW_TOKEN && !!process.env.PREVIEW_TOKEN;

  if (process.env.COMING_SOON === 'true' && !isPreview) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '32px',
      }}>
        <img
          src="/proximamente.png"
          alt="Informate Necochea — Próximamente"
          style={{ maxWidth: '560px', width: '100%', objectFit: 'contain' }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '14px',
          color: '#2d2d2b',
        }}>
          <a href="mailto:informatenecochea@gmail.com" style={{ color: '#2d2d2b', textDecoration: 'none' }}>
            ✉ informatenecochea@gmail.com
          </a>
          <a href="https://wa.me/542262218882" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none' }}>
            ● WhatsApp: 2262 218882
          </a>
        </div>
      </div>
    );
  }

  const portada = await getPortada();
  const [
    avisosIzq, avisosDer,
    avisosBannerTop, avisosBanner, avisosBannerNacional,
    avisosBannerMedio, avisosBannerDeportes, avisosBannerEconomia,
    main1, main2, main3, main4, main5, main6,
  ] = await Promise.all([
    getAvisos('lateral-izquierda'),
    getAvisos('lateral-derecha'),
    getAvisos('banner-top'),
    getAvisos('banner-horizontal'),
    getAvisos('banner-nacional'),
    getAvisos('banner-medio'),
    getAvisos('banner-deportes'),
    getAvisos('banner-economia'),
    getAvisos('banner-main-1'),
    getAvisos('banner-main-2'),
    getAvisos('banner-main-3'),
    getAvisos('banner-main-4'),
    getAvisos('banner-main-5'),
    getAvisos('banner-main-6'),
  ]);

  // Pool de todos los avisos laterales para reutilizar en banners entre secciones
  const poolMobile = [...avisosIzq, ...avisosDer];
  const bNacional  = avisosBannerNacional.length  ? avisosBannerNacional  : poolMobile;
  const bDeportes  = avisosBannerDeportes.length  ? avisosBannerDeportes  : poolMobile;
  const bEconomia  = avisosBannerEconomia.length  ? avisosBannerEconomia  : poolMobile;

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <Header />
      <BreakingTicker noticias={portada.breaking} />

      <AdBannerMain slots={[main1, main2, main3, main4, main5, main6]} />

      <div className="page-grid">

        {/* Columna izquierda */}
        <aside className="col-lateral-izq">
          <AdLateral avisos={avisosIzq} lado="izquierda" />
        </aside>

        {/* Contenido principal */}
        <main style={{ minWidth: 0 }}>
          <Hero destacadas={portada.destacadas} />

          <AdBanner avisos={avisosBannerTop} />
          <SeccionGrid titulo="Local" color="#0052cc" noticias={portada.locales} />

          <AdBanner avisos={avisosBanner} />

          <SeccionGrid titulo="Nacional" color="#111111" noticias={portada.nacionales} />

          <AdBanner avisos={bNacional} />

          <SeccionGrid titulo="Internacional" color="#1a5e2e" noticias={portada.internacionales} />

          <AdBanner avisos={avisosBannerMedio} />

          <SeccionGrid titulo="Deportes" color="#7b1fa2" noticias={portada.deportes} />

          <AdBanner avisos={bDeportes} />

          <SeccionGrid titulo="Economia" color="#e65100" noticias={portada.economia} />

          <AdBanner avisos={bEconomia} />

          <SeccionGrid titulo="Videos" color="#c41230" noticias={portada.videos} />

        </main>

        {/* Columna derecha */}
        <aside className="col-lateral-der">
          <AdLateral avisos={avisosDer} lado="derecha" />
        </aside>

      </div>

      <Footer />
    </div>
  );
}