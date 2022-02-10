import { parseISODateString } from '../time';

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
  parseISODateString(isoDate);
// maps ISO date string (yyyy-mm-dd, returned e.g. from <input type="date" />)
// to validity end DateTime object
export const mapDateInputToValidityEnd = (
  isoDate?: string,
  isIndefinite = false,
) => (isIndefinite ? null : parseISODateString(isoDate)?.endOf('day'));
