// admin/src/pages/EditarNoticia.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import SubirArchivo from '../components/SubirArchivo';

const SECCIONES = [
  { id: 1, nombre: 'Local',         color: '#0052cc' },
  { id: 2, nombre: 'Nacional',      color: '#111111' },
  { id: 3, nombre: 'Internacional', color: '#1a5e2e' },
  { id: 4, nombre: 'Deportes',      color: '#7b1fa2' },
  { id: 5, nombre: 'Economía',      color: '#e65100' },
  { id: 6, nombre: 'Videos',        color: '#c41230' },
];

const VACIO = {
  titulo: '', copete: '', cuerpo: '',
  imagen_url: '', imagen_caption: '',
  imagen_url_2: '', imagen_caption_2: '',
  imagen_url_3: '', imagen_caption_3: '',
  video_url: '', es_video: false,
  seccion_id: 1, autor_externo: '',
  es_destacada: false, es_breaking: false, es_opinion: false, publicada: false,
};

export default function EditarNoticia() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const esNueva       = !id;
  const [form, setForm]       = useState<any>(VACIO);
  const [loading, setLoading]     = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje]     = useState('');

  useEffect(() => {
    if (!esNueva) {
      setLoading(true);
      api.get('/api/noticias/admin/todas').then(({ data }) => {
        const n = data.find((x: any) => x.id === Number(id));
        if (n) setForm({ ...VACIO, ...n });
        setLoading(false);
      });
    }
  }, [id]);

  function cambiar(campo: string, valor: any) {
    setForm((f: any) => ({ ...f, [campo]: valor }));
  }

  async function guardar(publicar?: boolean) {
    setGuardando(true);
    setMensaje('');
    try {
      const datos = { ...form, publicada: publicar !== undefined ? publicar : form.publicada };
      if (esNueva) {
        await api.post('/api/noticias', datos);
        setMensaje('✓ Noticia creada correctamente');
        setTimeout(() => navigate('/noticias'), 1200);
      } else {
        await api.put(`/api/noticias/${id}`, datos);
        setMensaje('✓ Noticia actualizada correctamente');
      }
    } catch (err: any) {
      setMensaje('✗ ' + (err.response?.data?.error || 'Error al guardar'));
    } finally {
      setGuardando(false);
    }
  }

  const label = (texto: string) => (
    <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b6b68', marginBottom: '6px' }}>
      {texto}
    </label>
  );

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e2e0da', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const, background: '#fff' };
  const card = { background: '#fff', border: '1px solid #e2e0da', padding: '24px', marginBottom: '16px' };

  if (loading) return <div style={{ padding: '40px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#9c9a94' }}>Cargando...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button onClick={() => navigate('/noticias')} style={{ background: 'none', border: 'none', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#6b6b68', cursor: 'pointer', padding: 0 }}>← Volver</button>
        <h1 style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '28px', fontWeight: 700, color: '#111110' }}>{esNueva ? 'Nueva noticia' : 'Editar noticia'}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        <div>
          <div style={card}>
            <div style={{ marginBottom: '16px' }}>
              {label('Título *')}
              <input type="text" value={form.titulo} onChange={(e) => cambiar('titulo', e.target.value)} style={{ ...inputStyle, fontSize: '18px', fontFamily: "'IBM Plex Serif', Georgia, serif", fontWeight: 600 }} placeholder="Título de la noticia" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              {label('Copete')}
              <textarea value={form.copete} onChange={(e) => cambiar('copete', e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Resumen breve..." />
            </div>
            <div>
              {label('Cuerpo de la noticia')}
              <textarea value={form.cuerpo} onChange={(e) => cambiar('cuerpo', e.target.value)} rows={12} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} placeholder="Contenido completo. Podés usar HTML: <p>, <strong>, <em>, <h2>" />
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#111110', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #e2e0da' }}>Imagen principal</h3>
            <SubirArchivo tipo="imagen" label="Imagen 1" urlActual={form.imagen_url} onSubido={(url) => cambiar('imagen_url', url)} />
            <div style={{ marginTop: '12px' }}>
              {label('Descripción foto 1')}
              <input type="text" value={form.imagen_caption} onChange={(e) => cambiar('imagen_caption', e.target.value)} style={inputStyle} placeholder="Crédito o descripción" />
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#111110', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #e2e0da' }}>Imagen adicional 2 (opcional)</h3>
            <SubirArchivo tipo="imagen" label="Imagen 2" urlActual={form.imagen_url_2} onSubido={(url) => cambiar('imagen_url_2', url)} />
            <div style={{ marginTop: '12px' }}>
              {label('Descripción foto 2')}
              <input type="text" value={form.imagen_caption_2} onChange={(e) => cambiar('imagen_caption_2', e.target.value)} style={inputStyle} placeholder="Crédito o descripción" />
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#111110', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #e2e0da' }}>Imagen adicional 3 (opcional)</h3>
            <SubirArchivo tipo="imagen" label="Imagen 3" urlActual={form.imagen_url_3} onSubido={(url) => cambiar('imagen_url_3', url)} />
            <div style={{ marginTop: '12px' }}>
              {label('Descripción foto 3')}
              <input type="text" value={form.imagen_caption_3} onChange={(e) => cambiar('imagen_caption_3', e.target.value)} style={inputStyle} placeholder="Crédito o descripción" />
            </div>
          </div>

          <div style={card}>
            <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#111110', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #e2e0da' }}>Video (opcional)</h3>
            <SubirArchivo tipo="video" label="Video de la nota" urlActual={form.video_url} onSubido={(url) => cambiar('video_url', url)} />
          </div>
        </div>

        <div>
          <div style={{ ...card, position: 'sticky', top: '24px' }}>
            {mensaje && (
              <div style={{ background: mensaje.startsWith('✓') ? '#f0fff4' : '#fff5f5', border: `1px solid ${mensaje.startsWith('✓') ? '#c6f6d5' : '#fed7d7'}`, color: mensaje.startsWith('✓') ? '#1a5e2e' : '#c53030', padding: '8px 12px', marginBottom: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>
                {mensaje}
              </div>
            )}
            <button onClick={() => guardar(true)} disabled={guardando || !form.titulo} style={{ width: '100%', background: guardando ? '#9c9a94' : '#111110', color: '#fff', border: 'none', padding: '11px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', cursor: guardando ? 'not-allowed' : 'pointer', marginBottom: '8px' }}>
              {guardando ? 'Guardando...' : '✓ Publicar'}
            </button>
            <button onClick={() => guardar(false)} disabled={guardando || !form.titulo} style={{ width: '100%', background: 'transparent', color: '#6b6b68', border: '1px solid #e2e0da', padding: '11px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: guardando ? 'not-allowed' : 'pointer' }}>
              Guardar borrador
            </button>
          </div>

          <div style={card}>
            {label('Sección *')}
            <select value={form.seccion_id} onChange={(e) => cambiar('seccion_id', Number(e.target.value))} style={{ ...inputStyle, cursor: 'pointer' }}>
              {SECCIONES.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          <div style={card}>
            {label('Autor')}
            <input type="text" value={form.autor_externo} onChange={(e) => cambiar('autor_externo', e.target.value)} style={inputStyle} placeholder="Nombre del autor" />
          </div>

          <div style={card}>
            {label('Opciones')}
            {[
              { campo: 'es_destacada', label: '★ Noticia destacada' },
              { campo: 'es_breaking',  label: '⚡ Breaking news' },
              { campo: 'es_opinion',   label: '✍ Columna de opinión' },
              { campo: 'es_video',     label: '▶ Nota en video' },
            ].map(({ campo, label: lbl }) => (
              <label key={campo} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#2d2d2b' }}>
                <input type="checkbox" checked={!!form[campo]} onChange={(e) => cambiar(campo, e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}