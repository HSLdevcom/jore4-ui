/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');
const theme = require('./theme.js');

const { colors } = theme;

module.exports = {
  purge: ['./src/**/*.{js,ts,jsx,tsx}'], // Tailwind can tree-shake unused styles in production in files defined in these directories
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        'brand-darker': colors.brandDarker,
        'tweaked-brand': colors.tweakedBrand,
        stop: colors.stop,
        grey: colors.grey,
        background: colors.background,
      },
    },
  },
  variants: {
    extend: {
      borderColor: ['important'],
      borderRadius: ['important'],
      borderWidth: ['important'],
      padding: ['important'],
    },
  },
  plugins: [
    // add support for 'important' variant which can be used by prefixing class with "!"
    // e.g. "!border-white" turns "border-white" class into !important one.
    // see: https://github.com/tailwindlabs/tailwindcss/issues/493#issuecomment-610907147
    // !! NOTE: important variants have to be explicitly enabled for rule. List of
    // rules: https://tailwindcss.com/docs/configuring-variants#default-variants-reference
    plugin(({ addVariant }) => {
      addVariant('important', ({ container }) => {
        container.walkRules((rule) => {
          // eslint-disable-next-line no-param-reassign
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            // eslint-disable-next-line no-param-reassign
            decl.important = true;
          });
        });
      });
    }),
  ],
};
