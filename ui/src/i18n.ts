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
  react: {
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['b', 'br', 'i', 'span'],
  },
});

/**
 * All the translation key paths as strings (e.g. "navigation.logout")
 * Retain here so that I don't have to re-implement everything form in the app,
 * as part of this change set.
 *
 * Preferred alternatives:
 * 1. Do the translation at the calling in, and pass through the actual
 *    translated value into the child component.
 * 2. Cant do that? Reconsider your codes design.
 * 3. Still cant do that? Pass through separate testIds and construct a proper
 *    I18Next Selector function that can be passed through to the end use site.
 *
 * @deprecated
 */
export type TranslationKey = Paths<typeof fiCommon>;
