import { gql } from '@apollo/client';
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

export const useCreateStopArea = () => {
  const { t } = useTranslation();
  const [insertStopAreaMutation] = useInsertStopAreaMutation();

  const initializeStopArea = (
    stopAreaLocation: GeoJSON.Point,
  ): StopRegistryGroupOfStopPlaces => {
    return {
      geometry: {
        coordinates: stopAreaLocation.coordinates,
      },
      members: [],
    };
  };

  const createStopArea = async (
    stopArea: StopRegistryGroupOfStopPlacesInput,
  ) => {
    const result = await insertStopAreaMutation({
      variables: { object: stopArea },
    });
    return result.data?.stop_registry?.mutateGroupOfStopPlaces;
  };

  const defaultErrorHandler = (err: Error) => {
    showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };

  return {
    initializeStopArea,
    createStopArea,
    defaultErrorHandler,
  };
};
