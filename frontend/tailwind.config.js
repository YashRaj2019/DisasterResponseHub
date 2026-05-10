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
          DEFAULT: '#3b82f6',
          dark: '#2563eb'
        },
        emergency: {
          red: '#ef4444',
          orange: '#f97316',
          green: '#10b981',
          blue: '#3b82f6'
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
