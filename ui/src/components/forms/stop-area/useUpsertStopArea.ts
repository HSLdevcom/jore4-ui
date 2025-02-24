import { ApolloError, gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryNameType,
  StopRegistryStopPlaceInput,
  useUpsertStopAreaMutation,
} from '../../../generated/graphql';
import { EnrichedStopPlace } from '../../../types';
import {
  mapPointToStopRegistryGeoJSON,
  patchAlternativeNames,
  patchKeyValues,
  showDangerToast,
} from '../../../utils';
import { StopAreaFormState } from './stopAreaFormSchema';
import { useStopAreaDetailsApolloErrorHandler } from './util/stopAreaDetailsErrorHandler';

const GQL_UPSERT_STOP_AREA = gql`
  mutation UpsertStopArea($input: stop_registry_StopPlaceInput!) {
    stop_registry {
      mutateStopPlace(StopPlace: $input) {
        ...stop_place_details
      }
    }
  }
`;

const initializeStopArea = (
  stopAreaLocation: GeoJSON.Point,
): EnrichedStopPlace => {
  return {
    geometry: {
      coordinates: stopAreaLocation.coordinates,
    },
  };
};

const mapFormStateToInput = ({
  stop,
  state,
}: {
  stop: EnrichedStopPlace;
  state: StopAreaFormState;
}): StopRegistryStopPlaceInput => {
  const { id } = stop;
  const members = state.quays.map((quay) => ({ id: quay.id }));

  return {
    id,
    alternativeNames: patchAlternativeNames(stop, [
      {
        name: { lang: 'swe', value: state.nameSwe },
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
        name: { lang: 'fin', value: state.abbreviation5CharFin },
        nameType: StopRegistryNameType.Label,
      },
      {
        name: { lang: 'swe', value: state.abbreviation5CharSwe },
        nameType: StopRegistryNameType.Label,
      },
      {
        name: { lang: 'fin', value: state.nameLongFin },
        nameType: StopRegistryNameType.Alias,
      },
      {
        name: { lang: 'swe', value: state.nameLongSwe },
        nameType: StopRegistryNameType.Alias,
      },
    ]),
    privateCode: {
      value: state.privateCode,
      type: 'HSL',
    },
    name: {
      value: state.name,
      lang: 'fin',
    },
    geometry: mapPointToStopRegistryGeoJSON(state),
    validBetween: null,
    keyValues: patchKeyValues(
      stop,
      compact([
        {
          key: 'validityStart',
          values: [state.validityStart],
        },
        state.validityEnd
          ? {
              key: 'validityEnd',
              values: [state.validityEnd],
            }
          : undefined,
      ]),
    ),
    // Tiamat doesn't accept an empty members array...
    quays: members?.length ? members : [null],
  };
};

export const useUpsertStopArea = () => {
  const { t } = useTranslation();
  const tryHandleApolloError = useStopAreaDetailsApolloErrorHandler();
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation();

  /**
   * Update an existing stop area, or create a new one.
   * If id is given, this will update the matching entity,
   * otherwise a new one is created.
   */
  const upsertStopArea = useCallback(
    async ({
      stop,
      state,
    }: {
      stop: EnrichedStopPlace;
      state: StopAreaFormState;
    }) => {
      const input = mapFormStateToInput({ stop, state });
      const result = await upsertStopAreaMutation({
        variables: { input },
      });

      return result.data?.stop_registry?.mutateStopPlace;
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
          `${t('errors.saveFailed')}, ${error}, ${error.message}`,
        );
      } else {
        showDangerToast(`${t('errors.saveFailed')}, ${error}`);
      }
    },
    [t, tryHandleApolloError],
  );

  return {
    initializeStopArea,
    upsertStopArea,
    defaultErrorHandler,
  };
};
