import { ApolloError, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryParentStopPlaceInput,
  useUpdateTerminalMutation,
} from '../../../../generated/graphql';
import { showDangerToastWithError } from '../../../../utils';
import { TerminalFormState } from '../components/basic-details/basic-details-form/schema';
import { TerminalOwnerFormState } from '../components/owner-details/terminalOwnerSchema';
import { TerminalValidityFormState } from '../components/terminal-versions/TerminalValidityFormState';
import { useTerminalApolloErrorHandler } from '../utils/terminalErrorHandler';
import { getEnrichedParentStopPlace } from './useGetTerminalDetails';

const GQL_UPDATE_TERMINAL = gql`
  mutation UpdateTerminal($input: stop_registry_ParentStopPlaceInput!) {
    stop_registry {
      mutateParentStopPlace(ParentStopPlace: $input) {
        ...parent_stop_place_details
      }
    }
  }
`;

export const useUpdateTerminal = () => {
  const { t } = useTranslation();
  const tryHandleApolloError = useTerminalApolloErrorHandler();
  const [updateTerminalMutation] = useUpdateTerminalMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['getParentStopPlaceDetails', 'GetStopTerminalsByLocation'],
  });

  const updateTerminal = useCallback(
    async (input: StopRegistryParentStopPlaceInput) => {
      const result = await updateTerminalMutation({
        variables: { input },
      });

      return getEnrichedParentStopPlace(
        result.data?.stop_registry?.mutateParentStopPlace?.at(0),
      );
    },
    [updateTerminalMutation],
  );

  const defaultErrorHandler = useCallback(
    (
      err: unknown,
      details?:
        | TerminalFormState
        | TerminalValidityFormState
        | TerminalOwnerFormState,
    ) => {
      if (err instanceof ApolloError) {
        const isKnownError = tryHandleApolloError(err, details);
        if (isKnownError) {
          return;
        }
      }

      showDangerToastWithError(t('errors.saveFailed'), err);
    },
    [t, tryHandleApolloError],
  );

  return {
    updateTerminal,
    defaultErrorHandler,
  };
};
