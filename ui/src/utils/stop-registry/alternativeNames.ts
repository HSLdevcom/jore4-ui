import i18next from 'i18next';

type AlternativeName = {
  readonly name_lang?: string | null;
  readonly name_value?: string | null;
};

const i18nLangToMultilingualStringLangOrder = {
  'fi-FI': ['fin', 'swe', 'eng'],
  'en-US': ['eng', 'fin', 'swe'],
} as const;

function getFindOrder(): ReadonlyArray<string> {
  if (i18next.language in i18nLangToMultilingualStringLangOrder) {
    return i18nLangToMultilingualStringLangOrder[
      i18next.language as keyof typeof i18nLangToMultilingualStringLangOrder
    ];
  }

  return i18nLangToMultilingualStringLangOrder['fi-FI'];
}

export function getNameFromAlternatives(
  defaultName: string,
  defaultLang: string | undefined,
  alternatives: ReadonlyArray<AlternativeName> | undefined | null,
): string;
export function getNameFromAlternatives(
  defaultName: string | undefined | null,
  defaultLang: string | undefined | null,
  alternatives: ReadonlyArray<AlternativeName> | undefined | null,
): string | null;
export function getNameFromAlternatives(
  defaultName: string | null | undefined,
  defaultLang: string | null | undefined,
  alternatives: ReadonlyArray<AlternativeName> | null | undefined,
): string | null {
  const findOrder = getFindOrder();

  if (defaultLang !== findOrder.at(0) && alternatives) {
    for (const preferredLang of findOrder) {
      for (const alt of alternatives) {
        if (alt.name_lang === preferredLang && alt.name_value) {
          return alt.name_value;
        }
      }
    }
  }

  return defaultName ?? null;
}
