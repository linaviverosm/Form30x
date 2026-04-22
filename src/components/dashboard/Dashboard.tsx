// Dashboard — PDF replica el diseño visual exacto del dashboard
'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { RATING_LABELS } from '@/types/survey';
import { formatDate } from '@/lib/utils';
import StatGrid from './StatGrid';
import ChartsSection from './ChartsSection';
import BarsSection from './BarsSection';
import ResponsesList from './ResponsesList';

interface DashboardProps { sessionToken: string; }

const RATING_SHORT: Record<string, string> = {
  general: 'General', explicacion: 'Claridad',
  contenido: 'Contenido', organizacion: 'Orden', practico: 'Práctica',
};
function npsClass(n: number) { return n >= 9 ? '#e9ff7b' : n >= 7 ? '#888' : '#ff6b6b'; }
function npsLabel(n: number) { return n >= 9 ? 'Promotor' : n >= 7 ? 'Neutro' : 'Detractor'; }
function npsBackground(n: number) { return n >= 9 ? 'rgba(233,255,123,.06)' : n >= 7 ? 'rgba(255,255,255,.03)' : 'rgba(255,77,77,.05)'; }
function npsBorder(n: number) { return n >= 9 ? 'rgba(233,255,123,.3)' : n >= 7 ? 'rgba(255,255,255,.1)' : 'rgba(255,77,77,.2)'; }
function valColor(v: number) { return v >= 4 ? '#e9ff7b' : v >= 3 ? '#888' : '#ff6b6b'; }

