import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGroupOfStopPlaces,
  StopRegistryGroupOfStopPlacesInput,
  useInsertStopAreaMutation,
} from '../../generated/graphql';
import { showDangerToast } from '../../utils';

const GQL_INSERT_STOP_AREA = gql`
  mutation InsertStopArea($object: stop_registry_GroupOfStopPlacesInput) {
    stop_registry {
      mutateGroupOfStopPlaces(GroupOfStopPlaces: $object) {
        id
      }
    }
  }
`;

function initializeStopArea(
  stopAreaLocation: GeoJSON.Point,
): StopRegistryGroupOfStopPlaces {
  return {
    geometry: {
      coordinates: stopAreaLocation.coordinates,
    },
    members: [],
  };
}

export const useCreateStopArea = () => {
  const { t } = useTranslation();
  const [insertStopAreaMutation] = useInsertStopAreaMutation();

  const createStopArea = useCallback(
    async (stopArea: StopRegistryGroupOfStopPlacesInput) => {
      const result = await insertStopAreaMutation({
        variables: { object: stopArea },
      });
      return result.data?.stop_registry?.mutateGroupOfStopPlaces;
    },
    [insertStopAreaMutation],
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
    initializeStopArea,
    createStopArea,
    defaultErrorHandler,
  };
};
