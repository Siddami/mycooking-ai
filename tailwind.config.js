/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/cooking-ai-react/src/**/*.{ts,tsx}",
    "./apps/cooking-ai-angular/src/**/*.{ts,html}"
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