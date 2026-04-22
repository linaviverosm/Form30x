// Configuración de Next.js para producción en Vercel
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimización de imágenes y fuentes
  experimental: {
    optimizePackageImports: ['chart.js', 'react-chartjs-2'],
  },
};

export default nextConfig;
