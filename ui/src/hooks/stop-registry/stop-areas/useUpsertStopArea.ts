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

  const mapFormStateToInput = ({
    stopArea,
    state,
  }: {
    stopArea: StopRegistryGroupOfStopPlaces;
    state: StopAreaFormState;
  }): StopRegistryGroupOfStopPlacesInput => {
    const validityStart = mapDateInputToValidityStart(state.validityStart);
    const members = stopArea.members?.map((stopPlace) => {
      // An existing stop place reference -> id is defined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
      return { ref: stopPlace?.id! };
    });

    const input: StopRegistryGroupOfStopPlacesInput = {
      id: stopArea.id,
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
      // Tiamat doesn't accept an empty members array...
      members: members?.length ? members : null,
    };
    return input;
  };

  /**
   * Update an existing stop area, or create a new one.
   * If id is given, this will update the matching entity,
   * otherwise a new one is created.
   */
  const upsertStopArea = async ({
    stopArea,
    state,
  }: {
    stopArea: StopRegistryGroupOfStopPlaces;
    state: StopAreaFormState;
  }) => {
    const input = mapFormStateToInput({ stopArea, state });
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
