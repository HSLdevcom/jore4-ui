import { ApolloError } from '@apollo/client';
import get from 'lodash/get';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../i18n';
import { showDangerToast } from '../../../../utils';
import { StopAreaFormState } from '../stopAreaFormSchema';

const ERRORS: Readonly<Record<string, TranslationKey>> = {
  GROUP_OF_STOP_PLACES_UNIQUE_NAME:
    'stopAreaDetails.errors.groupOfStopPlacesUniqueName',

  GROUP_OF_STOP_PLACES_UNIQUE_DESCRIPTION:
    'stopAreaDetails.errors.groupOfStopPlacesUniqueDescription',
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

export function useStopAreaDetailsApolloErrorHandler(): (
  error: ApolloError,
  details?: StopAreaFormState,
) => boolean {
  const { t } = useTranslation();

  return useCallback(
    (error: ApolloError, details?: StopAreaFormState): boolean => {
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
