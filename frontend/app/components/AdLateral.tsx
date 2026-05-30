'use client';

import { useState, useEffect } from 'react';

interface Aviso {
  id: number;
  anunciante: string;
  imagen_url: string | null;
  url_destino: string;
}

const INTERVALO = 7000;
const ALTURA = '320px';

export default function AdLateral({ avisos, lado }: { avisos: Aviso[], lado: string }) {
  const [indice, setIndice] = useState(0);
  const [visible, setVisible] = useState(true);

  const lista = avisos?.slice(0, 3) ?? [];

  useEffect(() => {
    if (lista.length <= 1) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndice((i) => (i + 1) % lista.length);
        setVisible(true);
      }, 300);
    }, INTERVALO);
    return () => clearInterval(timer);
  }, [lista.length]);

  const labelStyle: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '9px',
    letterSpacing: '.15em',
    textTransform: 'uppercase',
    color: '#9c9a94',
    padding: '4px 8px',
    borderBottom: '1px solid #e2e0da',
    background: '#edecea',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const contenedorStyle: React.CSSProperties = {
    background: '#f9f8f5',
    border: '1px solid #e2e0da',
    display: 'flex',
    flexDirection: 'column',
    height: ALTURA,
  };

  if (!lista.length) {
    return (
      <div style={contenedorStyle}>
        <div style={labelStyle}><span>Publicidad</span></div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', textAlign: 'center' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', lineHeight: 1.5 }}>Espacio publicitario disponible</span>
        </div>
      </div>
    );
  }

  const aviso = lista[indice];

  return (
    <div style={contenedorStyle}>
      <div style={labelStyle}>
        <span>Publicidad</span>
        {lista.length > 1 && (
          <span style={{ display: 'flex', gap: '4px' }}>
            {lista.map((_, i) => (
              <span
                key={i}
                onClick={() => { setVisible(false); setTimeout(() => { setIndice(i); setVisible(true); }, 300); }}
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === indice ? '#9c9a94' : '#ccc', cursor: 'pointer', display: 'inline-block' }}
              />
            ))}
          </span>
        )}
      </div>
      <div
        onClick={() => aviso.url_destino && window.open(aviso.url_destino.startsWith('http') ? aviso.url_destino : `https://${aviso.url_destino}`, '_blank')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          cursor: aviso.url_destino ? 'pointer' : 'default',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        {aviso.imagen_url ? (
          <img src={aviso.imagen_url} alt={aviso.anunciante} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#2d2d2b', textAlign: 'center' }}>
            {aviso.anunciante}
          </div>
        )}
      </div>
    </div>
  );
}
