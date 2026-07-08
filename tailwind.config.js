/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A0A0A',
        navydeep: '#000000',
        ink: '#121212',
        paper: '#F8F6F0',
        gold: '#E0A800',
        golddark: '#B58900',
        amber: '#F3C948',
        teal: '#2E7D32',
        slate: '#5A5A5A',
        line: '#E3DED0',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
