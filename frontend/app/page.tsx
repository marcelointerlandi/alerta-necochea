// frontend/app/page.tsx
import axios from 'axios';
import Header from './components/Header';
import BreakingTicker from './components/BreakingTicker';
import Hero from './components/Hero';
import SeccionGrid from './components/SeccionGrid';
import AdBanner from './components/AdBanner';
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
  const portada = await getPortada();
  const [avisosIzq, avisosDer, avisosBanner, avisosBannerTop] = await Promise.all([
    getAvisos('lateral-izquierda'),
    getAvisos('lateral-derecha'),
    getAvisos('banner-horizontal'),
    getAvisos('banner-top'),
  ]);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <Header />
      <BreakingTicker noticias={portada.breaking} />

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '148px 1fr 260px', gap: '24px' }}>
        
        {/* Columna izquierda */}
        <aside>
          <AdLateral avisos={avisosIzq} lado="izquierda" />
        </aside>

        {/* Contenido principal */}
        <main style={{ minWidth: 0 }}>
          <AdBanner avisos={avisosBannerTop} />
          <Hero destacadas={portada.destacadas} />

          <SeccionGrid
            titulo="Local"
            color="#0052cc"
            noticias={portada.locales}
          />

          <SeccionGrid
            titulo="Nacional"
            color="#111111"
            noticias={portada.nacionales}
          />

          <AdBanner avisos={avisosBanner} />

          <SeccionGrid
            titulo="Internacional"
            color="#1a5e2e"
            noticias={portada.internacionales}
          />

          <SeccionGrid
            titulo="Deportes"
            color="#7b1fa2"
            noticias={portada.deportes}
          />

          <SeccionGrid
            titulo="Economia"
            color="#e65100"
            noticias={portada.economia}
          />

          <SeccionGrid
  titulo="Videos"
  color="#c41230"
  noticias={portada.videos}
/>

        </main>

        {/* Columna derecha */}
        <aside>
          <AdLateral avisos={avisosDer} lado="derecha" />
        </aside>

      </div>

      <Footer />
    </div>
  );
}