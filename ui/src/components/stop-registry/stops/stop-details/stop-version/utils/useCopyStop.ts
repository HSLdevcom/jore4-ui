import { useCallback } from 'react';
import {
  StopRegistryInfoSpotInput,
  useInsertQuayIntoStopPlaceMutation,
  useInsertStopPointMutation,
  useUpdateInfoSpotMutation,
} from '../../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../../graphql';
import { findKeyValue } from '../../../../../../utils';
import { useDeleteQuay } from '../../../queries/useDeleteQuay';
import {
  FailedToResolveNewShelters,
  StopPlaceInsertFailed,
  StopPlaceRevertFailed,
} from '../errors';
import { CreateStopVersionResult, InfoSpotInputHelper } from '../types';
import { StopRegistryQuayCopyInput } from '../types/StopRegistryQuayCopyInput';
import { useGetShelters } from './useGetShelterResolver';
import { wrapErrors } from './wrapErrors';

type InsertStopPlaceResult = {
  readonly stopPlaceId: string;
  readonly quayId: string;
};

function useInsertStopPlace() {
  const [insertQuayIntoStopPlace] = useInsertQuayIntoStopPlaceMutation({
    refetchQueries: ['GetStopDetails', 'GetMapStops'],
    awaitRefetchQueries: true,
  });

  return useCallback(
    async (
      originalStopPlaceId: string,
      quayCopy: StopRegistryQuayCopyInput,
    ): Promise<InsertStopPlaceResult> => {
      const response = await wrapErrors(
        insertQuayIntoStopPlace({
          variables: {
            stopPlaceId: originalStopPlaceId,
            quayInput: quayCopy,
          },
        }),
        StopPlaceInsertFailed,
        'Failed to insert new StopPlace!',
      );

      const stopPlaceId =
        response.data?.stop_registry?.mutateStopPlace?.at(0)?.id;

      const copyImportedId = findKeyValue(quayCopy, 'imported-id');
      const quayId = response.data?.stop_registry?.mutateStopPlace
        ?.at(0)
        ?.quays?.find(
          (quay) =>
            quay && findKeyValue(quay, 'imported-id') === copyImportedId,
        )?.id;

      if (!stopPlaceId) {
        throw new StopPlaceInsertFailed(
          `StopPlace insert seems to have failed. No ID returned. Response: ${JSON.stringify(response, null, 0)}`,
        );
      }

      if (!quayId) {
        throw new StopPlaceInsertFailed(
          `StopPlace insert seems to have failed. Could not find new Quay ID. Response: ${JSON.stringify(response, null, 0)}`,
        );
      }

      return { stopPlaceId, quayId };
    },
    [insertQuayIntoStopPlace],
  );
}

function useRevertStopPlaceInsert() {
  const deleteQuay = useDeleteQuay();

  return useCallback(
    async (
      stopPlaceId: string,
      quayId: string,
      cause: unknown,
    ): Promise<true> => {
      try {
        await deleteQuay(stopPlaceId, quayId);
        return true;
      } catch (stopPlaceReverFailedCause) {
        throw new StopPlaceRevertFailed(
          [cause, stopPlaceReverFailedCause],
          'Failed to reverse StopPlace insertion after failed attempt at creating a StopPoint for it!',
        );
      }
    },
    [deleteQuay],
  );
}

function useInsertStopPoint() {
  const [insertStopMutation] = useInsertStopPointMutation({
    refetchQueries: ['GetStopDetails', 'GetMapStops'],
    awaitRefetchQueries: true,
  });
  const revertStopPlaceInsert = useRevertStopPlaceInsert();

  return useCallback(
    async (
      stopPointInput: ScheduledStopPointSetInput,
      stopPlaceId: string,
      quayId: string,
    ): Promise<UUID> => {
      try {
        const response = await wrapErrors(
          insertStopMutation({
            variables: {
              stopPoint: { ...stopPointInput, stop_place_ref: quayId },
            },
          }),
          StopPlaceInsertFailed,
          'Failed to insert new StopPoint!',
        );

        const stopPointId = response.data?.stopPoint?.scheduled_stop_point_id;

        if (!stopPointId) {
          throw new StopPlaceInsertFailed(
            `StopPoint insert seems to have failed. No ID returned. Response: ${JSON.stringify(response, null, 0)}`,
          );
        }

        return stopPointId;
      } catch (stopPointInsertFailedCause) {
        await revertStopPlaceInsert(
          stopPlaceId,
          quayId,
          stopPointInsertFailedCause,
        );
        throw stopPointInsertFailedCause;
      }
    },
    [insertStopMutation, revertStopPlaceInsert],
  );
}

function useInsertInfoSpots() {
  const [updateInfoSpotMutation] = useUpdateInfoSpotMutation({
    refetchQueries: ['GetStopDetails', 'GetMapStops'],
    awaitRefetchQueries: true,
  });
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

export type CopyStopInputs = {
  readonly originalStopPlaceId: string;
  readonly quayInput: StopRegistryQuayCopyInput;
  readonly stopPointInput: ScheduledStopPointSetInput;
  readonly infoSpotInputs: ReadonlyArray<InfoSpotInputHelper> | null;
};

export function useCopyStop() {
  const insertStopPlace = useInsertStopPlace();
  const insertStopPoint = useInsertStopPoint();
  const insertInfoSpots = useInsertInfoSpots();

  return useCallback(
    async ({
      originalStopPlaceId,
      quayInput,
      stopPointInput,
      infoSpotInputs,
    }: CopyStopInputs): Promise<CreateStopVersionResult> => {
      const { stopPlaceId, quayId } = await insertStopPlace(
        originalStopPlaceId,
        quayInput,
      );
      const stopPointId = await insertStopPoint(
        stopPointInput,
        stopPlaceId,
        quayId,
      );
      await insertInfoSpots(infoSpotInputs, quayId);

      return { stopPlaceId, quayId, stopPointId, stopPointInput };
    },
    [insertStopPlace, insertStopPoint, insertInfoSpots],
  );
}
