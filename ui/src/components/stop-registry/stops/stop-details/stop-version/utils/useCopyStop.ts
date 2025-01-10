import { useCallback } from 'react';
import {
  StopRegistryInfoSpotInput,
  StopRegistryStopPlaceInput,
  useInsertStopMutation,
  useInsertStopPlaceMutation,
  useUpdateInfoSpotMutation,
} from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';
import { StopWithDetails } from '../../../../../../hooks';
import {
  FailedToResolveNewShelters,
  StopPlaceInsertFailed,
  StopPlaceRevertFailed,
} from '../errors';
import {
  CreateStopVersionResult,
  InfoSpotInputHelper,
  StopVersionFormState,
} from '../types';
import { mapCreateCopyFormStateToInputs } from './mapCreateCopyFormStateToInputs';
import { useDeleteStopPlace } from './useDeleteStopPlace';
import { useGetShelterResolver } from './useGetShelterResolver';
import { wrapErrors } from './wrapErrors';

function useInsertStopPlace() {
  const [insertStopPlaceMutation] = useInsertStopPlaceMutation();

  return useCallback(
    async (stopPlaceInput: StopRegistryStopPlaceInput): Promise<string> => {
      const response = await wrapErrors(
        insertStopPlaceMutation({ variables: { object: stopPlaceInput } }),
        StopPlaceInsertFailed,
        'Failed to insert new StopPlace!',
      );

      const id = response.data?.stop_registry?.mutateStopPlace?.at(0)?.id;

      if (!id) {
        throw new StopPlaceInsertFailed(
          `StopPlace insert seems to have failed. No ID returned. Response: ${JSON.stringify(response, null, 0)}`,
        );
      }

      return id;
    },
    [insertStopPlaceMutation],
  );
}

function useRevertStopPlaceInsert() {
  const deleteStopPlace = useDeleteStopPlace();

  return useCallback(
    async (stopPlaceId: string, cause: unknown): Promise<true> => {
      try {
        const deleted = await deleteStopPlace(stopPlaceId);

        if (!deleted) {
          throw new Error(
            'Expected Tiamat to return true on delete, but response was false!',
          );
        }

        return true;
      } catch (stopPlaceReverFailedCause) {
        throw new StopPlaceRevertFailed(
          [cause, stopPlaceReverFailedCause],
          'Failed to reverse StopPlace insertion after failed attempt at creating a StopPoint for it!',
        );
      }
    },
    [deleteStopPlace],
  );
}

function useInsertStopPoint() {
  const [insertStopMutation] = useInsertStopMutation();
  const revertStopPlaceInsert = useRevertStopPlaceInsert();

  return useCallback(
    async (
      stopPointInput: ScheduledStopPointSetInput,
      stopPlaceId: string,
    ): Promise<UUID> => {
      try {
        const response = await wrapErrors(
          insertStopMutation({
            variables: {
              object: { ...stopPointInput, stop_place_ref: stopPlaceId },
            },
          }),
          StopPlaceInsertFailed,
          'Failed to insert new StopPoint!',
        );

        const stopPointId =
          response.data?.insert_service_pattern_scheduled_stop_point_one
            ?.scheduled_stop_point_id;

        if (!stopPointId) {
          throw new StopPlaceInsertFailed(
            `StopPoint insert seems to have failed. No ID returned. Response: ${JSON.stringify(response, null, 0)}`,
          );
        }

        return stopPointId;
      } catch (stopPointInsertFailedCause) {
        await revertStopPlaceInsert(stopPlaceId, stopPointInsertFailedCause);
        throw stopPointInsertFailedCause;
      }
    },
    [insertStopMutation, revertStopPlaceInsert],
  );
}

function useInsertInfoSpots() {
  const [updateInfoSpotMutation] = useUpdateInfoSpotMutation();
  const getShelterResolver = useGetShelterResolver();

  return useCallback(
    async (
      infoSpots: ReadonlyArray<InfoSpotInputHelper> | null,
      stopPlaceId: string,
    ): Promise<boolean> => {
      if (infoSpots === null) {
        return false;
      }

      const shelterResolver = await getShelterResolver(stopPlaceId);
      const resolveByIndex = shelterResolver.shouldResolveByIndex();

      const withLocations = infoSpots.map(
        (input): StopRegistryInfoSpotInput => {
          const { originalShelter, originalShelterIndex, infoSpotInput } =
            input;

          const shelterId = resolveByIndex
            ? shelterResolver.getIdForIndex(originalShelterIndex)
            : shelterResolver.getIdForShelter(originalShelter);

          if (!shelterId) {
            throw new FailedToResolveNewShelters(
              `Failed to resolve new shelter ID for: ${JSON.stringify(input)}`,
            );
          }

          return {
            ...infoSpotInput,
            infoSpotLocations: [stopPlaceId, shelterId],
          };
        },
      );

      await updateInfoSpotMutation({ variables: { input: withLocations } });

      return true;
    },
    [getShelterResolver, updateInfoSpotMutation],
  );
}

export function useCopyStop() {
  const insertStopPlace = useInsertStopPlace();
  const insertStopPoint = useInsertStopPoint();
  const insertInfoSpots = useInsertInfoSpots();

  return useCallback(
    async (
      state: StopVersionFormState,
      originalStop: StopWithDetails,
    ): Promise<CreateStopVersionResult> => {
      const { stopPlaceInput, stopPointInput, infoSpotInputs } =
        mapCreateCopyFormStateToInputs(state, originalStop);

      const stopPlaceId = await insertStopPlace(stopPlaceInput);
      const stopPointId = await insertStopPoint(stopPointInput, stopPlaceId);
      await insertInfoSpots(infoSpotInputs, stopPlaceId);

      return { stopPlaceId, stopPlaceInput, stopPointId, stopPointInput };
    },
    [insertStopPlace, insertStopPoint, insertInfoSpots],
  );
}
