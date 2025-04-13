/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/**/*.{html,ts,tsx,jsx}',
    './libs/**/*.{html,ts,tsx,jsx}',
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