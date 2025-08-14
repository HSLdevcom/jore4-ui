import { ApolloError } from '@apollo/client';
import get from 'lodash/get';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../i18n';
import { showDangerToast } from '../../../../utils';
import { TerminalFormState } from '../components/basic-details/basic-details-form/schema';
import { TerminalValidityFormState } from '../components/terminal-versions/TerminalValidityFormState';

const ERRORS: Readonly<Record<string, TranslationKey>> = {
  STOP_PLACE_UNIQUE_NAME: 'terminalDetails.errors.terminalsUniqueName',

  STOP_PLACE_UNIQUE_PRIVATE_CODE:
    'terminalDetails.errors.terminalsUniquePrivateCode',
};

function mapApolloErrorToTranslationKey(
  error: ApolloError,
): TranslationKey | null {
  const errorCode: unknown = get(error, ['cause', 'extensions', 'errorCode']);
  if (typeof errorCode === 'string' && errorCode in ERRORS) {
    return ERRORS[errorCode];
  }

  return null;
}

export function useTerminalApolloErrorHandler(): (
  error: ApolloError,
  details?: TerminalFormState | TerminalValidityFormState,
) => boolean {
  const { t } = useTranslation();

  return useCallback(
    (
      error: ApolloError,
      details?: TerminalFormState | TerminalValidityFormState,
    ): boolean => {
      const translationKey = mapApolloErrorToTranslationKey(error);
      if (translationKey) {
        showDangerToast(t(translationKey, details));
        return true;
      }
      return false;
    },
    [t],
  );
}
