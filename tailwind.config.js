/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: '#FAFAFA', dark: '#0A0B0D' },
        surface: { DEFAULT: '#FFFFFF', hover: '#F2F2F4', dark: '#131418', 'dark-hover': '#1A1C21' },
        ink: { DEFAULT: '#0B0C0E', soft: '#5B5F68', faint: '#8A8F99' },
        'ink-dark': { DEFAULT: '#F2F3F5', soft: '#9BA1AC', faint: '#61666F' },
        accent: { DEFAULT: '#5B4FE8', soft: '#8880F0' },
        'accent-dark': { DEFAULT: '#8B85FF', soft: '#B0ABFF' },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', '"Segoe UI"', '"Pretendard"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(91,79,232,0.16), 0 8px 24px -8px rgba(91,79,232,0.28)',
        'glow-dark': '0 0 0 1px rgba(139,133,255,0.2), 0 8px 24px -8px rgba(139,133,255,0.35)',
      },
    },
  },
  plugins: [],
};
