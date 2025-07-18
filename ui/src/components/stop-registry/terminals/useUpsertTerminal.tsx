import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryParentStopPlaceInput,
  useUpsertTerminalMutation,
} from '../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../types';
import { showDangerToastWithError } from '../../../utils';
import { getEnrichedParentStopPlace } from './useGetTerminalDetails';

// TODO: This is not really upsert but update
// When inserting the following error occurs:
// Exception while fetching data (/mutateParentStopPlace) : Cannot create new parent stop place. Use mutation createMultiModalStopPlace
const GQL_UPSERT_TERMINAL = gql`
  mutation UpsertTerminal($input: stop_registry_ParentStopPlaceInput!) {
    stop_registry {
      mutateParentStopPlace(ParentStopPlace: $input) {
        ...parent_stop_place_details
      }
    }
  }
`;

const initializeTerminal = (
  terminalLocation: GeoJSON.Point,
): EnrichedParentStopPlace => {
  return {
    geometry: {
      coordinates: terminalLocation.coordinates,
    },
  };
};

export const useUpsertTerminal = () => {
  const { t } = useTranslation();
  const [upsertTerminalMutation] = useUpsertTerminalMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['getParentStopPlaceDetails'],
  });

  const upsertTerminal = useCallback(
    async (input: StopRegistryParentStopPlaceInput) => {
      const result = await upsertTerminalMutation({
        variables: { input },
      });

      return getEnrichedParentStopPlace(
        result.data?.stop_registry?.mutateParentStopPlace?.at(0),
      );
    },
    [upsertTerminalMutation],
  );

  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    initializeTerminal,
    upsertTerminal,
    defaultErrorHandler,
  };
};
