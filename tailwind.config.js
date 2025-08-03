/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        discord: {
          50: '#f0f2ff',
          100: '#e6e9ff',
          200: '#d0d6ff',
          300: '#aab5ff',
          400: '#7c89ff',
          500: '#5865f2',
          600: '#4752c4',
          700: '#3c459e',
          800: '#313a7f',
          900: '#2c3467',
        },
        nitro: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      }
    },
  },
  plugins: [],
}