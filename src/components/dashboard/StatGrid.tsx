// StatGrid con color contextual en el NPS score
interface StatGridProps {
  totalResponses: number;
  avgTotal: string | number;
  npsScore: number | string;
  promoters: number;
}

// Color del NPS según el score
function npsScoreColor(score: number | string): string {
  if (score === '--') return '#555';
  const n = Number(score);
  if (n >= 50)  return '#e9ff7b';   // Excelente
  if (n >= 0)   return '#aaa';      // Neutro/ok
  return '#ff6b6b';                  // Negativo
}

// Etiqueta descriptiva del NPS
function npsScoreLabel(score: number | string): string {
  if (score === '--') return 'Sin datos';
  const n = Number(score);
  if (n >= 70)  return 'Excelente';
  if (n >= 50)  return 'Muy bueno';
  if (n >= 30)  return 'Bueno';
  if (n >= 0)   return 'Mejorable';
  if (n >= -20) return 'Bajo';
  return 'Crítico';
}

export default function StatGrid({ totalResponses, avgTotal, npsScore, promoters }: StatGridProps) {
  const npsColor = npsScoreColor(npsScore);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginBottom: '20px',
    }}>

      {/* Respuestas */}
      <StatCard num={totalResponses} label="Respuestas" color="#e9ff7b" />

      {/* Promedio */}
      <StatCard num={avgTotal} label="Promedio General" color="#e9ff7b" />

      {/* NPS Score — card especial con color contextual */}
      <div style={{
        background: '#0d0d0d',
        border: `1px solid ${npsScore !== '--' && Number(npsScore) < 0 ? 'rgba(255,77,77,.15)' : '#1e1e1e'}`,
        borderRadius: '12px',
        padding: '28px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Número */}
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '56px',
          color: npsColor,
          lineHeight: 1,
          letterSpacing: '2px',
        }}>
          {npsScore}
        </div>
        {/* Label principal */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          color: '#555',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginTop: '6px',
        }}>
          NPS Score
        </div>
        {/* Sub-etiqueta contextual */}
        {npsScore !== '--' && (
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            color: npsColor,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginTop: '4px',
            opacity: 0.7,
          }}>
            {npsScoreLabel(npsScore)}
          </div>
        )}
        {/* Barra de escala -100 a +100 */}
        {npsScore !== '--' && (
          <div style={{ marginTop: '14px' }}>
            <div style={{
              width: '100%',
              height: '3px',
              background: '#1a1a1a',
              borderRadius: '2px',
              position: 'relative',
              overflow: 'visible',
            }}>
              {/* Track de fondo con zonas */}
              <div style={{
                position: 'absolute', left: 0, top: 0,
                width: '50%', height: '100%',
                background: 'rgba(255,77,77,.15)', borderRadius: '2px 0 0 2px',
              }} />
              <div style={{
                position: 'absolute', left: '50%', top: 0,
                width: '50%', height: '100%',
                background: 'rgba(233,255,123,.08)', borderRadius: '0 2px 2px 0',
              }} />
              {/* Indicador de posición */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: `${((Number(npsScore) + 100) / 200) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: npsColor,
                boxShadow: `0 0 6px ${npsColor}88`,
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '5px',
            }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#2a2a2a' }}>-100</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#2a2a2a' }}>0</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '8px', color: '#2a2a2a' }}>+100</span>
            </div>
          </div>
        )}
      </div>

      {/* Promotores */}
      <StatCard num={promoters} label="Promotores" color="#e9ff7b" />
    </div>
  );
}

// Sub-componente para cards simples
function StatCard({ num, label, color }: { num: string | number; label: string; color: string }) {
  return (
    <div style={{
      background: '#0d0d0d',
      border: '1px solid #1e1e1e',
      borderRadius: '12px',
      padding: '28px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '64px',
        color,
        lineHeight: 1,
        letterSpacing: '2px',
      }}>
        {num}
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '9px',
        color: '#555',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginTop: '6px',
      }}>
        {label}
      </div>
    </div>
  );
}
