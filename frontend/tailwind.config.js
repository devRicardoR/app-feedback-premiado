/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Azul Tailwind padrão
        secondary: '#10B981', // Verde Tailwind
        danger: '#EF4444', // Vermelho Tailwind
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Exemplo com fonte customizada
      },
    },
  },
  plugins: [],
}