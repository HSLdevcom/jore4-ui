import { illegalExportDoNotUseOrYouWillRegretItI18NextGlobalInstance as i18n } from '../i18n';

export const parseI18nField = (i18nField: ExplicitAny) => {
  if (!i18nField) {
    return 'Missing i18n object';
  }
  // we have defined locales to our i18n library like 'fi-FI',
  // but api returns those as 'fi_FI'.
  const locale = i18n.language.replace('-', '_');
  const requestedtranslation = i18nField[locale];
  const fallbackTranslation = i18nField.fi_FI ?? '';
  return requestedtranslation ?? fallbackTranslation;
};
