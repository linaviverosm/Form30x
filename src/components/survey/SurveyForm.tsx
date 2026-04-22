'use client';
import { useSurveyForm } from '@/hooks/useSurveyForm';
import { RATING_LABELS, PILL_OPTIONS } from '@/types/survey';
import UserInfoSection from './UserInfoSection';
import StarRating from './StarRating';
import NpsSelector from './NpsSelector';
import PillSelector from './PillSelector';
import ThanksScreen from './ThanksScreen';

export default function SurveyForm() {
  const { nombre, setNombre, apellido, setApellido, ratings, setRating, npsValue, setNpsValue,
    selectedPills, togglePill, comentario, setComentario, mejora, setMejora,
    sugerencias, setSugerencias, isSubmitting, showThanks, error, submitForm, closeThanks } = useSurveyForm();

  return (
    <>
      {showThanks && <ThanksScreen onClose={closeThanks} />}
      <div className="form-wrap">

        {/* Sección 00 — Datos obligatorios */}
        <UserInfoSection nombre={nombre} apellido={apellido} onNombreChange={setNombre} onApellidoChange={setApellido} />

        {/* Sección 01 — Calificaciones */}
        <div className="form-section">
          <div className="section-num">01 / 04</div>
          <div className="section-title">CALIFICACIONES DEL CURSO</div>
          <p className="section-sub">¿Cómo calificarías cada aspecto? (1–5 estrellas)</p>
          <div className="star-group">
            {(Object.entries(RATING_LABELS) as [keyof typeof RATING_LABELS, string][]).map(([key, label]) => (
              <StarRating key={key} label={label} ratingKey={key} value={ratings[key]} onChange={setRating} />
            ))}
          </div>
        </div>

        {/* Sección 02 — NPS */}
        <div className="form-section">
          <div className="section-num">02 / 04</div>
          <div className="section-title">¿LO RECOMENDARÍAS?</div>
          <p className="section-sub">Del 0 al 10, ¿qué tan probable es que recomiendes 30X Academy?</p>
          <NpsSelector value={npsValue} onChange={setNpsValue} />
        </div>

        {/* Sección 03 — Aspectos */}
        <div className="form-section">
          <div className="section-num">03 / 04</div>
          <div className="section-title">ASPECTOS DESTACADOS</div>
          <p className="section-sub">¿Qué fue lo mejor del curso? Selecciona todo lo que aplique.</p>
          <PillSelector options={PILL_OPTIONS} selected={selectedPills} onToggle={togglePill} />
        </div>

        {/* Sección 04 — Comentarios */}
        <div className="form-section">
          <div className="section-num">04 / 04</div>
          <div className="section-title">TU VOZ</div>
          <p className="section-sub">Cuéntanos más. Todas las respuestas son bienvenidas.</p>
          <label className="field-label">💬 Comentario general sobre el curso</label>
          <textarea value={comentario} onChange={e=>setComentario(e.target.value)} placeholder="¿Qué te pareció la experiencia overall?" />
          <label className="field-label" style={{marginTop:'20px'}}>🔥 ¿Qué mejorarías?</label>
          <textarea value={mejora} onChange={e=>setMejora(e.target.value)} placeholder="Sé directo. Tu feedback construye el próximo nivel." />
          <label className="field-label" style={{marginTop:'20px'}}>💡 Sugerencias de temas futuros</label>
          <textarea value={sugerencias} onChange={e=>setSugerencias(e.target.value)} placeholder="¿Qué quieres aprender a continuación con Claude Code?" />
        </div>

        {/* Error de validación */}
        {error && <div className="error-banner">⚠ {error}</div>}

        {/* Botón enviar */}
        <button className="btn-submit" onClick={submitForm} disabled={isSubmitting}>
          {isSubmitting ? 'ENVIANDO...' : 'ENVIAR FEEDBACK →'}
        </button>
      </div>
    </>
  );
}
