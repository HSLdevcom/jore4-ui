import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryParentStopPlaceInput,
  useUpdateTerminalMutation,
} from '../../../generated/graphql';
import { showDangerToastWithError } from '../../../utils';
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
  const [updateTerminalMutation] = useUpdateTerminalMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['getParentStopPlaceDetails'],
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

  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    updateTerminal,
    defaultErrorHandler,
  };
};
