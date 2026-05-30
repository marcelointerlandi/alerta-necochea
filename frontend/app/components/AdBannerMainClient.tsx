'use client';
import dynamic from 'next/dynamic';

interface Aviso {
  id: number;
  anunciante: string;
  imagen_url: string | null;
  url_destino: string;
}

const AdBannerMainInner = dynamic(() => import('./AdBannerMain'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '120px', background: '#f9f8f5' }} />
  ),
});

export default function AdBannerMainClient({ slots }: { slots: Aviso[][] }) {
  return (
    <div className="banner-main" style={{ borderTop: '1px solid #e2e0da', borderBottom: '1px solid #e2e0da' }}>
      <AdBannerMainInner slots={slots} />
    </div>
  );
}
