export function defaultLocalizedString(locStr?: LocalizedString | null) {
  return {
    fi_FI: '',
    sv_FI: '',
    ...locStr,
  };
}
