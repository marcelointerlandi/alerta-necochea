// frontend/app/components/AdLateral.tsx
'use client';

interface Aviso {
  id: number;
  anunciante: string;
  imagen_url: string | null;
  url_destino: string;
}

export default function AdLateral({ avisos, lado }: { avisos: Aviso[], lado: string }) {
  const altura = lado === 'derecha' ? '320px' : '200px';

  if (!avisos?.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ background: '#f9f8f5', border: '1px solid #e2e0da', height: altura, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#9c9a94', padding: '4px 8px', borderBottom: '1px solid #e2e0da', background: '#edecea', display: 'block' }}>Publicidad</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', lineHeight: 1.5 }}>Espacio publicitario disponible</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {avisos.map((aviso) => (
        <div key={aviso.id} style={{ background: '#f9f8f5', border: '1px solid #e2e0da', display: 'flex', flexDirection: 'column', minHeight: altura }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#9c9a94', padding: '4px 8px', borderBottom: '1px solid #e2e0da', background: '#edecea', display: 'block' }}>Publicidad</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', cursor: aviso.url_destino ? 'pointer' : 'default' }}
            onClick={() => aviso.url_destino && window.open(aviso.url_destino.startsWith('http') ? aviso.url_destino : `https://${aviso.url_destino}`, '_blank')}>
            {aviso.imagen_url ? (
              <img src={aviso.imagen_url} alt={aviso.anunciante} style={{ width: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#2d2d2b', padding: '20px 0' }}>
                {aviso.anunciante}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}