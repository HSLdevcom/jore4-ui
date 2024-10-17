import { ApolloError, gql } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGroupOfStopPlacesInput,
  useUpsertStopAreaMutation,
} from '../../../generated/graphql';
import { StopAreaByIdResult } from '../../../types';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapPointToStopRegistryGeoJSON,
  showDangerToast,
} from '../../../utils';
import { StopAreaFormState } from './stopAreaFormSchema';
import { useStopAreaDetailsApolloErrorHandler } from './util/stopAreaDetailsErrorHandler';

const GQL_UPSERT_STOP_AREA = gql`
  mutation UpsertStopArea($object: stop_registry_GroupOfStopPlacesInput) {
    stop_registry {
      mutateGroupOfStopPlaces(GroupOfStopPlaces: $object) {
        id
      }
    }
  }
`;

const initializeStopArea = (
  stopAreaLocation: GeoJSON.Point,
): StopAreaByIdResult => {
  return {
    geometry: {
      coordinates: stopAreaLocation.coordinates,
    },
    members: [],
  };
};

const mapFormStateToInput = ({
  id,
  state,
}: {
  id: string | undefined | null;
  state: StopAreaFormState;
}): StopRegistryGroupOfStopPlacesInput => {
  const validityStart = mapDateInputToValidityStart(state.validityStart);
  const members = state.memberStops.map((stopPlace) => ({ ref: stopPlace.id }));

  const input: StopRegistryGroupOfStopPlacesInput = {
    id,
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

export const useUpsertStopArea = () => {
  const { t } = useTranslation();
  const { tryHandle: tryHandleApolloError } =
    useStopAreaDetailsApolloErrorHandler();
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation();

  /**
   * Update an existing stop area, or create a new one.
   * If id is given, this will update the matching entity,
   * otherwise a new one is created.
   */
  const upsertStopArea = useCallback(
    async ({
      id,
      state,
    }: {
      id: string | undefined | null;
      state: StopAreaFormState;
    }) => {
      const input = mapFormStateToInput({ id, state });
      const result = await upsertStopAreaMutation({
        variables: { object: input },
      });

      return result.data?.stop_registry?.mutateGroupOfStopPlaces;
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
