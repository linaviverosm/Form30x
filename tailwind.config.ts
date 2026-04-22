// Configuración de Tailwind CSS 4.0
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['Bebas Neue', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif'],
        'mono': ['Space Mono', 'monospace'],
      },
      colors: {
        lima: '#e9ff7b',
        beige: '#ddd4c0',
        card: '#0d0d0d',
      },
      animation: {
        'pop-in': 'popIn .5s cubic-bezier(.175,.885,.32,1.275)',
        'slide-up': 'slideUp .4s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
