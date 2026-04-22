// ResponsesList.tsx — estilos inline para máxima fiabilidad del grid
import { SurveyResponse } from '@/types/survey';
import { formatDate } from '@/lib/utils';

interface ResponsesListProps { responses: SurveyResponse[]; }

const RATING_SHORT: Record<string, string> = {
  general: 'General', explicacion: 'Claridad',
  contenido: 'Contenido', organizacion: 'Orden', practico: 'Práctica',
};

function npsColor(n: number) { return n >= 9 ? '#e9ff7b' : n >= 7 ? '#888' : '#ff6b6b'; }
function npsLabel(n: number) { return n >= 9 ? 'Promotor' : n >= 7 ? 'Neutro' : 'Detractor'; }
function npsBg(n: number)    { return n >= 9 ? 'rgba(233,255,123,.06)' : n >= 7 ? 'rgba(255,255,255,.03)' : 'rgba(255,77,77,.05)'; }
function npsBorder(n: number){ return n >= 9 ? 'rgba(233,255,123,.3)'  : n >= 7 ? 'rgba(255,255,255,.1)'  : 'rgba(255,77,77,.2)'; }
function starColor(v: number){ return v >= 4 ? '#e9ff7b' : v >= 3 ? '#aaa' : '#ff6b6b'; }

export default function ResponsesList({ responses }: ResponsesListProps) {
  if (responses.length === 0) return null;

  return (
    <div style={{ marginTop: '8px' }}>
      {/* Título sección */}
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '28px',
        letterSpacing: '3px',
        color: '#fff',
        marginBottom: '20px',
      }}>
        Comentarios Recibidos
      </div>

      {[...responses].reverse().map((d, i) => (
        <div key={d.id ?? i} style={{
          background: '#0d0d0d',
          border: '1px solid #1e1e1e',
          borderRadius: '12px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}>

          {/* ── Header de la card ── */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '14px 20px',
            background: '#0a0a0a',
            borderBottom: '1px solid #1a1a1a',
          }}>
            {/* Left: número, nombre, fecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(233,255,123,.1)',
                border: '1px solid rgba(233,255,123,.2)',
                color: '#e9ff7b',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '2px',
              }}>
                #{responses.length - i}
              </span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff',
              }}>
                {d.nombre} {d.apellido}
              </span>
              <span style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                color: '#444',
                letterSpacing: '1px',
              }}>
                {formatDate(d.ts)}
              </span>
            </div>

            {/* Right: badge NPS */}
            {d.nps >= 0 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                padding: '4px 12px',
                borderRadius: '4px',
                background: npsBg(d.nps),
                border: `1px solid ${npsBorder(d.nps)}`,
                color: npsColor(d.nps),
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>NPS</span>
                <strong style={{ fontSize: '13px' }}>{d.nps}</strong>
                <span style={{ fontSize: '9px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  · {npsLabel(d.nps)}
                </span>
              </span>
            )}
          </div>

          {/* ── Cuerpo ── */}
          <div style={{ padding: '20px' }}>

            {/* Grid de calificaciones */}
            {Object.values(d.ratings).some(v => v > 0) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '20px',
              }}>
                {(Object.entries(d.ratings) as [string, number][]).map(([key, val]) => (
                  <div key={key} style={{
                    background: '#0a0a0a',
                    border: '1px solid #1a1a1a',
                    borderRadius: '8px',
                    padding: '10px 10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                  }}>
                    {/* Etiqueta criterio */}
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '8px',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: '#444',
                      whiteSpace: 'nowrap',
                    }}>
                      {RATING_SHORT[key] ?? key}
                    </span>
                    {/* Estrellas */}
                    <span style={{ fontSize: '12px', letterSpacing: '2px', lineHeight: 1 }}>
                      <span style={{ color: val > 0 ? starColor(val) : '#1e1e1e' }}>
                        {'★'.repeat(val > 0 ? val : 0)}
                      </span>
                      <span style={{ color: '#1e1e1e' }}>
                        {'★'.repeat(val > 0 ? 5 - val : 5)}
                      </span>
                    </span>
                    {/* Valor numérico */}
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '11px',
                      fontWeight: 700,
                      color: val > 0 ? starColor(val) : '#333',
                    }}>
                      {val > 0 ? `${val}.0 / 5` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Textos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {d.comentario && (
                <div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#3a3a3a',
                    display: 'block',
                    marginBottom: '5px',
                  }}>
                    Comentario general
                  </span>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#aaa', lineHeight: 1.75, margin: 0 }}>
                    {d.comentario}
                  </p>
                </div>
              )}
              {d.mejora && (
                <div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#3a3a3a',
                    display: 'block',
                    marginBottom: '5px',
                  }}>
                    ¿Qué mejoraría?
                  </span>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#aaa', lineHeight: 1.75, margin: 0 }}>
                    {d.mejora}
                  </p>
                </div>
              )}
              {d.sugerencias && (
                <div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#3a3a3a',
                    display: 'block',
                    marginBottom: '5px',
                  }}>
                    Sugerencias de temas
                  </span>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#aaa', lineHeight: 1.75, margin: 0 }}>
                    {d.sugerencias}
                  </p>
                </div>
              )}
            </div>

            {/* Pills de aspectos */}
            {d.aspectos && d.aspectos.length > 0 && (
              <div style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid #111',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#3a3a3a',
                }}>
                  Destacado
                </span>
                {d.aspectos.map((a: string) => (
                  <span key={a} style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '1px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: 'rgba(233,255,123,.05)',
                    border: '1px solid rgba(233,255,123,.18)',
                    color: '#e9ff7b',
                    textTransform: 'uppercase',
                  }}>
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
