'use client';
interface Props { nombre:string; apellido:string; onNombreChange:(v:string)=>void; onApellidoChange:(v:string)=>void; }
export default function UserInfoSection({ nombre, apellido, onNombreChange, onApellidoChange }: Props) {
  return (
    <div className="form-section">
      <div className="section-num">00 / 04</div>
      <div className="section-title">TUS DATOS</div>
      <p className="section-sub">
        Antes de comenzar, ingresa tu nombre y apellido.{' '}
        <span style={{color:'var(--lima)'}}>Campos obligatorios.</span>
      </p>
      <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:'200px'}}>
          <label className="field-label">✍️ Nombre <span style={{color:'var(--rojo)'}}>*</span></label>
          <input type="text" value={nombre} onChange={e=>onNombreChange(e.target.value)} placeholder="Tu nombre" required />
        </div>
        <div style={{flex:1, minWidth:'200px'}}>
          <label className="field-label">✍️ Apellido <span style={{color:'var(--rojo)'}}>*</span></label>
          <input type="text" value={apellido} onChange={e=>onApellidoChange(e.target.value)} placeholder="Tu apellido" required />
        </div>
      </div>
    </div>
  );
}
