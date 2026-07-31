/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./locations/**/*.html",
    "./advertising-solutions/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi', 'Manrope', 'sans-serif'],
        body: ['Satoshi', 'Manrope', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
