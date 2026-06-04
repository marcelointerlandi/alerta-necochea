// admin/src/pages/Noticias.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Noticias() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [filtro, setFiltro]     = useState('');
  const [loading, setLoading]   = useState(true);

  async function cargar() {
    setLoading(true);
    try {
      const { data } = await api.get('/api/noticias/admin/todas?limite=100');
      setNoticias(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function eliminar(id: number, titulo: string) {
    if (!window.confirm(`¿Eliminár "${titulo}"?`)) return;
    await api.delete(`/api/noticias/${id}`);
    cargar();
  }

  async function togglePublicar(n: any) {
    await api.put(`/api/noticias/${n.id}`, { ...n, publicada: !n.publicada });
    cargar();
  }

  const filtradas = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="page-padding">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#111110', margin: 0 }}>Noticias</h1>
        <Link to="/noticias/nueva" style={{ background: '#e8000d', color: '#fff', padding: '10px 20px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          + Nueva noticia
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por título..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e0da', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', marginBottom: '20px', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
      />

      {loading ? (
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94', padding: '40px', textAlign: 'center' }}>Cargando...</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e0da' }}>
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7f6f3' }}>
                  <th style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da', whiteSpace: 'nowrap' }}>Título</th>
                  <th className="col-hide-mobile" style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da', whiteSpace: 'nowrap' }}>Sección</th>
                  <th style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da', whiteSpace: 'nowrap' }}>Estado</th>
                  <th className="col-hide-mobile" style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da', whiteSpace: 'nowrap' }}>Vistas</th>
                  <th className="col-hide-mobile" style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da', whiteSpace: 'nowrap' }}>Fecha</th>
                  <th style={{ padding: '10px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b6b68', textAlign: 'left', borderBottom: '1px solid #e2e0da', whiteSpace: 'nowrap' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((n) => (
                  <tr key={n.id} style={{ borderBottom: '1px solid #f0ede8' }}>
                    <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#111110', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.titulo}</div>
                      {n.es_destacada ? <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#e8000d', letterSpacing: '.05em' }}>★ DESTACADA</span> : null}
                      {n.es_breaking ? <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#7b1fa2', letterSpacing: '.05em', marginLeft: '6px' }}>⚡ BREAKING</span> : null}
                    </td>
                    <td className="col-hide-mobile" style={{ padding: '12px 16px' }}>
                      <span style={{ background: n.seccion_color, color: '#fff', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px' }}>
                        {n.seccion_nombre}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => togglePublicar(n)}
                        style={{ background: n.publicada ? '#f0fff4' : '#fffaf0', color: n.publicada ? '#1a5e2e' : '#e65100', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px', border: `1px solid ${n.publicada ? '#c6f6d5' : '#feebc8'}`, cursor: 'pointer' }}
                      >
                        {n.publicada ? '✓ Pub.' : '○ Bor.'}
                      </button>
                    </td>
                    <td className="col-hide-mobile" style={{ padding: '12px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94' }}>
                      {n.vistas}
                    </td>
                    <td className="col-hide-mobile" style={{ padding: '12px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', whiteSpace: 'nowrap' }}>
                      {new Date(n.fecha_publicacion).toLocaleDateString('es-AR')}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <Link to={`/noticias/editar/${n.id}`} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#0052cc', textDecoration: 'none', marginRight: '12px' }}>
                        Editar
                      </Link>
                      <button
                        onClick={() => eliminar(n.id, n.titulo)}
                        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#e8000d', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtradas.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94' }}>
              No se encontraron noticias
            </div>
          )}
        </div>
      )}
    </div>
  );
}