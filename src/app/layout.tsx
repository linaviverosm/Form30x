// Layout raíz — las fuentes de Google se cargan en el <head> de forma correcta
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Encuesta · 30X Academy',
  description: 'Comparte tu opinión sobre el curso de Claude Code de 30X Academy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect para mejorar velocidad de carga de fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fuentes del proyecto: Bebas Neue, DM Sans y Space Mono */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
