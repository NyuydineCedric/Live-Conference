/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#06B6D4',
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
        },
      },
      backdropFilter: {
        'glass': 'blur(16px)',
      },
      backgroundColor: {
        glass: 'rgba(30, 41, 59, 0.5)',
      },
    },
  },
  plugins: [],
}
