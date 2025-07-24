import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryNameType,
  useCreateTerminalMutation,
} from '../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../types';
import {
  mapPointToStopRegistryGeoJSON,
  showDangerToastWithError,
} from '../../../utils';
import { TerminalFormState } from './components/basic-details/basic-details-form/schema';
import { getEnrichedParentStopPlace } from './useGetTerminalDetails';

const GQL_CREATE_TERMINAL = gql`
  mutation CreateTerminal(
    $input: stop_registry_createMultiModalStopPlaceInput!
  ) {
    stop_registry {
      createMultiModalStopPlace(input: $input) {
        ...parent_stop_place_details
      }
    }
  }
`;

type CreateTerminalInputs = {
  readonly state: TerminalFormState;
};

const mapFormStateToInput = ({
  state,
}: CreateTerminalInputs): StopRegistryCreateMultiModalStopPlaceInput => {
  const uniqueChildStopPlaces = uniq(
    state.selectedStops.map((stop) => stop.stopPlaceId),
  );

  return {
    name: {
      value: state.name,
      lang: 'fin',
    },
    privateCode: {
      value: state.privateCode,
      type: 'HSL/JORE-4',
    },
    description: {
      value: state.description.value ?? '',
      lang: state.description.lang ?? 'fin',
    },
    geometry: mapPointToStopRegistryGeoJSON(state),
    stopPlaceIds: uniqueChildStopPlaces,
    validBetween: null,
    keyValues: compact([
      state.validityStart
        ? {
            key: 'validityStart',
            values: [state.validityStart],
          }
        : undefined,
      state.validityEnd
        ? {
            key: 'validityEnd',
            values: [state.validityEnd],
          }
        : undefined,
      state.terminalType
        ? {
            key: 'terminalType',
            values: [state.terminalType],
          }
        : undefined,
      state.departurePlatforms
        ? {
            key: 'departurePlatforms',
            values: [state.departurePlatforms],
          }
        : undefined,
      state.arrivalPlatforms
        ? {
            key: 'arrivalPlatforms',
            values: [state.arrivalPlatforms],
          }
        : undefined,
      state.loadingPlatforms
        ? {
            key: 'loadingPlatforms',
            values: [state.loadingPlatforms],
          }
        : undefined,
      state.electricCharging
        ? {
            key: 'electricCharging',
            values: [state.electricCharging],
          }
        : undefined,
    ]),
    alternativeNames: [
      {
        name: { lang: 'swe', value: state.nameSwe },
        nameType: StopRegistryNameType.Translation,
      },
      {
        name: { lang: 'eng', value: state.nameEng },
        nameType: StopRegistryNameType.Translation,
      },
      {
        name: { lang: 'swe', value: state.abbreviationSwe },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'fin', value: state.abbreviationFin },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'eng', value: state.abbreviationEng },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'fin', value: state.nameLongFin },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'swe', value: state.nameLongSwe },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'eng', value: state.nameLongEng },
        nameType: StopRegistryNameType.Alias,
      },
    ],
  };
};

const initializeTerminal = (
  terminalLocation: GeoJSON.Point,
): EnrichedParentStopPlace => {
  return {
    geometry: {
      coordinates: terminalLocation.coordinates,
    },
  };
};

export const useCreateTerminal = () => {
  const { t } = useTranslation();
  const [createTerminalMutation] = useCreateTerminalMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetStopTerminalsByLocation'],
  });

  const createTerminal = useCallback(
    async (inputs: CreateTerminalInputs) => {
      const input = mapFormStateToInput(inputs);
      const result = await createTerminalMutation({
        variables: { input },
      });

      return getEnrichedParentStopPlace(
        result.data?.stop_registry?.createMultiModalStopPlace,
      );
    },
    [createTerminalMutation],
  );

  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    initializeTerminal,
    createTerminal,
    defaultErrorHandler,
  };
};
