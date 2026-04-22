// Ruta de autenticación — verifica la contraseña del dashboard
// La contraseña NUNCA llega al cliente, solo se compara en el servidor
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    // Comparar con la variable de entorno del servidor (no expuesta al cliente)
    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