function generateHTMLReport(
  responses: ReturnType<typeof useDashboard>['responses'],
  stats: ReturnType<typeof useDashboard>['stats']
) {
  const fecha = new Date().toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase();
  const rKeys = ['general','explicacion','contenido','organizacion','practico'] as const;

  // Estadísticas
  const statsCards = [
    { num: responses.length, label: 'Respuestas' },
    { num: stats.avgTotal,   label: 'Promedio' },
    { num: stats.npsScore,   label: 'NPS Score' },
    { num: stats.promoters,  label: 'Promotores' },
  ].map(({num, label}) => `
    <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:12px;padding:28px 24px;text-align:center">
      <div style="font-family:'Bebas Neue',sans-serif;font-size:64px;color:#e9ff7b;line-height:1;letter-spacing:2px">${num}</div>
      <div style="font-family:'Space Mono',monospace;font-size:9px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-top:6px">${label}</div>
    </div>`).join('');

  // Barras de promedios
  const barRows = rKeys.map(k => {
    const pct = Math.round(((stats.avgs[k]||0)/5)*100);
    return `<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
      <span style="font-family:'DM Sans',sans-serif;font-size:13px;color:#999;min-width:100px">${RATING_LABELS[k]}</span>
      <div style="flex:1;background:#111;border-radius:4px;height:6px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:#e9ff7b;border-radius:4px"></div>
      </div>
      <span style="font-family:'Space Mono',monospace;font-size:11px;color:#e9ff7b;min-width:32px;text-align:right">${(stats.avgs[k]||0).toFixed(1)}</span>
    </div>`;
  }).join('');

  // Aspectos
  const aspectRows = Object.entries(stats.aspectCounts).sort(([,a],[,b])=>b-a).map(([k,v])=>{
    const pct = Math.round((v/responses.length)*100);
    return `<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
      <span style="font-family:'DM Sans',sans-serif;font-size:13px;color:#999;min-width:120px">${k}</span>
      <div style="flex:1;background:#111;border-radius:4px;height:6px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:#e9ff7b;border-radius:4px"></div>
      </div>
      <span style="font-family:'Space Mono',monospace;font-size:11px;color:#e9ff7b;min-width:36px;text-align:right">${pct}%</span>
    </div>`;
  }).join('') || '<p style="color:#333;font-size:12px">Sin datos</p>';

  // Respuestas individuales
  const responseCards = [...responses].reverse().map((d, i) => {
    const ratingChips = (Object.entries(d.ratings) as [string,number][]).map(([k,v]) => `
      <div style="background:#0a0a0a;border:1px solid #1a1a1a;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:4px">
        <span style="font-family:'Space Mono',monospace;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#444">${RATING_SHORT[k]??k}</span>
        <span style="font-size:11px;letter-spacing:1px">
          <span style="color:#e9ff7b">${'★'.repeat(v>0?v:0)}</span>
          <span style="color:#1e1e1e">${'★'.repeat(v>0?5-v:5)}</span>
        </span>
        <span style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:${v>0?valColor(v):'#555'}">${v>0?`${v}.0/5`:'—'}</span>
      </div>`).join('');

    // ✅ DESPUÉS — tipo explícito + predicado de tipo para filter
const textBlocks = (
  [
    d.comentario  ? ['Comentario general',   d.comentario]  : null,
    d.mejora      ? ['¿Qué mejoraría?',       d.mejora]      : null,
    d.sugerencias ? ['Sugerencias de temas',  d.sugerencias] : null,
  ] as ([string, string] | null)[]
)
  .filter((item): item is [string, string] => item !== null)
  .map(([label, text]) => `
    <div style="margin-bottom:14px">
      <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3a3a;display:block;margin-bottom:5px">${label}</span>
      <p style="font-family:'DM Sans',sans-serif;font-size:14px;color:#aaa;line-height:1.75;margin:0">${text}</p>
    </div>`)
  .join('');


    const pillsHTML = d.aspectos.length ? `
      <div style="margin-top:16px;padding-top:14px;border-top:1px solid #111;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3a3a3a">Destacado</span>
        ${d.aspectos.map(a=>`<span style="font-family:'Space Mono',monospace;font-size:9px;padding:4px 12px;border-radius:20px;background:rgba(233,255,123,.05);border:1px solid rgba(233,255,123,.18);color:#e9ff7b;letter-spacing:1px;text-transform:uppercase">${a}</span>`).join('')}
      </div>` : '';

    return `
      <div style="background:#0d0d0d;border:1px solid #1e1e1e;border-radius:12px;margin-bottom:16px;overflow:hidden">
        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding:16px 20px;background:#0a0a0a;border-bottom:1px solid #1e1e1e">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="background:rgba(233,255,123,.1);border:1px solid rgba(233,255,123,.2);color:#e9ff7b;padding:3px 8px;border-radius:4px;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px">#${responses.length-i}</span>
            <span style="font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#fff">${d.nombre} ${d.apellido}</span>
            <span style="font-family:'Space Mono',monospace;font-size:10px;color:#444;letter-spacing:1px">${formatDate(d.ts)}</span>
          </div>
          ${d.nps>=0?`<span style="display:inline-flex;align-items:center;gap:5px;font-family:'Space Mono',monospace;font-size:10px;padding:4px 10px;border-radius:4px;background:${npsBackground(d.nps)};border:1px solid ${npsBorder(d.nps)};color:${npsClass(d.nps)}">
            <strong style="font-size:12px">${d.nps}</strong>
            <span style="font-size:9px;opacity:.7;letter-spacing:1px;text-transform:uppercase">${npsLabel(d.nps)}</span>
          </span>`:''}
        </div>
        <!-- Cuerpo -->
        <div style="padding:20px">
          <!-- Ratings grid -->
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:20px">
            ${ratingChips}
          </div>
          ${textBlocks}
          ${pillsHTML}
        </div>
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Resultados · 30X Academy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{background:#000;color:#F1F1F1;font-family:'DM Sans',sans-serif;min-height:100vh;padding:48px 32px 96px}
    .wrap{max-width:980px;margin:0 auto}
    .page-header{padding-bottom:28px;border-bottom:1px solid #1e1e1e;margin-bottom:40px;display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px}
    .page-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(40px,6vw,64px);letter-spacing:4px;color:#fff;line-height:1}
    .page-meta{font-family:'Space Mono',monospace;font-size:13px;color:#555;margin-top:6px;letter-spacing:1px}
    .section-label{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#555;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #1e1e1e}
    .stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
    .chart-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;margin-bottom:16px}
    .card{background:#0d0d0d;border:1px solid #1e1e1e;border-radius:12px;padding:28px}
    .divider{border:none;border-top:1px solid #1e1e1e;margin:32px 0}
    .print-note{display:none}
    @media print{
      body{padding:20px}
      .print-note{display:block;font-family:'Space Mono',monospace;font-size:9px;color:#333;text-align:center;padding:12px;letter-spacing:2px}
      @page{margin:1.5cm}
    }
  </style>
</head>
<body>
<div class="wrap">
  <!-- Header -->
  <div class="page-header">
    <div>
      <div class="page-title">Resultados</div>
      <div class="page-meta">${responses.length} respuesta${responses.length!==1?'s':''} registrada${responses.length!==1?'s':''} — ${fecha}</div>
    </div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:#e9ff7b;letter-spacing:4px">30X</div>
  </div>

  <!-- Stats -->
  <div class="section-label">Estadísticas generales</div>
  <div class="stat-grid">${statsCards}</div>

  <!-- Barras -->
  <div class="chart-grid">
    <div class="card">
      <div class="section-label">Promedios por área</div>
      ${barRows}
    </div>
    <div class="card">
      <div class="section-label">Aspectos destacados</div>
      ${aspectRows}
    </div>
  </div>

  <div class="divider"></div>

  <!-- Respuestas -->
  <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;color:#fff;margin-bottom:20px">Comentarios Recibidos</div>
  ${responseCards}

  <p class="print-note">30X ACADEMY · REPORTE GENERADO ${fecha} · Ctrl+P para guardar como PDF</p>
</div>
</body>
</html>`;
}

export default function Dashboard({ sessionToken }: DashboardProps) {
  const { responses, loading, error, stats, clearResponses } = useDashboard(sessionToken);

  const handleDownload = () => {
    if (responses.length === 0) return;
    const html = generateHTMLReport(responses, stats);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `30x-resultados-${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'96px 20px' }}>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'11px', letterSpacing:'3px', color:'#333' }}>CARGANDO...</div>
    </div>
  );

  if (error) return (
    <div style={{ textAlign:'center', padding:'96px 20px' }}>
      <p style={{ fontFamily:'Space Mono,monospace', fontSize:'12px', color:'var(--rojo)', letterSpacing:'2px' }}>{error}</p>
    </div>
  );

  return (
    <div className="dash-wrap">
      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-title">Resultados</div>
          <div className="dash-sub">
            {responses.length} respuesta{responses.length !== 1 ? 's' : ''} registrada{responses.length !== 1 ? 's' : ''}
            {responses.length > 0 && (
              <> — Última: {new Date(responses[responses.length-1].ts).toLocaleDateString('es',{day:'2-digit',month:'short',year:'numeric'})}</>
            )}
          </div>
        </div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          {responses.length > 0 && (
            <button className="btn-action btn-dl" onClick={handleDownload}
              title="Descarga el reporte como HTML — ábrelo y usa Ctrl+P para guardar como PDF">
              ↓ Exportar reporte
            </button>
          )}
          <button className="btn-action btn-clear" onClick={clearResponses}>Limpiar datos</button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">◈</div>
          <div className="empty-text">AUN NO HAY RESPUESTAS</div>
          <p className="empty-sub">Completa la encuesta para ver los resultados aquí.</p>
        </div>
      ) : (
        <>
          <StatGrid totalResponses={stats.totalResponses} avgTotal={stats.avgTotal} npsScore={stats.npsScore} promoters={stats.promoters} />
          <ChartsSection responses={responses} />
          <BarsSection avgs={stats.avgs} aspectCounts={stats.aspectCounts} totalResponses={stats.totalResponses} />
          <hr className="divider" />
          <ResponsesList responses={responses} />
        </>
      )}
    </div>
  );
}
