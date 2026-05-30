'use client';

import { useState, useEffect, useCallback } from 'react';

interface Aviso {
  id: number;
  anunciante: string;
  imagen_url: string | null;
  url_destino: string;
}

const INTERVAL_MS = 5000;

function BannerSlot({ avisos }: { avisos: Aviso[] }) {
  const lista = avisos.slice(0, 3);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = useCallback(() => {
    if (lista.length <= 1) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % lista.length);
      setAnimating(false);
    }, 300);
  }, [lista.length]);

  useEffect(() => {
    if (lista.length <= 1) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [lista.length, next]);

  if (!lista.length) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        borderRight: '1px solid #e2e0da',
        background: '#f9f8f5',
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          letterSpacing: '.1em',
          color: '#c8c6c0',
          textTransform: 'uppercase',
        }}>Disponible</span>
      </div>
    );
  }

  const aviso = lista[current];

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      borderRight: '1px solid #e2e0da',
      height: '100%',
    }}>
      <a
        href={aviso.url_destino ? (aviso.url_destino.startsWith('http') ? aviso.url_destino : `https://${aviso.url_destino}`) : '#'}
        target={aviso.url_destino ? '_blank' : undefined}
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          inset: 0,
          textDecoration: 'none',
          cursor: aviso.url_destino ? 'pointer' : 'default',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(4px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          padding: '8px',
        }}
      >
        {aviso.imagen_url ? (
          <img
            src={aviso.imagen_url}
            alt={aviso.anunciante}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <span style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 700,
            color: '#2d2d2b',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>{aviso.anunciante}</span>
        )}
      </a>

      {lista.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '4px',
          zIndex: 2,
        }}>
          {lista.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === current ? '14px' : '4px',
                height: '4px',
                borderRadius: '2px',
                background: i === current ? '#2d2d2b' : '#c8c6c0',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdBannerMain({ slots }: { slots: Aviso[][] }) {
  return (
    <div style={{
      position: 'relative',
      height: '120px',
      display: 'flex',
      background: '#f9f8f5',
      overflow: 'hidden',
    }}>
      <span style={{
        position: 'absolute',
        top: '6px',
        left: '10px',
        zIndex: 3,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '9px',
        letterSpacing: '.15em',
        textTransform: 'uppercase',
        color: '#9c9a94',
        pointerEvents: 'none',
      }}>Publicidad</span>
      {slots.map((avisos, i) => (
        <BannerSlot key={i} avisos={avisos} />
      ))}
    </div>
  );
}
