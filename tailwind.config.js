// tailwind.config.js
module.exports = {
  darkMode: 'class', // Use class strategy for dark mode
  content: [
    './src/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#e3f0ff',
          100: '#b3d4ff',
          200: '#80b8ff',
          300: '#4d9cff',
          400: '#1a80ff',
          500: '#0055ff', // main primary
          600: '#0046cc',
          700: '#003699',
          800: '#002666',
          900: '#001533',
        },
        accent: {
          500: '#FFB800', // example accent color
        },
      }
    },
  },
  plugins: [],
};
