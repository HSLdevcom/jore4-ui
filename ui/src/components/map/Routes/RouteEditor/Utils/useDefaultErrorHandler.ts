import { useTranslation } from 'react-i18next';
import { showDangerToastWithError } from '../../../../../utils';

// Default handler that can be used to show error messages as toast
// in case an exception is thrown
export function useDefaultErrorHandler() {
  const { t } = useTranslation();

  return (err: unknown) =>
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
}
