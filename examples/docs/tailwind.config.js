/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './index.html'],
  theme: {},
  plugins: [require('@tailwindcss/typography')]
};
