import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { StopAreaFormState } from '../../../components/map/stop-areas/stopAreaFormSchema';
import {
  StopRegistryGroupOfStopPlaces,
  StopRegistryGroupOfStopPlacesInput,
  useUpsertStopAreaMutation,
} from '../../../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapPointToStopRegistryGeoJSON,
  showDangerToast,
} from '../../../utils';

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

  const mapFormStateToInput = (
    state: StopAreaFormState,
  ): StopRegistryGroupOfStopPlacesInput => {
    const validityStart = mapDateInputToValidityStart(state.validityStart);
    const input: StopRegistryGroupOfStopPlacesInput = {
      name: {
        value: state.label,
        lang: 'fin',
      },
      description: {
        value: state.name,
        lang: 'fin',
      },
      geometry: mapPointToStopRegistryGeoJSON(state),
      validBetween: validityStart && {
        fromDate: validityStart,
        toDate: mapDateInputToValidityEnd(state.validityEnd, state.indefinite),
      },
    };
    return input;
  };

  /**
   * Update an existing stop area, or create a new one.
   * If id is given, this will update the matching entity,
   * otherwise a new one is created.
   */
  const upsertStopArea = async (stopArea: StopAreaFormState) => {
    const input = mapFormStateToInput(stopArea);
    const result = await upsertStopAreaMutation({
      variables: { object: input },
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
