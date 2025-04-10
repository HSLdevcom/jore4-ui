import { parseDate } from '../time';

// Submits form implemented with `react-hook-form` by ref
// useful in cases where ui designs prevent us from defining
// submit button inside the form
// https://github.com/react-hook-form/react-hook-form/issues/566#issuecomment-730077495
export const submitFormByRef = (formRef: ExplicitAny) => {
  formRef.current?.dispatchEvent(
    new Event('submit', { cancelable: true, bubbles: true }),
  );
};

// maps ISO date string (yyyy-mm-dd, returned e.g. from <input type="date" />)
// to validity start DateTime object
export const mapDateInputToValidityStart = (isoDate: string) =>
  parseDate(isoDate);
// maps ISO date string (yyyy-mm-dd, returned e.g. from <input type="date" />)
// to validity end DateTime object
export const mapDateInputToValidityEnd = (
  isoDate?: string,
  isIndefinite = false,
) => {
  if (isIndefinite) {
    return null;
  }

  if (!isoDate) {
    throw new Error('End date must either be indefinite or set!');
  }

  return parseDate(isoDate).endOf('day');
};
