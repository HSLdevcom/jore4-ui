import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Allows sorting the labels so that letters come before numbers.
 * 3Y -> Line 3 variant Y
 * 30 → Line 30 > 3
 * 200 → Line 200 > 3 & 30
 */
export function useNumericSortingCollator() {
  const { i18n } = useTranslation();

  return useMemo(
    () => new Intl.Collator(i18n.language, { numeric: true }),
    [i18n.language],
  );
}
