import { Resource, use as i18nextUse } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enAccessibility from './locales/en-US/accessibility.json';
import enCommon from './locales/en-US/common.json';
import fiAccessibility from './locales/fi-FI/accessibility.json';
import fiCommon from './locales/fi-FI/common.json';

export type SupportedLocale = 'fi-FI' | 'en-US';
export const defaultLocale: SupportedLocale = 'fi-FI';

const resources: Resource = {
  'fi-FI': {
    common: fiCommon,
    accessibility: fiAccessibility,
  },
  'en-US': {
    common: enCommon,
    accessibility: enAccessibility,
  },
};

i18nextUse(initReactI18next).init({
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  resources,
  debug: false,
  ns: ['common', 'accessibility'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

// All the translation key paths as strings (e.g. "navigation.logout")
export type TranslationKey = Paths<typeof fiCommon>;
