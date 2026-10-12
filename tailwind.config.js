/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['var(--font-cinzel)'],
        inter: ['var(--font-inter)'],
      },
      colors: {
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
}