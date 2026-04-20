// admin/src/components/SubirArchivo.tsx
import { useState, useRef } from 'react';
import api from '../api';

interface Props {
  tipo: 'imagen' | 'video';
  onSubido: (url: string) => void;
  urlActual?: string;
  label?: string;
}

export default function SubirArchivo({ tipo, onSubido, urlActual, label }: Props) {
  const [subiendo, setSubiendo]   = useState(false);
  const [progreso, setProgreso]   = useState(0);
  const [error, setError]         = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = tipo === 'imagen'
    ? 'image/jpeg,image/png,image/webp'
    : 'video/mp4,video/quicktime,video/webm,video/avi';

  async function manejarArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendo(true);
    setError('');
    setProgreso(0);

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      const { data } = await api.post(
        `/api/upload/${tipo}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) setProgreso(Math.round((e.loaded * 100) / e.total));
          },
        }
      );
      onSubido(data.url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al subir archivo');
    } finally {
      setSubiendo(false);
      setProgreso(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e2e0da',
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    background: '#fff',
  };

  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b6b68', marginBottom: '6px' }}>
          {label}
        </label>
      )}

      {/* Preview */}
      {urlActual && tipo === 'imagen' && (
        <img src={urlActual} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '8px', display: 'block', border: '1px solid #e2e0da' }} onError={(e: any) => e.target.style.display = 'none'} />
      )}
      {urlActual && tipo === 'video' && (
        <video src={urlActual} controls style={{ width: '100%', maxHeight: '200px', marginBottom: '8px', display: 'block' }} />
      )}

      {/* Input URL manual */}
      <input
        type="url"
        value={urlActual || ''}
        onChange={(e) => onSubido(e.target.value)}
        style={{ ...inputStyle, marginBottom: '6px' }}
        placeholder="https://... (o subí un archivo abajo)"
      />

      {/* Botón de subida */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={manejarArchivo}
          style={{ display: 'none' }}
          id={`upload-${tipo}-${label}`}
        />
        <label
          htmlFor={`upload-${tipo}-${label}`}
          style={{
            background: subiendo ? '#9c9a94' : '#f7f6f3',
            border: '1px solid #e2e0da',
            color: '#2d2d2b',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            padding: '7px 14px',
            cursor: subiendo ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {subiendo ? `Subiendo ${progreso}%...` : `↑ Subir ${tipo}`}
        </label>
        {subiendo && (
          <div style={{ flex: 1, height: '4px', background: '#e2e0da', borderRadius: '2px' }}>
            <div style={{ width: `${progreso}%`, height: '100%', background: '#e8000d', borderRadius: '2px', transition: 'width .3s' }} />
          </div>
        )}
      </div>

      {error && (
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#e8000d', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
}