import i18next, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsJson from './locales/fi-FI/common.json';

export type SupportedLocale = 'fi-FI' | 'en-US';
export const defaultLocale: SupportedLocale = 'fi-FI';

const modules = ['common', 'accessibility'];
const locales = ['fi-FI', 'en-US'];
const resources: Resource = {};
locales.forEach((locale) => {
  modules.forEach((module) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,global-require,import/no-dynamic-require
    const tr = require(`./locales/${locale}/${module}.json`);
    if (!resources[locale]) {
      resources[locale] = {};
    }
    resources[locale][module] = tr;
  });
});
i18next.use(initReactI18next).init({
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

/**
 * Global refence to the I18Next objects should never be used in React code.
 * Function calls employing the global instance cannot react to changes in
 * language, translations or other state bits stored in the I18Next object.
 * Instead, one should always retrieve the active version/state of the I18Next
 * object with the help of `useContext(import('react-18next').I18NextContext)`
 * or `useTranslation` hooks.
 */
export const illegalExportDoNotUseOrYouWillRegretItI18NextGlobalInstance =
  i18next;

// All the translation key paths as strings (e.g. "navigation.logout")
export type TranslationKey = Paths<typeof translationsJson>;
