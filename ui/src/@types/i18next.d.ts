import 'i18next';

import common from '../locales/fi-FI/common.json';

// Configuring types for i18next
// https://www.i18next.com/overview/typescript#custom-type-options

declare module 'i18next' {
  interface CustomTypeOptions {
    // Do not return null from t function
    returnNull: false;
    defaultNS: 'common';
    enableSelector: true;
    resources: { common: typeof common };
  }
}
