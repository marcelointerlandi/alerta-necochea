// frontend/app/components/BreakingTicker.tsx
'use client';

interface Noticia {
  id: number;
  titulo: string;
  slug: string;
}

export default function BreakingTicker({ noticias }: { noticias: Noticia[] }) {
  if (!noticias?.length) return null;

  // Duplicamos para el efecto infinito
  const items = [...noticias, ...noticias];

  return (
    <div style={{ background: '#e8000d', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
      <div style={{ background: '#a30009', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: '#fff', padding: '8px 16px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        Ahora
      </div>
      <div style={{ overflow: 'hidden', flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          gap: '60px',
          animation: 'ticker 28s linear infinite',
          whiteSpace: 'nowrap',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          color: '#fff',
          letterSpacing: '.03em',
          padding: '8px 0',
        }}>
          {items.map((n, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ opacity: .6 }}>//</span>
              {n.titulo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}