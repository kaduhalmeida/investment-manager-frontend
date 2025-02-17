/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // Adiciona um breakpoint menor para telas pequenas
      },
      container: {
        center: true, // Centraliza containers por padrão
        padding: '1rem', // Adiciona um padding padrão
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
