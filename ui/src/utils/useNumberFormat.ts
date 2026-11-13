import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { areEqual } from './areEqual';
import { memoizeOne } from './memoizeOne';

export function useNumberFormat(options?: Intl.NumberFormatOptions) {
  const { t } = useTranslation();
  const langCode = t(($) => $.languages.intlLangCode);
  return useRef(memoizeOne(Intl.NumberFormat, areEqual)).current(
    langCode,
    options,
  );
}
