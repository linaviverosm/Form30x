// Sección de gráficas radar y doughnut usando Chart.js
'use client';

import { useEffect, useRef } from 'react';
import {
  Chart, RadarController, LineElement, PointElement, RadialLinearScale,
  DoughnutController, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { SurveyResponse } from '@/types/survey';
import { RATING_LABELS } from '@/types/survey';
import { average } from '@/lib/utils';

// Registrar componentes de Chart.js
Chart.register(RadarController, LineElement, PointElement, RadialLinearScale,
  DoughnutController, ArcElement, Tooltip, Legend, Filler);

interface ChartsSectionProps {
  responses: SurveyResponse[];
}

export default function ChartsSection({ responses }: ChartsSectionProps) {
  const radarRef = useRef<HTMLCanvasElement>(null);
  const npsRef = useRef<HTMLCanvasElement>(null);
  const radarChartRef = useRef<Chart | null>(null);
  const npsChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!radarRef.current || !npsRef.current) return;

    // Destruir gráficas previas al actualizar datos
    radarChartRef.current?.destroy();
    npsChartRef.current?.destroy();

    const rKeys = ['general', 'explicacion', 'contenido', 'organizacion', 'practico'] as const;
    const avgs = rKeys.map((k) =>
      average(responses.map((d) => d.ratings[k]).filter((v) => v > 0))
    );

    // Gráfica radar de calificaciones
    radarChartRef.current = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels: Object.values(RATING_LABELS),
        datasets: [{
          label: 'Promedio',
          data: avgs,
          backgroundColor: 'rgba(233,255,123,.08)',
          borderColor: '#e9ff7b',
          pointBackgroundColor: '#e9ff7b',
          borderWidth: 2,
          pointRadius: 4,
        }],
      },
      options: {
        animation: { duration: 600 },
        scales: {
          r: {
            min: 0, max: 5,
            ticks: { stepSize: 1, color: '#333', backdropColor: 'transparent', font: { size: 9 } },
            grid: { color: '#1a1a1a' },
            angleLines: { color: '#1a1a1a' },
            pointLabels: { color: '#666', font: { size: 11 } },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    // Gráfica doughnut de distribución NPS
    const npsValues = responses.map((d) => d.nps).filter((v) => v >= 0);
    const npsGroups = [
      npsValues.filter((v) => v >= 9).length,
      npsValues.filter((v) => v >= 7 && v <= 8).length,
      npsValues.filter((v) => v <= 6).length,
    ];

    npsChartRef.current = new Chart(npsRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Promotores (9-10)', 'Neutros (7-8)', 'Detractores (0-6)'],
        datasets: [{
          data: npsGroups,
          backgroundColor: ['#e9ff7b', '#4a4a2a', '#1a1a1a'],
          borderColor: ['#c8e84a', '#5a5a3a', '#2a2a2a'],
          borderWidth: 2,
        }],
      },
      options: {
        animation: { duration: 600 },
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#666', padding: 14, boxWidth: 12 },
          },
        },
      },
    });

    return () => {
      radarChartRef.current?.destroy();
      npsChartRef.current?.destroy();
    };
  }, [responses]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 mb-5">
      {/* Radar de calificaciones */}
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-[10px] p-6">
        <div className="font-['Bebas_Neue'] text-[17px] tracking-[2px] text-[#ddd4c0] mb-[18px]">
          CALIFICACIONES POR ÁREA
        </div>
        <div className="relative h-[210px]">
          <canvas ref={radarRef} />
        </div>
      </div>

      {/* Doughnut NPS */}
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-[10px] p-6">
        <div className="font-['Bebas_Neue'] text-[17px] tracking-[2px] text-[#ddd4c0] mb-[18px]">
          DISTRIBUCIÓN NPS
        </div>
        <div className="relative h-[210px]">
          <canvas ref={npsRef} />
        </div>
      </div>
    </div>
  );
}
