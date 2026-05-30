// admin/src/pages/Publicidad.tsx
import { useEffect, useState } from 'react';
import api from '../api';

const POSICIONES = [
  'lateral-izquierda', 'lateral-derecha',
  'banner-main-1', 'banner-main-2', 'banner-main-3',
  'banner-main-4', 'banner-main-5', 'banner-main-6',
  'banner-top', 'banner-horizontal', 'banner-medio', 'breaking',
];

const VACIO = {
  anunciante: '', imagen_url: '', url_destino: '',
  posicion: 'lateral-izquierda', prioridad: 0,
  activo: true, fecha_inicio: '', fecha_fin: '',
};

export default function Publicidad() {
  const [avisos, setAvisos]     = useState<any[]>([]);
  const [form, setForm]         = useState<any>(VACIO);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [guardando, setGuardando]   = useState(false);
  const [mensaje, setMensaje]       = useState('');

  async function cargar() {
    const { data } = await api.get('/api/avisos/admin/todos');
    setAvisos(data);
  }

  useEffect(() => { cargar(); }, []);

  function cambiar(campo: string, valor: any) {
    setForm((f: any) => ({ ...f, [campo]: valor }));
  }

  async function guardar() {
    setGuardando(true);
    setMensaje('');
    try {
      if (editandoId) {
        await api.put(`/api/avisos/${editandoId}`, form);
        setMensaje('✓ Aviso actualizado');
      } else {
        await api.post('/api/avisos', form);
        setMensaje('✓ Aviso creado');
      }
      setForm(VACIO);
      setEditandoId(null);
      cargar();
    } catch {
      setMensaje('✗ Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  function editar(aviso: any) {
    setForm({ ...VACIO, ...aviso });
    setEditandoId(aviso.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function eliminar(id: number, anunciante: string) {
    if (!window.confirm(`¿Eliminar aviso de "${anunciante}"?`)) return;
    await api.delete(`/api/avisos/${id}`);
    cargar();
  }

  async function toggleActivo(aviso: any) {
    await api.put(`/api/avisos/${aviso.id}`, { ...aviso, activo: !aviso.activo });
    cargar();
  }

  const label = (texto: string) => (
    <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b6b68', marginBottom: '6px' }}>
      {texto}
    </label>
  );

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e2e0da', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, background: '#fff' };

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#111110', marginBottom: '28px' }}>Publicidad</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Formulario */}
        <div style={{ background: '#fff', border: '1px solid #e2e0da', padding: '24px' }}>
          <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: '#111110', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e2e0da' }}>
            {editandoId ? 'Editar aviso' : 'Nuevo aviso'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>{label('Anunciante *')}<input type="text" value={form.anunciante} onChange={(e) => cambiar('anunciante', e.target.value)} style={inputStyle} placeholder="Nombre del anunciante" /></div>
            <div>{label('URL de la imagen')}<input type="url" value={form.imagen_url} onChange={(e) => cambiar('imagen_url', e.target.value)} style={inputStyle} placeholder="https://..." /></div>
            {form.imagen_url && <img src={form.imagen_url} alt="preview" style={{ width: '100%', maxHeight: '120px', objectFit: 'contain', border: '1px solid #e2e0da' }} onError={(e: any) => e.target.style.display = 'none'} />}
            <div>{label('URL destino (al hacer click)')}<input type="url" value={form.url_destino} onChange={(e) => cambiar('url_destino', e.target.value)} style={inputStyle} placeholder="https://..." /></div>
            <div>
              {label('Posición')}
              <select value={form.posicion} onChange={(e) => cambiar('posicion', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {POSICIONES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>{label('Fecha inicio')}<input type="date" value={form.fecha_inicio} onChange={(e) => cambiar('fecha_inicio', e.target.value)} style={inputStyle} /></div>
              <div>{label('Fecha fin')}<input type="date" value={form.fecha_fin} onChange={(e) => cambiar('fecha_fin', e.target.value)} style={inputStyle} /></div>
            </div>
            <div>{label('Prioridad (mayor = primero)')}<input type="number" value={form.prioridad} onChange={(e) => cambiar('prioridad', Number(e.target.value))} style={inputStyle} min={0} /></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#2d2d2b' }}>
              <input type="checkbox" checked={form.activo} onChange={(e) => cambiar('activo', e.target.checked)} style={{ width: '16px', height: '16px' }} />
              Aviso activo
            </label>
          </div>

          {mensaje && (
            <div style={{ background: mensaje.startsWith('✓') ? '#f0fff4' : '#fff5f5', border: `1px solid ${mensaje.startsWith('✓') ? '#c6f6d5' : '#fed7d7'}`, color: mensaje.startsWith('✓') ? '#1a5e2e' : '#c53030', padding: '8px 12px', margin: '16px 0 0', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>
              {mensaje}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={guardar} disabled={guardando || !form.anunciante} style={{ flex: 1, background: guardando ? '#9c9a94' : '#111110', color: '#fff', border: 'none', padding: '11px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', cursor: guardando ? 'not-allowed' : 'pointer' }}>
              {guardando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Crear aviso'}
            </button>
            {editandoId && (
              <button onClick={() => { setForm(VACIO); setEditandoId(null); setMensaje(''); }} style={{ background: 'transparent', color: '#6b6b68', border: '1px solid #e2e0da', padding: '11px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', cursor: 'pointer' }}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista de avisos */}
        <div>
          <div style={{ background: '#fff', border: '1px solid #e2e0da' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e0da' }}>
              <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', color: '#111110' }}>Avisos cargados ({avisos.length})</h2>
            </div>
            {avisos.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94' }}>No hay avisos cargados</div>
            ) : (
              avisos.map((a) => (
                <div key={a.id} style={{ padding: '16px 20px', borderBottom: '1px solid #f0ede8', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  {a.imagen_url && <img src={a.imagen_url} alt={a.anunciante} style={{ width: '60px', height: '40px', objectFit: 'contain', border: '1px solid #e2e0da', flexShrink: 0 }} onError={(e: any) => e.target.style.display = 'none'} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#111110', marginBottom: '3px' }}>{a.anunciante}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94' }}>{a.posicion}</div>
                    {a.fecha_inicio && <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94' }}>{a.fecha_inicio} → {a.fecha_fin}</div>}
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9c9a94', marginTop: '2px' }}>👁 {a.impresiones} · 🖱 {a.clicks}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => toggleActivo(a)} style={{ background: a.activo ? '#f0fff4' : '#f7f6f3', color: a.activo ? '#1a5e2e' : '#9c9a94', border: `1px solid ${a.activo ? '#c6f6d5' : '#e2e0da'}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '3px 8px', cursor: 'pointer', letterSpacing: '.05em' }}>
                      {a.activo ? '✓ Activo' : '○ Inactivo'}
                    </button>
                    <button onClick={() => editar(a)} style={{ background: 'transparent', color: '#0052cc', border: '1px solid #e2e0da', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '3px 8px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => eliminar(a.id, a.anunciante)} style={{ background: 'transparent', color: '#e8000d', border: '1px solid #fecaca', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', padding: '3px 8px', cursor: 'pointer' }}>Eliminar</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}