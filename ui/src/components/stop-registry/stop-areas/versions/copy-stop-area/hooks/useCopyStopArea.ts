import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  StopRegistryInfoSpotInput,
  useInsertMultipleStopPointsMutation,
  useUpdateInfoSpotMutation,
  useUpsertStopAreaMutation,
} from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';
import { EnrichedStopPlace } from '../../../../../../types';
import {
  FailedToResolveNewShelters,
  StopPlaceInsertFailed,
} from '../../../../stops/stop-details/stop-version/errors';
import { useGetShelters } from '../../../../stops/stop-details/stop-version/utils/useGetShelterResolver';
import { wrapErrors } from '../../../../stops/stop-details/stop-version/utils/wrapErrors';
import { getEnrichedStopPlace } from '../../../stop-area-details/useGetStopAreaDetails';
import { useCutStopAreaValidity } from '../../cut-stop-area-validity';
import { useGetStopAreaVersionsLazy } from '../../queries/useGetStopAreaVersions';
import {
  CopyStopAreaResult,
  CopyStopAreaSuccessResult,
  OverlappingMultipleStopAreaVersions,
  StopAreaInsertFailed,
  StopAreaVersionFormState,
  StopPlacesInsertFailed,
} from '../../types';
import { CopyStopAreaInputs, InfoSpotInput } from '../types';
import {
  createBidirectionalQuayMapping,
  determineCutDatesForCurrentStopArea,
  filterAndMapScheduledStopPoints,
  mapToInfoSpotInput,
  mapToStopAreaCopyInput,
} from '../utils';

function useCheckForMultipleOverlappingVersions() {
  const getStopAreaVersions = useGetStopAreaVersionsLazy();

  return useCallback(
    async (
      privateCode: string,
      currentVersionNetexId: string,
      validityStart: string,
      validityEnd?: string,
    ) => {
      const stopAreaVersions = await getStopAreaVersions(privateCode);

      const mappedVersions = stopAreaVersions.stopAreaVersions.map(
        (version) => ({
          netexId: version.netex_id,
          validityStart: version.validity_start,
          validityEnd: version.validity_end,
        }),
      );

      const currentVersionRemoved = mappedVersions.filter(
        (v) => v.netexId !== currentVersionNetexId,
      );

      const currentStart = DateTime.fromISO(validityStart);
      const currentEnd = validityEnd ? DateTime.fromISO(validityEnd) : null;

      // Check if any of the remaining versions overlap with the new validity
      const overlap = currentVersionRemoved.some((version) => {
        const versionStart = DateTime.fromISO(String(version.validityStart));
        const versionEnd = version.validityEnd
          ? DateTime.fromISO(String(version.validityEnd))
          : null;

        // If both are open-ended, always overlap
        if (!currentEnd && !versionEnd) {
          return true;
        }

        // If currentEnd is null (open-ended), overlap if versionEnd is null or versionEnd >= currentStart
        if (!currentEnd) {
          return !versionEnd || versionEnd >= currentStart;
        }

        // If versionEnd is null (open-ended), overlap if currentEnd >= versionStart
        if (!versionEnd) {
          return currentEnd >= versionStart;
        }

        // Both have end dates, overlap if periods intersect
        return currentStart <= versionEnd && versionStart <= currentEnd;
      });

      if (overlap) {
        throw new OverlappingMultipleStopAreaVersions(
          'Stop area versions overlap',
        );
      }
    },
    [getStopAreaVersions],
  );
}

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
    async (inputs: ReadonlyArray<InfoSpotInput>): Promise<void> => {
      const promises = inputs.flatMap(async ({ quayId, infoSpots }) => {
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

        return withLocations;
      });

      const resolvedInputs = await Promise.all(promises);
      const formattedInputs = compact(resolvedInputs.flat());

      if (formattedInputs.length === 0) {
        return;
      }

      await updateInfoSpotMutation({ variables: { input: formattedInputs } });
    },
    [getShelters, updateInfoSpotMutation],
  );
}

function useInsertStopAreaCopy() {
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation();
  const insertStopPoint = useInsertStopPoints();
  const insertInfoSpots = useInsertInfoSpots();

  return useCallback(
    async (
      stopArea: EnrichedStopPlace,
      state: StopAreaVersionFormState,
      mutatedStopArea: EnrichedStopPlace,
      mutatedStopPoints: ReadonlyArray<UUID>,
    ): Promise<CopyStopAreaSuccessResult> => {
      const input = mapToStopAreaCopyInput(stopArea, state);

      const result = await upsertStopAreaMutation({
        variables: { input },
      });
      const mutationResult = getEnrichedStopPlace(
        result.data?.stop_registry?.mutateStopPlace?.at(0),
      );

      if (!mutationResult) {
        throw new StopAreaInsertFailed(
          'Failed to create copy of stop area. No data returned.',
        );
      }

      const mapping = createBidirectionalQuayMapping(
        compact(mutatedStopArea.quays ?? []),
        compact(mutationResult.quays ?? []),
      );

      const stopPointInsert = filterAndMapScheduledStopPoints(
        stopArea,
        mutatedStopPoints,
        mapping,
      );
      const stopPointIds = await insertStopPoint(stopPointInsert);

      const infoSpotInputs = mapToInfoSpotInput(stopArea, mapping);
      await insertInfoSpots(infoSpotInputs);

      return { mutationResult, stopPointIds };
    },
    [insertInfoSpots, insertStopPoint, upsertStopAreaMutation],
  );
}

export function useCopyStopArea() {
  const checkForMultipleOverlappingVersions =
    useCheckForMultipleOverlappingVersions();
  const cutStopAreaValidity = useCutStopAreaValidity();
  const insertStopAreaCopy = useInsertStopAreaCopy();

  return useCallback(
    async ({
      stopArea,
      state,
      cutConfirmed,
    }: CopyStopAreaInputs): Promise<CopyStopAreaResult> => {
      // This will throw error if overlapping versions are found
      await checkForMultipleOverlappingVersions(
        stopArea.privateCode?.value ?? '',
        stopArea.id ?? '',
        state.validityStart,
        state.validityEnd,
      );

      const cutResult = determineCutDatesForCurrentStopArea(
        stopArea,
        state,
        cutConfirmed,
      );

      if ('cutFromEnd' in cutResult) {
        // Show confirmation modal to user
        return {
          cutCurrentVersionEnd: cutResult.cutFromEnd,
        };
      }

      const { cutStart, cutEnd } = cutResult;
      const { mutatedStopArea, mutatedStopPoints } = await cutStopAreaValidity(
        stopArea,
        cutStart,
        cutEnd,
        state.versionName,
      );

      const insertResponse = await insertStopAreaCopy(
        stopArea,
        state,
        mutatedStopArea,
        mutatedStopPoints,
      );

      return insertResponse;
    },
    [
      checkForMultipleOverlappingVersions,
      cutStopAreaValidity,
      insertStopAreaCopy,
    ],
  );
}
