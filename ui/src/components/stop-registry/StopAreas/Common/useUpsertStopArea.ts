import { ApolloError, gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGeoJsonType,
  StopRegistryNameType,
  StopRegistryStopPlaceInput,
  useUpsertStopAreaMutation,
} from '../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../types';
import {
  KnownValueKey,
  mapPointToStopRegistryGeoJSON,
  patchAlternativeNames,
  patchKeyValues,
  showDangerToast,
} from '../../../../utils';
import { useStopAreaDetailsApolloErrorHandler } from './DeleteStopArea/stopAreaDetailsErrorHandler';
import { getEnrichedStopPlace } from './getEnrichedStopPlace';
import { StopAreaFormState } from './stopAreaFormSchema';

const GQL_UPSERT_STOP_AREA = gql`
  mutation UpsertStopArea($input: stop_registry_StopPlaceInput!) {
    stop_registry {
      mutateStopPlace(StopPlace: $input) {
        ...StopPlaceDetails
      }
    }
  }
`;

function initializeStopArea(
  stopAreaLocation: GeoJSON.Point,
): EnrichedStopPlace {
  return {
    geometry: {
      coordinates: stopAreaLocation.coordinates,
      type: StopRegistryGeoJsonType.Point,
    },
  };
}

type UpsertStopAreaInputs = {
  readonly stop: EnrichedStopPlace;
  readonly state: StopAreaFormState;
};

function mapFormStateToInput({
  stop,
  state,
}: UpsertStopAreaInputs): StopRegistryStopPlaceInput {
  const { id } = stop;

  return {
    id,
    alternativeNames: patchAlternativeNames(stop, [
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
    ]),
    // Don't allow updating/or even touching PrivateCode field for
    // existing StopAreas.
    ...(id
      ? {}
      : {
          privateCode: {
            value: state.privateCode,
            type: 'HSL/JORE-4',
          },
        }),
    name: {
      value: state.name,
      lang: 'fin',
    },
    geometry: mapPointToStopRegistryGeoJSON(state),
    transportMode: state.transportMode,
    validBetween: null,
    keyValues: patchKeyValues(
      stop,
      compact([
        {
          key: KnownValueKey.ValidityStart,
          values: [state.validityStart],
        },
        state.validityEnd
          ? {
              key: KnownValueKey.ValidityEnd,
              values: [state.validityEnd],
            }
          : undefined,
      ]),
    ).filter((kv) =>
      kv?.key !== KnownValueKey.ValidityEnd ? true : !state.indefinite,
    ),
  };
}

export function useUpsertStopArea() {
  const { t } = useTranslation();
  const tryHandleApolloError = useStopAreaDetailsApolloErrorHandler();
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation({
    awaitRefetchQueries: true,
    refetchQueries: [
      'GetStopAreasByLocation',
      'GetLatestStopPlaceChange',
      'GetStopPlaceDetails',
      'GetStopPlaceChangeHistory',
    ],
  });

  /**
   * Update an existing stop area, or create a new one.
   * If id is given, this will update the matching entity,
   * otherwise a new one is created.
   */
  const upsertStopArea = useCallback(
    async (inputs: UpsertStopAreaInputs) => {
      const input = mapFormStateToInput(inputs);

      const result = await upsertStopAreaMutation({
        variables: { input },
      });

      return getEnrichedStopPlace(
        result.data?.stop_registry?.mutateStopPlace?.at(0),
      );
    },
    [upsertStopAreaMutation],
  );

  const defaultErrorHandler = useCallback(
    (error: unknown, details?: StopAreaFormState) => {
      if (error instanceof ApolloError) {
        const isKnowError = tryHandleApolloError(error, details);
        if (isKnowError) {
          return;
        }
      }
      if (error instanceof Error) {
        showDangerToast(
          `${t(($) => $.errors.saveFailed)}, ${error}, ${error.message}`,
        );
      } else {
        showDangerToast(`${t(($) => $.errors.saveFailed)}, ${error}`);
      }
    },
    [t, tryHandleApolloError],
  );

  return {
    initializeStopArea,
    upsertStopArea,
    defaultErrorHandler,
  };
}
