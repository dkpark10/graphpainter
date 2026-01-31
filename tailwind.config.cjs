/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        'main-color': 'var(--graph-main)',
        'error-color': 'var(--graph-error)',
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
