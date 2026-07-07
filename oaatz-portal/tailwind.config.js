/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0B2545',
        navydeep: '#081B33',
        ink: '#16213E',
        paper: '#F7F3EA',
        gold: '#C89B3C',
        golddark: '#A87F2A',
        amber: '#F2C572',
        teal: '#2F6E63',
        slate: '#5C6B73',
        line: '#E4DCC8',
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
