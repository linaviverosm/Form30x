// Sección de barras de progreso para promedios y aspectos
import { RATING_LABELS } from '@/types/survey';

interface BarsSectionProps {
  avgs: Record<string, number>;
  aspectCounts: Record<string, number>;
  totalResponses: number;
}

function BarRow({ label, value, display }: { label: string; value: number; display: string }) {
  return (
    <div className="bar-row">
      <span className="bar-key">{label}</span>
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="bar-pct">{display}</span>
    </div>
  );
}

export default function BarsSection({ avgs, aspectCounts, totalResponses }: BarsSectionProps) {
  return (
    <div className="chart-grid">
      {/* Promedios por área */}
      <div className="chart-card">
        <div className="bar-section-title">Promedios por área</div>
        {(Object.entries(RATING_LABELS) as [string, string][]).map(([key, label]) => (
          <BarRow
            key={key}
            label={label}
            value={Math.round(((avgs[key] || 0) / 5) * 100)}
            display={(avgs[key] || 0).toFixed(1)}
          />
        ))}
      </div>

      {/* Aspectos destacados */}
      <div className="chart-card">
        <div className="bar-section-title">Aspectos destacados</div>
        {Object.keys(aspectCounts).length === 0 ? (
          <p style={{ color: '#333', fontSize: '13px' }}>Sin datos aún</p>
        ) : (
          Object.entries(aspectCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([key, val]) => {
              const pct = Math.round((val / totalResponses) * 100);
              return (
                <BarRow key={key} label={key} value={pct} display={`${pct}%`} />
              );
            })
        )}
      </div>
    </div>
  );
}
