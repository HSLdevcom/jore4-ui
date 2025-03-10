import { useCallback } from 'react';
import {
  StopRegistryInfoSpotInput,
  StopRegistryStopPlaceInput,
  useInsertStopMutation,
  useInsertStopPlaceMutation,
  useUpdateInfoSpotMutation,
} from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';
import { StopWithDetails } from '../../../../../../types';
import { notNullish } from '../../../../../../utils';
import {
  FailedToResolveExistingQuays,
  FailedToResolveNewShelters,
  StopPlaceInsertFailed,
  StopPlaceRevertFailed,
} from '../errors';
import {
  CreateStopVersionResult,
  InfoSpotInputHelper,
  StopVersionFormState,
} from '../types';
import { StopRegistryQuayCopyInput } from '../types/StopRegistryQuayCopyInput';
import { mapCreateCopyFormStateToInputs } from './mapCreateCopyFormStateToInputs';
import { useGetShelterResolver } from './useGetShelterResolver';
import {
  ExistingQuayInput,
  useResolveExistingQuays,
} from './useResolveExistingQuays';
import { wrapErrors } from './wrapErrors';

function getStopPlaceId(originalStop: StopWithDetails): string {
  const id = originalStop.stop_place?.id;

  if (!id) {
    throw new Error(
      "StopPlace or it's Netex ID missing from the stop that is being copied!",
    );
  }

  return id;
}

type StopPlaceUpdateData = {
  readonly existingQuays: ReadonlyArray<ExistingQuayInput>;
  readonly stopPlaceInput: StopRegistryStopPlaceInput;
};

function useGetStopPlaceUpdateInput() {
  const resolveExistingQuays = useResolveExistingQuays();

  return useCallback(
    async (
      originalStop: StopWithDetails,
      quayCopy: StopRegistryQuayCopyInput,
    ): Promise<StopPlaceUpdateData> => {
      const existingQuays = await wrapErrors(
        resolveExistingQuays(getStopPlaceId(originalStop)),
        FailedToResolveExistingQuays,
        'Failed to resolve existing quays!',
      );

      return {
        existingQuays,
        stopPlaceInput: {
          id: getStopPlaceId(originalStop),
          quays: [...existingQuays, quayCopy],
        },
      };
    },
    [resolveExistingQuays],
  );
}

type InsertStopPlaceResult = {
  readonly stopPlaceId: string;
  readonly quayId: string;
  readonly existingQuays: ReadonlyArray<ExistingQuayInput>;
};

function useInsertStopPlace() {
  const getStopPlaceUpdateInput = useGetStopPlaceUpdateInput();
  const [insertStopPlaceMutation] = useInsertStopPlaceMutation();

  return useCallback(
    async (
      originalStop: StopWithDetails,
      quayCopy: StopRegistryQuayCopyInput,
    ): Promise<InsertStopPlaceResult> => {
      const { existingQuays, stopPlaceInput } = await getStopPlaceUpdateInput(
        originalStop,
        quayCopy,
      );

      const response = await wrapErrors(
        insertStopPlaceMutation({ variables: { object: stopPlaceInput } }),
        StopPlaceInsertFailed,
        'Failed to insert new StopPlace!',
      );

      const stopPlaceId =
        response.data?.stop_registry?.mutateStopPlace?.at(0)?.id;

      const quayId = response.data?.stop_registry?.mutateStopPlace
        ?.at(0)
        ?.quays?.filter(notNullish)
        ?.find(
          (quay) =>
            !existingQuays.some((existingQuay) => existingQuay.id === quay.id),
        )?.id;

      if (!stopPlaceId) {
        throw new StopPlaceInsertFailed(
          `StopPlace insert seems to have failed. No ID returned. Response: ${JSON.stringify(response, null, 0)}`,
        );
      }

      if (!quayId) {
        throw new StopPlaceInsertFailed(
          `StopPlace insert seems to have failed. Could not find new Quay ID. Response: ${JSON.stringify(response, null, 0)} | ExistingQuays: ${JSON.stringify(existingQuays, null, 0)}`,
        );
      }

      return { stopPlaceId, quayId, existingQuays };
    },
    [getStopPlaceUpdateInput, insertStopPlaceMutation],
  );
}

function useRevertStopPlaceInsert() {
  const [insertStopPlaceMutation] = useInsertStopPlaceMutation();

  return useCallback(
    async (
      stopPlaceId: string,
      previousQuays: ReadonlyArray<ExistingQuayInput>,
      cause: unknown,
    ): Promise<true> => {
      try {
        await insertStopPlaceMutation({
          variables: {
            object: {
              id: stopPlaceId,
              quays: [...previousQuays],
            },
          },
        });

        return true;
      } catch (stopPlaceReverFailedCause) {
        throw new StopPlaceRevertFailed(
          [cause, stopPlaceReverFailedCause],
          'Failed to reverse StopPlace insertion after failed attempt at creating a StopPoint for it!',
        );
      }
    },
    [insertStopPlaceMutation],
  );
}

function useInsertStopPoint() {
  const [insertStopMutation] = useInsertStopMutation();
  const revertStopPlaceInsert = useRevertStopPlaceInsert();

  return useCallback(
    async (
      stopPointInput: ScheduledStopPointSetInput,
      stopPlaceId: string,
      quayId: string,
      previousQuays: ReadonlyArray<ExistingQuayInput>,
    ): Promise<UUID> => {
      try {
        const response = await wrapErrors(
          insertStopMutation({
            variables: {
              object: { ...stopPointInput, stop_place_ref: quayId },
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
        await revertStopPlaceInsert(
          stopPlaceId,
          previousQuays,
          stopPointInsertFailedCause,
        );
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
      quayId: string,
    ): Promise<boolean> => {
      if (infoSpots === null) {
        return false;
      }

      const shelterResolver = await getShelterResolver(quayId);
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
            infoSpotLocations: [quayId, shelterId],
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
      const { quayInput, stopPointInput, infoSpotInputs } =
        mapCreateCopyFormStateToInputs(state, originalStop);

      const { stopPlaceId, quayId, existingQuays } = await insertStopPlace(
        originalStop,
        quayInput,
      );
      const stopPointId = await insertStopPoint(
        stopPointInput,
        stopPlaceId,
        quayId,
        existingQuays,
      );
      await insertInfoSpots(infoSpotInputs, quayId);

      return { stopPlaceId, quayId, stopPointId, stopPointInput };
    },
    [insertStopPlace, insertStopPoint, insertInfoSpots],
  );
}
