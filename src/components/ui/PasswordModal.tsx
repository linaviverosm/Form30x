'use client';
import { useState } from 'react';
interface PasswordModalProps { onSuccess:(token:string)=>void; onClose:()=>void; }
export default function PasswordModal({ onSuccess, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass]  = useState(false);
  const [error, setError]        = useState('');
  const [loading, setLoading]    = useState(false);

  const handleSubmit = async () => {
    if (!password) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password }) });
      if (res.ok) { sessionStorage.setItem('30x_auth', password); onSuccess(password); }
      else { setError('CONTRASEÑA INCORRECTA'); setPassword(''); }
    } catch { setError('Error de conexión'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-lock-icon">🔐</div>
        <div className="modal-title">ÁREA PRIVADA</div>
        <div className="modal-sub">Solo el administrador puede ver los resultados.<br/>Ingresa la contraseña para continuar.</div>
        <div className="modal-input-wrap">
          <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleSubmit()} placeholder="••••••••" />
          <button className="modal-eye" onClick={()=>setShowPass(!showPass)}>{showPass?'🙈':'👁'}</button>
        </div>
        <button className="modal-btn" onClick={handleSubmit} disabled={loading}>{loading?'VERIFICANDO...':'INGRESAR →'}</button>
        {error && <div className="modal-error">{error}</div>}
      </div>
    </div>
  );
}
