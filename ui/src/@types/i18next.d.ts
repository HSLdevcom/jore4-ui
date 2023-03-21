import 'i18next';

// Configuring types for i18next
// https://www.i18next.com/overview/typescript#custom-type-options

declare module 'i18next' {
  interface CustomTypeOptions {
    // Do not return null from t function
    returnNull: false;
  }
}
