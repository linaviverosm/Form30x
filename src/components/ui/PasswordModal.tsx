'use client';
import { useState, useEffect, useRef } from 'react';

interface PasswordModalProps { onSuccess: (token: string) => void; onClose: () => void; }

export default function PasswordModal({ onSuccess, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass]  = useState(false);
  const [error, setError]        = useState('');
  const [loading, setLoading]    = useState(false);
  const [open, setOpen]          = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animación de entrada
  useEffect(() => { const t = setTimeout(() => setOpen(true), 30); return () => clearTimeout(t); }, []);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const handleClose = () => { setOpen(false); setTimeout(onClose, 350); };

  const handleSubmit = async () => {
    if (!password.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess(password);
      } else {
        setError('CONTRASEÑA INCORRECTA');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  };

  return (
    <div
      className={`modal-overlay${open ? ' open' : ''}`}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-box">
        <button className="modal-close" onClick={handleClose} aria-label="Cerrar">✕</button>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-logo">30X</div>
          <div className="modal-title">Área Privada</div>
          <div className="modal-sub">
            Solo el administrador puede ver los resultados.<br />
            Ingresa la contraseña para continuar.
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <label className="modal-label">Contraseña de acceso</label>

          <div className={`modal-input-wrap${error ? ' error' : ''}`}>
            <input
              ref={inputRef}
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="modal-eye"
              onClick={() => setShowPass(v => !v)}
              aria-label={showPass ? 'Ocultar' : 'Mostrar'}
            >
              {showPass ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          <button
            className="modal-btn"
            onClick={handleSubmit}
            disabled={loading || !password.trim()}
          >
            {loading ? 'VERIFICANDO...' : 'INGRESAR →'}
          </button>

          {error && <div className="modal-error">⚠ {error}</div>}

          <p className="modal-footer-note">Sesión segura · Solo uso administrativo</p>
        </div>
      </div>
    </div>
  );
}
