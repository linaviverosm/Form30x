'use client';
interface Props { onClose:()=>void; }
export default function ThanksScreen({ onClose }: Props) {
  return (
    <div className="thanks-screen show">
      <div className="thanks-emoji">🙌</div>
      <div className="thanks-badge">· RESPUESTA ENVIADA ·</div>
      <div className="thanks-title">GRACIAS<span>POR TU FEEDBACK</span></div>
      <p className="thanks-sub">Tu opinión es el combustible que impulsa el próximo nivel de 30X Academy. ¡Nos vemos en la siguiente clase!</p>
      <button className="thanks-back" onClick={onClose}>← RESPONDER OTRA VEZ</button>
    </div>
  );
}
