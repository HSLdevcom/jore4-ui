import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

function debugValue(value: unknown): string {
  return `typeof(${typeof value}) | String(${value}) | Json(${JSON.stringify(value, null, 0)})`;
}

/**
 * Returns a function that reacts to changes in the locale and
 * which return a localized string from an JSON object stored
 * as untyped JSON or JSONB blob in the database. The object
 * is assumed to contain locale-to-translations pairs such as
 * `{ "fi_FI": "Käännös teksti" }`. Throws if the given value
 * is not an object or if non-string data is stored under the key.
 *
 * For compatability an empty string is returned if the given blob
 * is undefined or null.
 *
 */
export function useGetLocalizedTextFromDbBlob(): (
  blob: unknown,
  fallbackField?: string,
) => string {
  const { i18n } = useTranslation();

  // we have defined locales to our i18n library like 'fi-FI',
  // but the API (which API are we actually talking about?) returns those as 'fi_FI'.
  const locale = i18n.language.replace('-', '_');

  return useCallback(
    (blob: unknown, fallbackField: string = 'fi_FI') => {
      if (blob === undefined || blob === null) {
        return '';
      }

      if (typeof blob !== 'object') {
        throw new Error(
          `Given blob is not an JS object! Blob: ${debugValue(blob)}`,
        );
      }
      const typedBlob = blob as Record<string, unknown>;

      if (locale in typedBlob) {
        const value = typedBlob[locale];

        if (typeof value !== 'string') {
          throw new Error(
            `Given blob does contain the locale key (${locale}) but its not a string! Value: ${debugValue(value)}`,
          );
        }

        return value;
      }

      if (fallbackField in typedBlob) {
        const value = typedBlob[fallbackField];

        if (typeof value !== 'string') {
          throw new Error(
            `Given blob does contain the fallback field (${fallbackField}) but its not a string! Value: ${debugValue(value)}`,
          );
        }

        return value;
      }

      throw new Error(
        `Given blob does not contain the locale (${locale}) nor the fallback field (${fallbackField})! Blob: ${debugValue(typedBlob)}`,
      );
    },
    [locale],
  );
}
