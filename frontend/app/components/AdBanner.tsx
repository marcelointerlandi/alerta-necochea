'use client';

import { useState, useEffect, useCallback } from 'react';

interface Aviso {
  id: number;
  anunciante: string;
  imagen_url: string | null;
  url_destino: string;
}

const INTERVAL_MS = 4000;

export default function AdBanner({ avisos }: { avisos?: Aviso[] }) {
  const lista = avisos?.slice(0, 3) || [];
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  }, [animating, current]);

  const next = useCallback(() => {
    goTo((current + 1) % Math.max(lista.length, 1));
  }, [current, lista.length, goTo]);

  useEffect(() => {
    if (lista.length <= 1) return;
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [lista.length, next]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    marginBottom: '24px',
    overflow: 'hidden',
    background: '#f9f8f5',
    border: '1px solid #e2e0da',
    height: '160px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '9px',
    letterSpacing: '.15em',
    textTransform: 'uppercase',
    color: '#9c9a94',
  };

  // Estado vacío
  if (!lista.length) {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px 28px', height: '100%' }}>
          <span style={labelStyle}>Publicidad</span>
          <div style={{ width: '1px', height: '48px', background: '#e2e0da', flexShrink: 0 }} />
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94' }}>
            Espacio publicitario disponible
          </div>
        </div>
      </div>
    );
  }

  const aviso = lista[current];

  return (
    <div style={containerStyle}>
      {/* Label "Publicidad" */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '12px',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={labelStyle}>Publicidad</span>
        <div style={{ width: '1px', height: '14px', background: '#d0cec8' }} />
        <span style={{ ...labelStyle, letterSpacing: '.05em' }}>
          {current + 1}/{lista.length}
        </span>
      </div>

      {/* Slide */}
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
          transform: animating ? 'translateY(6px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {aviso.imagen_url ? (
          <img
            src={aviso.imagen_url}
            alt={aviso.anunciante}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '20px',
            fontWeight: 700,
            color: '#2d2d2b',
            letterSpacing: '-0.01em',
          }}>
            {aviso.anunciante}
          </div>
        )}
      </a>

      {/* Dots de navegación */}
      {lista.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          zIndex: 2,
        }}>
          {lista.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Publicidad ${i + 1}`}
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                background: i === current ? '#2d2d2b' : '#c8c6c0',
                padding: 0,
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* Flechas laterales */}
      {lista.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + lista.length) % lista.length)}
            aria-label="Anterior"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid #e2e0da',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#555',
              zIndex: 2,
              transition: 'background 0.2s',
            }}
          >
            ‹
          </button>
          <button
            onClick={() => next()}
            aria-label="Siguiente"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid #e2e0da',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#555',
              zIndex: 2,
              transition: 'background 0.2s',
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
