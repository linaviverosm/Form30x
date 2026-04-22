// Rutas para obtener y guardar respuestas de la encuesta
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SurveyResponse } from '@/types/survey';

// Cliente con service role para operaciones seguras del servidor
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET — obtener todas las respuestas (solo desde el servidor con auth)
export async function GET(req: NextRequest) {
  // Verificar que la petición viene autenticada (header de sesión)
  const sessionToken = req.headers.get('x-session-token');
  if (sessionToken !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .order('ts', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transformar columnas planas a objeto de ratings
  const responses: SurveyResponse[] = (data || []).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    apellido: row.apellido,
    ts: row.ts,
    ratings: {
      general: row.rating_general,
      explicacion: row.rating_explicacion,
      contenido: row.rating_contenido,
      organizacion: row.rating_organizacion,
      practico: row.rating_practico,
    },
    nps: row.nps,
    aspectos: row.aspectos || [],
    comentario: row.comentario || '',
    mejora: row.mejora || '',
    sugerencias: row.sugerencias || '',
  }));

  return NextResponse.json({ responses });
}

// POST — guardar nueva respuesta (público, cualquier usuario puede enviar)
export async function POST(req: NextRequest) {
  try {
    const body: SurveyResponse = await req.json();

    // Validar campos obligatorios
    if (!body.nombre?.trim() || !body.apellido?.trim()) {
      return NextResponse.json(
        { error: 'Nombre y apellido son obligatorios' },
        { status: 400 }
      );
    }

    const supabase = getServiceClient();
    const { error } = await supabase.from('survey_responses').insert({
      nombre: body.nombre.trim(),
      apellido: body.apellido.trim(),
      ts: new Date().toISOString(),
      rating_general: body.ratings.general,
      rating_explicacion: body.ratings.explicacion,
      rating_contenido: body.ratings.contenido,
      rating_organizacion: body.ratings.organizacion,
      rating_practico: body.ratings.practico,
      nps: body.nps,
      aspectos: body.aspectos,
      comentario: body.comentario,
      mejora: body.mejora,
      sugerencias: body.sugerencias,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}
