const headlessUiPlugin = require('@headlessui/tailwindcss');
const defaultTheme = require('tailwindcss/defaultTheme');
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
          'hsl-button-selected': colors.background.hslButtonSelected,
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
        'accent-secondary': colors.accentSecondary,
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
      boxShadow: {
        't-md': '0 -4px 6px -1px #0000001a, 0 -2px 4px -2px #0000001a',
      },
    },
  },
  plugins: [headlessUiPlugin],
};
