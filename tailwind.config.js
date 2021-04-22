module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'], // Tailwind can tree-shake unused styles in production in files defined in these directories
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: '#007AC9',
        'brand-darker': '#0068ab',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
