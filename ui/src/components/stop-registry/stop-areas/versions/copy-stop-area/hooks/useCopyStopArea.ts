import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  GetStopPlaceDetailsDocument,
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
import {
  CopyStopAreaResult,
  CopyStopAreaSuccessResult,
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
import { useAssertForCopyStopArea } from './useAssertForCopyStopArea';

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
        refetchQueries: [GetStopPlaceDetailsDocument],
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
  const {
    assertNoOverlappingVersions,
    assertRouteStaysValidAfterStopPointChanges,
  } = useAssertForCopyStopArea();
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

      const { cutStart, cutEnd, cutDirection, requiresConfirmation } =
        determineCutDatesForCurrentStopArea(stopArea, state);

      // This will throw error if the validity changes would affect
      // some route connected to one of the stops in the area
      await assertRouteStaysValidAfterStopPointChanges(
        stopArea,
        cutStart,
        cutEnd,
        state.validityStart,
        state.validityEnd ?? null,
      );

      if (requiresConfirmation && !cutConfirmed) {
        // Show confirmation modal to user
        return {
          showCutConfirmationModal: true,
          currentVersionCutDirection: cutDirection,
        };
      }

      const { mutatedStopArea, mutatedStopPoints } = await cutStopAreaValidity(
        stopArea,
        cutDirection,
        cutStart,
        cutEnd,
        state.reasonForChange,
        false,
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
      assertNoOverlappingVersions,
      assertRouteStaysValidAfterStopPointChanges,
      cutStopAreaValidity,
      insertStopAreaCopy,
    ],
  );
}
