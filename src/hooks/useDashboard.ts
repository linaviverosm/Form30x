// Hook para manejar la lógica y estado del dashboard de resultados
'use client';

import { useState, useEffect, useCallback } from 'react';
import { SurveyResponse } from '@/types/survey';
import { calculateNPS, average } from '@/lib/utils';

export function useDashboard(sessionToken: string) {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar respuestas desde la API
  const loadResponses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/responses', {
        headers: { 'x-session-token': sessionToken },
      });

      if (!res.ok) throw new Error('No autorizado');

      const data = await res.json();
      setResponses(data.responses || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [sessionToken]);

  useEffect(() => {
    if (sessionToken) loadResponses();
  }, [sessionToken, loadResponses]);

  // Eliminar todas las respuestas
  const clearResponses = async () => {
    if (!confirm('¿Eliminar todas las respuestas? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch('/api/clear', {
        method: 'DELETE',
        headers: { 'x-session-token': sessionToken },
      });

      if (!res.ok) throw new Error('Error al eliminar');
      await loadResponses();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  // Calcular estadísticas agregadas
  const stats = (() => {
    const rKeys = ['general', 'explicacion', 'contenido', 'organizacion', 'practico'] as const;
    const avgs = Object.fromEntries(
      rKeys.map((k) => [
        k,
        average(responses.map((d) => d.ratings[k]).filter((v) => v > 0)),
      ])
    ) as Record<string, number>;

    const allAvgs = Object.values(avgs).filter((v) => v > 0);
    const avgTotal = allAvgs.length ? average(allAvgs).toFixed(1) : '--';
    const npsValues = responses.map((d) => d.nps).filter((v) => v >= 0);
    const npsScore = calculateNPS(npsValues);
    const promoters = npsValues.filter((v) => v >= 9).length;
    const neutrals = npsValues.filter((v) => v >= 7 && v <= 8).length;
    const detractors = npsValues.filter((v) => v <= 6).length;

    const aspectCounts: Record<string, number> = {};
    responses.forEach((d) =>
      d.aspectos.forEach((a) => {
        aspectCounts[a] = (aspectCounts[a] || 0) + 1;
      })
    );

    return {
      totalResponses: responses.length,
      avgTotal,
      npsScore,
      promoters,
      neutrals,
      detractors,
      avgs,
      aspectCounts,
    };
  })();

  return { responses, loading, error, stats, loadResponses, clearResponses };
}
