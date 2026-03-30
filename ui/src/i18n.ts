import { Resource, use as i18nextUse } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en-US/common.json';
import fiCommon from './locales/fi-FI/common.json';

export type SupportedLocale = 'fi-FI' | 'en-US';
export const defaultLocale: SupportedLocale = 'fi-FI';

const resources: Resource = {
  'fi-FI': { common: fiCommon },
  'en-US': { common: enCommon },
};

i18nextUse(initReactI18next).init({
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  resources,
  // Do not return null from t function
  returnNull: false,
  debug: false,
  ns: ['common'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

// All the translation key paths as strings (e.g. "navigation.logout")
export type TranslationKey = Paths<typeof fiCommon>;
