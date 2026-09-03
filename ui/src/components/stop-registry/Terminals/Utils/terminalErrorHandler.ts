import { ApolloError } from '@apollo/client';
import { SelectorParam } from 'i18next';
import get from 'lodash/get';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showDangerToast } from '../../../../utils';
import { TerminalFormState } from '../Components/BasicDetails/Edit/schema';
import { TerminalOwnerFormState } from '../Components/OwnerDetails/terminalOwnerSchema';
import { TerminalValidityFormState } from '../Components/Versions/TerminalValidityFormState';

const ERRORS: Readonly<Record<string, SelectorParam>> = {
  STOP_PLACE_UNIQUE_NAME: ($) => $.terminalDetails.errors.terminalsUniqueName,

  STOP_PLACE_UNIQUE_PRIVATE_CODE: ($) =>
    $.terminalDetails.errors.terminalsUniquePrivateCode,
};

function mapApolloErrorToTranslationKey(
  error: ApolloError,
): SelectorParam | null {
  const errorCode: unknown = get(error, ['cause', 'extensions', 'errorCode']);
  if (typeof errorCode === 'string' && errorCode in ERRORS) {
    return ERRORS[errorCode];
  }

  return null;
}

export function useTerminalApolloErrorHandler(): (
  error: ApolloError,
  details?:
    TerminalFormState | TerminalValidityFormState | TerminalOwnerFormState,
) => boolean {
  const { t } = useTranslation();

  return useCallback(
    (
      error: ApolloError,
      details?:
        TerminalFormState | TerminalValidityFormState | TerminalOwnerFormState,
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
