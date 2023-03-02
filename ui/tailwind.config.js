/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const theme = require('./theme.js');

const { colors } = theme;

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Tailwind can tree-shake unused styles in production in files defined in these directories
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        'brand-darker': colors.brandDarker,
        'tweaked-brand': colors.tweakedBrand,
        stop: colors.stop,
        background: colors.background,
        'hsl-dark-80': colors.hslDark80,
        grey: colors.grey,
        'light-grey': colors.lightGrey,
        'lighter-grey': colors.lighterGrey,
        'dark-grey': colors.darkGrey,
        'hsl-dark-green': colors.hslDarkGreen,
        'hsl-red': colors.hslRed,
        'hsl-neutral-blue': colors.hslNeutralBlue,
        'city-bicycle-yellow': colors.cityBicycleYellow,
        'hsl-warning-yellow': colors.hslWarningYellow,
        'hsl-highlight-yellow-dark': colors.hslHighlightYellowDark,
        'hsl-highlight-yellow-light': colors.hslHighlightYellowLight,
        'hsl-light-purple': colors.hslLightPurple,
      },
      borderWidth: {
        10: '10px',
        12: '12px',
      },
      fontFamily: {
        sans: ['Arial', ...defaultTheme.fontFamily.sans],
        narrow: ['Arial Narrow', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
        xl: '1.375rem', // 22px
        '2xl': '1.625rem', // 26px
        '3xl': '2rem', // 32px
      },
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
  safelist: [
    {
      // these classes are referenced dynamically by a template string, so have to remove them from tree-shaking
      pattern: /^grid/,
      variants: ['md'],
    },
  ],
};
