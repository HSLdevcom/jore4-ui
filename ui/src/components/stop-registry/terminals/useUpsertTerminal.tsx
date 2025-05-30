import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryParentStopPlaceInput,
  useUpsertTerminalMutation,
} from '../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../types';
import { showDangerToast } from '../../../utils';
import { getEnrichedParentStopPlace } from './useGetTerminalDetails';

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
  const [upsertTerminalMutation] = useUpsertTerminalMutation();

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

  const defaultErrorHandler = useCallback(
    (error: unknown) => {
      if (error instanceof Error) {
        showDangerToast(
          `${t('errors.saveFailed')}, ${error}, ${error.message}`,
        );
      } else {
        showDangerToast(`${t('errors.saveFailed')}, ${error}`);
      }
    },
    [t],
  );

  return {
    initializeTerminal,
    upsertTerminal,
    defaultErrorHandler,
  };
};
