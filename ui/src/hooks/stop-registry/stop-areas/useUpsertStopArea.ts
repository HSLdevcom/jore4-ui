import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGroupOfStopPlaces,
  StopRegistryGroupOfStopPlacesInput,
  useUpsertStopAreaMutation,
} from '../../../generated/graphql';
import { showDangerToast } from '../../../utils';

const GQL_UPSERT_STOP_AREA = gql`
  mutation UpsertStopArea($object: stop_registry_GroupOfStopPlacesInput) {
    stop_registry {
      mutateGroupOfStopPlaces(GroupOfStopPlaces: $object) {
        id
      }
    }
  }
`;

export const useUpsertStopArea = () => {
  const { t } = useTranslation();
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation();

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

  /**
   * Update an existing stop area, or create a new one.
   * If id is given, this will update the matching entity,
   * otherwise a new one is created.
   */
  const upsertStopArea = async (
    stopArea: StopRegistryGroupOfStopPlacesInput,
  ) => {
    const result = await upsertStopAreaMutation({
      variables: { object: stopArea },
    });
    return result.data?.stop_registry?.mutateGroupOfStopPlaces;
  };

  const defaultErrorHandler = (err: Error) => {
    showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };

  return {
    initializeStopArea,
    upsertStopArea,
    defaultErrorHandler,
  };
};
