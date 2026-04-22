// Hook personalizado que maneja todo el estado y lógica del formulario
'use client';

import { useState } from 'react';
import { SurveyRatings, SurveyResponse } from '@/types/survey';

const initialRatings: SurveyRatings = {
  general: 0,
  explicacion: 0,
  contenido: 0,
  organizacion: 0,
  practico: 0,
};

export function useSurveyForm() {
  // Estado del usuario (obligatorio)
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  // Estado del formulario
  const [ratings, setRatings] = useState<SurveyRatings>({ ...initialRatings });
  const [npsValue, setNpsValue] = useState(-1);
  const [selectedPills, setSelectedPills] = useState<string[]>([]);
  const [comentario, setComentario] = useState('');
  const [mejora, setMejora] = useState('');
  const [sugerencias, setSugerencias] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [error, setError] = useState('');

  // Actualizar una calificación por clave
  const setRating = (key: keyof SurveyRatings, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  // Alternar una pill seleccionada
  const togglePill = (val: string) => {
    setSelectedPills((prev) =>
      prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
    );
  };

  // Resetear todo el formulario
  const resetForm = () => {
    setNombre('');
    setApellido('');
    setRatings({ ...initialRatings });
    setNpsValue(-1);
    setSelectedPills([]);
    setComentario('');
    setMejora('');
    setSugerencias('');
    setError('');
  };

  // Enviar el formulario a la API
  const submitForm = async () => {
    setError('');

    // Validar nombre y apellido obligatorios
    if (!nombre.trim() || !apellido.trim()) {
      setError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    // Validar al menos 3 calificaciones
    const filledRatings = Object.values(ratings).filter((v) => v > 0).length;
    if (filledRatings < 3) {
      setError('Por favor califica al menos 3 aspectos del curso.');
      return;
    }

    setIsSubmitting(true);

    const payload: SurveyResponse = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      ts: new Date().toISOString(),
      ratings,
      nps: npsValue,
      aspectos: selectedPills,
      comentario,
      mejora,
      sugerencias,
    };

    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar');
      }

      resetForm();
      setShowThanks(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar el formulario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    nombre, setNombre,
    apellido, setApellido,
    ratings, setRating,
    npsValue, setNpsValue,
    selectedPills, togglePill,
    comentario, setComentario,
    mejora, setMejora,
    sugerencias, setSugerencias,
    isSubmitting, showThanks, error,
    submitForm,
    closeThanks: () => setShowThanks(false),
  };
}
