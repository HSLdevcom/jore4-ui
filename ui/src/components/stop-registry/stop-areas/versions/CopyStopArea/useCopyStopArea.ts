import { useCallback } from 'react';
import {
  StopRegistryInfoSpotInput,
  useInsertMultipleStopPointsMutation,
  useUpdateInfoSpotMutation,
  useUpsertStopAreaMutation,
} from '../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../graphql';
import {
  FailedToResolveNewShelters,
  StopPlaceInsertFailed,
} from '../../../stops/stop-details/stop-version/errors';
import { InfoSpotInputHelper } from '../../../stops/stop-details/stop-version/types';
import { useGetShelters } from '../../../stops/stop-details/stop-version/utils/useGetShelterResolver';
import { wrapErrors } from '../../../stops/stop-details/stop-version/utils/wrapErrors';
import { getEnrichedStopPlace } from '../../stop-area-details/useGetStopAreaDetails';
import { useCutStopAreaValidity } from '../CutStopAreaValidity';
import { CopyStopAreaResult, StopPlacesInsertFailed } from '../types';
import {
  filterAndMapScheduledStopPoints,
  mapToStopAreaCopyInput,
} from './CopyStopAreaUtils';
import { CopyStopAreaInputs } from './types';

function useInsertStopPoints() {
  const [insertStopsMutation] = useInsertMultipleStopPointsMutation();

  return useCallback(
    async (
      stopPointsInput: ReadonlyArray<ScheduledStopPointSetInput>,
    ): Promise<ReadonlyArray<string>> => {
      if (stopPointsInput.length === 0) {
        return [];
      }

      const response = await wrapErrors(
        insertStopsMutation({
          variables: {
            stopPoints: stopPointsInput,
          },
        }),
        StopPlaceInsertFailed,
        'Failed to insert new StopPoints!',
      );

      const stopPointIds = response.data?.stopPoints?.returning.map(
        (sp) => sp.scheduled_stop_point_id,
      );

      if (!stopPointIds) {
        throw new StopPlacesInsertFailed(
          `StopPoints insert seems to have failed. No IDs returned. Response: ${JSON.stringify(response, null, 0)}`,
        );
      }

      return stopPointIds;
    },
    [insertStopsMutation],
  );
}

function useInsertInfoSpots() {
  const [updateInfoSpotMutation] = useUpdateInfoSpotMutation();
  const getShelters = useGetShelters();

  return useCallback(
    async (
      infoSpots: ReadonlyArray<InfoSpotInputHelper> | null,
      quayId: string,
    ): Promise<boolean> => {
      if (infoSpots === null) {
        return false;
      }

      const shelters = await getShelters(quayId);

      const withLocations = infoSpots.map(
        (input): StopRegistryInfoSpotInput => {
          const { originalShelter, infoSpotInput } = input;
          const { shelterNumber } = originalShelter;

          const matchingShelter = shelters.find(
            (shelter) => shelter.shelterNumber === shelterNumber,
          );

          if (!matchingShelter?.id) {
            throw new FailedToResolveNewShelters(
              `No shelter found with number ${shelterNumber}`,
            );
          }

          return {
            ...infoSpotInput,
            infoSpotLocations: [quayId, matchingShelter.id],
          };
        },
      );

      await updateInfoSpotMutation({ variables: { input: withLocations } });
      return true;
    },
    [getShelters, updateInfoSpotMutation],
  );
}

function useInsertStopAreaCopy() {
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation();
  const insertStopPoint = useInsertStopPoints();
  const insertInfoSpots = useInsertInfoSpots();

  return useCallback(
    async ({
      stopArea,
      state,
    }: CopyStopAreaInputs): Promise<CopyStopAreaResult> => {
      const input = mapToStopAreaCopyInput({ stopArea, state });

      // TODO: Insert new info spots

      const result = await upsertStopAreaMutation({
        variables: { input },
      });

      const mutationResult = getEnrichedStopPlace(
        result.data?.stop_registry?.mutateStopPlace?.at(0),
      );

      if (!mutationResult) {
        throw new Error(
          'Failed to create copy of stop area. No data returned.',
        );
      }

      const stopPointInsert = filterAndMapScheduledStopPoints({
        stopArea,
        state,
        mutationResult,
      });

      const stopPointIds = await insertStopPoint(stopPointInsert);

      return { mutationResult, stopPointIds };
    },
    [insertStopPoint, upsertStopAreaMutation],
  );
}

export function useCopyStopArea() {
  const cutStopAreaValidity = useCutStopAreaValidity();
  const insertStopAreaCopy = useInsertStopAreaCopy();

  // TODO: Keskitä johonkin kaikkien quays osalta validity laskenta

  return useCallback(
    async ({
      stopArea,
      state,
    }: CopyStopAreaInputs): Promise<CopyStopAreaResult> => {
      const cutResponse = await cutStopAreaValidity(
        stopArea,
        state.validityStart,
        state.validityEnd,
        state.versionName,
      );

      console.log('Cut response:', cutResponse);

      /*
      const insertResponse = await insertStopAreaCopy({ stopArea, state });
      console.log('Insert response:', insertResponse);

      return insertResponse;
      */

      return {
        mutationResult: cutResponse.mutatedStopArea,
        stopPointIds: cutResponse.mutatedStopPoints,
      };
    },
    [cutStopAreaValidity],
  );
}
