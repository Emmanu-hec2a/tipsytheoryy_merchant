/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D3B30',
          dark: '#06211B',
          light: '#E6F2F0',
        },
        accent: {
          DEFAULT: '#F97316',
          hover: '#EA580C',
        }
      }
    },
  },
  plugins: [],
}
