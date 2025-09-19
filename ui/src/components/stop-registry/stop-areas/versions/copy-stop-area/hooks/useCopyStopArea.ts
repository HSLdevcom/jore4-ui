import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  StopRegistryInfoSpotInput,
  useInsertMultipleStopPointsMutation,
  useUpdateInfoSpotMutation,
  useUpsertStopAreaMutation,
} from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';
import { parseDate } from '../../../../../../time';
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

function useAssertNoOverlappingVersions() {
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

      const currentStart = parseDate(validityStart).toMillis();
      const currentEnd =
        parseDate(validityEnd)?.toMillis() ?? Number.POSITIVE_INFINITY;

      const overlap = currentVersionRemoved.some((version) => {
        const versionStart = version.validityStart.toMillis();
        const versionEnd =
          version.validityEnd?.toMillis() ?? Number.POSITIVE_INFINITY;

        //    If the new one ends before the current one has even started → No overlap
        // or If the new one starts after the current one has ended → No overlap
        if (versionEnd < currentStart || versionStart > currentEnd) {
          return false;
        }

        // Else there is at least one day of overlap.
        return true;
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
      const promises = inputs.map(async ({ quayId, infoSpots }) => {
        const shelters = await getShelters(quayId);

        return infoSpots.map((input): StopRegistryInfoSpotInput => {
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
        });
      });

      const resolvedInputs = await Promise.all(promises);
      const formattedInputs = resolvedInputs.flat();

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
        compact(mutatedStopArea.quays),
        compact(mutationResult.quays),
      );

      const stopPointInputs = filterAndMapScheduledStopPoints(
        stopArea,
        mutatedStopPoints,
        mapping,
      );
      const infoSpotInputs = mapToInfoSpotInput(stopArea, mapping);

      const stopPointPromise = insertStopPoint(stopPointInputs);
      const infoSpotPromise = insertInfoSpots(infoSpotInputs);

      const [stopPointIds] = await Promise.all([
        stopPointPromise,
        infoSpotPromise,
      ]);

      return { mutationResult, stopPointIds };
    },
    [insertInfoSpots, insertStopPoint, upsertStopAreaMutation],
  );
}

export function useCopyStopArea() {
  const assertNoOverlappingVersions = useAssertNoOverlappingVersions();
  const cutStopAreaValidity = useCutStopAreaValidity();
  const insertStopAreaCopy = useInsertStopAreaCopy();

  return useCallback(
    async ({
      stopArea,
      state,
      cutConfirmed,
    }: CopyStopAreaInputs): Promise<CopyStopAreaResult> => {
      // This will throw error if overlapping versions are found
      await assertNoOverlappingVersions(
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

      if (cutResult.showCutConfirmationModal) {
        // Show confirmation modal to user
        return {
          showCutConfirmationModal: true,
          currentVersionCutDirection: cutResult.cutDirection,
        };
      }

      const { cutStart, cutEnd, cutDirection } = cutResult;
      const { mutatedStopArea, mutatedStopPoints } = await cutStopAreaValidity(
        stopArea,
        cutDirection,
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
    [assertNoOverlappingVersions, cutStopAreaValidity, insertStopAreaCopy],
  );
}
