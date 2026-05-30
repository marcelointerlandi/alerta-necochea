// admin/src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#111110', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '400px', padding: '40px' }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '.3em', textTransform: 'uppercase', color: '#6b6b68', marginBottom: '4px' }}>Informate Necochea</div>
          <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: '36px', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1, textTransform: 'uppercase' }}>
            <span style={{ color: '#e8000d' }}>INFORMATE</span>
            <span style={{ color: '#111110' }}> NECOCHEA</span>
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#9c9a94', marginTop: '6px' }}>Panel de administración</div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b6b68', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e0da', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              placeholder="admin@elnoDiario.com.ar"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#6b6b68', marginBottom: '6px' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e0da', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '10px 12px', marginBottom: '16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#9c9a94' : '#111110', color: '#fff', border: 'none', padding: '12px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 500, letterSpacing: '.15em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
