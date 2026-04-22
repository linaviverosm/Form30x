// Utilidades generales del proyecto

/**
 * Calcula el NPS Score a partir de un arreglo de valores
 */
export function calculateNPS(values: number[]): number | string {
  if (values.length === 0) return '--';
  const promoters = values.filter((v) => v >= 9).length;
  const detractors = values.filter((v) => v <= 6).length;
  return Math.round(((promoters - detractors) / values.length) * 100);
}

/**
 * Calcula el promedio de un arreglo de números
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Formatea una fecha ISO a texto legible en español
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
