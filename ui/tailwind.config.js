/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const headlessUiPlugin = require('@headlessui/tailwindcss');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const theme = require('./theme.js');

const { colors } = theme;

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Tailwind can tree-shake unused styles in production in files defined in these directories
  theme: {
    extend: {
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
      },
      colors: {
        brand: colors.brand,
        'brand-darker': colors.brandDarker,
        'tweaked-brand': {
          DEFAULT: colors.tweakedBrand,
          darker30: colors.tweakedBrandDarker30,
        },
        stop: colors.stop,
        background: {
          DEFAULT: colors.background.grey,
          'hsl-blue': colors.background.hslBlue,
          'hsl-city-bike-yellow': colors.background.hslCityBikeYellow,
          'hsl-commuter-train-purple': colors.background.hslCommuterTrainPurple,
          'hsl-ferry-10': colors.background.hslFerry10,
          'hsl-ferry-blue': colors.background.hslFerryBlue,
          'hsl-green-10': colors.background.hslGreen10,
          'hsl-green': colors.background.hslGreen,
          'hsl-metro-orange': colors.background.hslMetroOrange,
          'hsl-pink-10': colors.background.hslPink10,
          'hsl-pink': colors.background.hslPink,
          'hsl-speed-tram-turquoise': colors.background.hslSpeedTramTurquoise,
          'hsl-tram-green': colors.background.hslTramGreen,
        },
        border: {
          'hsl-blue': colors.border.hslBlue,
          'hsl-city-bike-yellow': colors.border.hslCityBikeYellow,
          'hsl-commuter-train-purple': colors.border.hslCommuterTrainPurple,
          'hsl-ferry-10': colors.border.hslFerry10,
          'hsl-ferry-blue': colors.border.hslFerryBlue,
          'hsl-green-10': colors.border.hslGreen10,
          'hsl-green': colors.border.hslGreen,
          'hsl-metro-orange': colors.border.hslMetroOrange,
          'hsl-pink-10': colors.border.hslPink10,
          'hsl-pink': colors.border.hslPink,
          'hsl-speedtram-turquoise': colors.border.hslSpeedtramTurquoise,
          'hsl-tram-green': colors.border.hslTramGreen,
        },
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
        'hsl-warning-red': colors.hslWarningRed,
        'hsl-warning-surface': colors.background.hslWarningSurface,
        'hsl-highlight-yellow-dark': colors.hslHighlightYellowDark,
        'hsl-highlight-yellow-light': colors.hslHighlightYellowLight,
        'hsl-light-purple': colors.hslLightPurple,
        'hsl-orange': colors.hslOrange,
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
    headlessUiPlugin,
  ],
  safelist: [
    {
      // these classes are referenced dynamically by a template string, so have to remove them from tree-shaking
      pattern: /^grid/,
      variants: ['md', 'lg'],
    },
  ],
};
