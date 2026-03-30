import { useTranslation } from 'react-i18next';

/**
 * Please do not copy, move, or use this elsewhere. This exists here only until
 * the form components get rewritten in better form. Prefer construction a proper
 * typed selector function {@link import('i18next').SelectorParam} instead.
 */
export function useTranslateStringKey(): (str: string) => string | null {
  const { t, i18n } = useTranslation();

  return (str: string) => {
    if (i18n.exists(str)) {
      return t(str);
    }

    return null;
  };
}
