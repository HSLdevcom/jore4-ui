export const buildLocalizedString = (str: string) => ({
  fi_FI: str,
  sv_FI: `${str} SV`,
});

export const buildRoute = (postfix: string) => ({
  label: `route ${postfix}`,
  name_i18n: buildLocalizedString(`route ${postfix}`),
  description_i18n: buildLocalizedString(`description ${postfix}`),
  origin_name_i18n: buildLocalizedString(`origin ${postfix}`),
  origin_short_name_i18n: buildLocalizedString(`origin short ${postfix}`),
  destination_name_i18n: buildLocalizedString(`destination ${postfix}`),
  destination_short_name_i18n: buildLocalizedString(
    `destination short ${postfix}`,
  ),
});
