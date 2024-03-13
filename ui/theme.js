const theme = {
  colors: {
    brand: '#007AC9',
    brandDarker: '#0068ab', // = tweakedBrand * ~90% HSL lightness
    tweakedBrand: '#0074bf',
    tweakedBrandDarker30: '#005186', // = tweakedBrand * 70% HSL lightness
    stop: '#004B7B',
    background: '#F2F5F7',
    backgroundHslBlue: '#BFDEF1',
    hslDark80: '#333333',
    grey: '#888888',
    lightGrey: '#CCCCCC',
    lighterGrey: '#FBFCFD',
    darkGrey: '#666666',
    hslDarkGreen: '#3B7F00',
    hslRed: '#DC0451',
    hslNeutralBlue: '#E5F2FA',
    hslFerry10: '#DFF1FB',
    cityBicycleYellow: '#FCBC19',
    hslWarningYellow: '#FED100',
    hslHighlightYellowDark: '#C89515',
    hslHighlightYellowLight: '#FFD771',
    hslLightPurple: '#DDC8E0',
    hslPurple: '#C5A3CC',
    hslOrange: '#FFA87E',
    routes: {
      bus: '#0074BF',
      ferry: '#333333',
      metro: '#FF6319',
      train: '#8C4799',
      tram: '#00985F',
    },
    stops: {
      bus: '#004B7B',
      ferry: '#333333',
      metro: '#BF4A13',
      train: '#924C9F',
      tram: '#336D00',
    },
    selectedMapItem: '#DC0451',
  },
};

module.exports = theme;
