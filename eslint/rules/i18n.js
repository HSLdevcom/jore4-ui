const { resolve } = require('path');

module.exports = {
  rules: {
    'i18n-json/sorted-keys': 'off',
    'i18n-json/valid-message-syntax': 'off', // Seems to be a bit broken currently.
    'i18n-json/identical-keys': [
      'error',
      {
        filePath: {
          'common.json': resolve(
            __dirname,
            '../../ui/src/locales/fi-FI/common.json',
          ),
          'accessibility.json': resolve(
            __dirname,
            '../../ui/src/locales/fi-FI/accessibility.json',
          ),
        },
      },
    ],
  },
};
