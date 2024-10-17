import { ApolloError } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showDangerToast } from '../../../../utils';
import { StopAreaFormState } from '../stopAreaFormSchema';

const ERRORS: Readonly<Map<string, string>> = new Map([
  [
    'GROUP_OF_STOP_PLACES_UNIQUE_NAME',
    'stopAreaDetails.errors.groupOfStopPlacesUniqueName',
  ],
  [
    'GROUP_OF_STOP_PLACES_UNIQUE_DESCRIPTION',
    'stopAreaDetails.errors.groupOfStopPlacesUniqueDescription',
  ],
]);
type ExtensionsType = { errorCode: string };

export function useStopAreaDetailsApolloErrorHandler() {
  const { t } = useTranslation();

  const tryHandle = useCallback(
    (error: ApolloError, details?: StopAreaFormState): boolean => {
      const errorNames = Array.from(ERRORS.keys());
      const knownError: string | undefined = errorNames.find((key) => {
        const extensions: ExtensionsType | undefined = error.cause
          ?.extensions as ExtensionsType;
        return extensions?.errorCode === key;
      });
      if (knownError) {
        const knownErrorKey = ERRORS.get(knownError);
        if (knownErrorKey) {
          if (details) {
            showDangerToast(`${t(knownErrorKey, details)}`);
            return true;
          }
          showDangerToast(`${t(knownErrorKey)}`);
          return true;
        }
      }
      return false;
    },
    [t],
  );
  return { tryHandle };
}
