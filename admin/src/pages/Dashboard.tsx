// admin/src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats]     = useState({ total: 0, publicadas: 0, borradores: 0, avisos: 0 });
  const [ultimas, setUltimas] = useState<any[]>([]);

  useEffect(() => {
    async function cargar() {
      try {
        const [nots, avs] = await Promise.all([
          api.get('/api/noticias/admin/todas?limite=100'),
          api.get('/api/avisos/admin/todos'),
        ]);
        const todas = nots.data;
        setStats({
          total:      todas.length,
          publicadas: todas.filter((n: any) => n.publicada).length,
          borradores: todas.filter((n: any) => !n.publicada).length,
          avisos:     avs.data.filter((a: any) => a.activo).length,
        });
        setUltimas(todas.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }
    cargar();
  }, []);

  const stat = (valor: number, label: string, color: string) => (
    <div style={{ background: '#fff', border: '1px solid #e2e0da', padding: '16px 20px', borderTop: `3px solid ${color}` }}>
      <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '32px', fontWeight: 700, color: '#111110' }}>{valor}</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b6b68', marginTop: '4px' }}>{label}</div>
    </div>
  );

  return (
    <div className="page-padding">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#111110', marginBottom: '4px', margin: 0 }}>Dashboard</h1>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94', marginTop: '4px' }}>
            {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <Link to="/noticias/nueva" style={{ background: '#e8000d', color: '#fff', padding: '10px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          + Nueva noticia
        </Link>
      </div>

      <div className="stats-grid">
        {stat(stats.total,      'Total noticias', '#111110')}
        {stat(stats.publicadas, 'Publicadas',      '#1a5e2e')}
        {stat(stats.borradores, 'Borradores',      '#e65100')}
        {stat(stats.avisos,     'Avisos activos',  '#0052cc')}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e0da' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e0da', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: '#111110', margin: 0 }}>Últimas noticias cargadas</h2>
          <Link to="/noticias" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#6b6b68', textDecoration: 'none' }}>Ver todas →</Link>
        </div>
        <div className="table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7f6f3' }}>
                <th style={{ padding: '10px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da' }}>Título</th>
                <th className="col-hide-mobile" style={{ padding: '10px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da' }}>Sección</th>
                <th style={{ padding: '10px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da' }}>Estado</th>
                <th className="col-hide-mobile" style={{ padding: '10px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da' }}>Fecha</th>
                <th style={{ padding: '10px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ultimas.map((n) => (
                <tr key={n.id} style={{ borderBottom: '1px solid #f0ede8' }}>
                  <td style={{ padding: '12px 20px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#111110', maxWidth: '220px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.titulo}</div>
                  </td>
                  <td className="col-hide-mobile" style={{ padding: '12px 20px' }}>
                    <span style={{ background: n.seccion_color, color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px' }}>
                      {n.seccion_nombre}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <span style={{ background: n.publicada ? '#f0fff4' : '#fffaf0', color: n.publicada ? '#1a5e2e' : '#e65100', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px', border: `1px solid ${n.publicada ? '#c6f6d5' : '#feebc8'}` }}>
                      {n.publicada ? 'Publicada' : 'Borrador'}
                    </span>
                  </td>
                  <td className="col-hide-mobile" style={{ padding: '12px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94' }}>
                    {new Date(n.fecha_publicacion).toLocaleDateString('es-AR')}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <Link to={`/noticias/editar/${n.id}`} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#0052cc', textDecoration: 'none', letterSpacing: '.05em' }}>
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
