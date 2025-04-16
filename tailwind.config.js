/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
   './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f97316', // Orange
        secondary: '#15803d', // Green
      },
    },
  },
  plugins: [],
};