// Tipos TypeScript para toda la aplicación

export interface SurveyRatings {
  general: number;
  explicacion: number;
  contenido: number;
  organizacion: number;
  practico: number;
}

export interface SurveyResponse {
  id?: number;
  nombre: string;       // Nombre del usuario (obligatorio)
  apellido: string;     // Apellido del usuario (obligatorio)
  ts: string;           // Timestamp ISO
  ratings: SurveyRatings;
  nps: number;
  aspectos: string[];
  comentario: string;
  mejora: string;
  sugerencias: string;
}

export interface DashboardStats {
  totalResponses: number;
  avgTotal: string;
  npsScore: number | string;
  promoters: number;
}

export const RATING_LABELS: Record<keyof SurveyRatings, string> = {
  general: 'Curso general',
  explicacion: 'Explicación',
  contenido: 'Contenido',
  organizacion: 'Organización',
  practico: 'Aplicabilidad',
};

export const PILL_OPTIONS = [
  'Dinamismo',
  'Ejemplos reales',
  'Ritmo del curso',
  'Herramientas prácticas',
  'Comunidad',
  'Material de apoyo',
  'Accesibilidad',
  'Instructor',
];
