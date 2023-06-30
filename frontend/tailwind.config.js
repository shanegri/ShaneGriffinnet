/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,jsx}'],
  darkMode: true,
  content: [],
  theme: {
    extend: {
      colors: {
        'dark': '#0a0f0f'
      }
    }
  },
  plugins: [],
}

