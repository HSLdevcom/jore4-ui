import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  GetStopPlaceDetailsDocument,
  useEditMultipleStopPointsMutation,
  useUpsertStopAreaMutation,
} from '../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../types';
import { getEnrichedStopPlace } from '../../stop-area-details/useGetStopAreaDetails';
import {
  getScheduledStopPointIdsToEdit,
  mapToEditStopAreaInput,
} from './CutStopAreaValidityUtils';

function useUpdateStopArea() {
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation();

  return useCallback(
    async (
      stopArea: EnrichedStopPlace,
      validityStart: string,
      validityEnd?: string,
      versionName?: string,
    ): Promise<EnrichedStopPlace> => {
      const input = mapToEditStopAreaInput(
        stopArea,
        validityStart,
        validityEnd,
        versionName,
      );

      if (!input) {
        return stopArea;
      }

      // TODO: Check issue with keyvalues cache thing
      const result = await upsertStopAreaMutation({
        variables: { input },
        refetchQueries: [GetStopPlaceDetailsDocument],
        awaitRefetchQueries: true,
      });

      const mutatedStopArea = getEnrichedStopPlace(
        result.data?.stop_registry?.mutateStopPlace?.at(0),
      );

      if (!mutatedStopArea) {
        throw new Error('Failed to edit the stop area. No data returned.');
      }

      return mutatedStopArea;
    },
    [upsertStopAreaMutation],
  );
}

function useUpdateStopPoints() {
  const [editStopPointsMutation] = useEditMultipleStopPointsMutation();

  return useCallback(
    async (
      stopArea: EnrichedStopPlace,
      validityStart: string,
      validityEnd?: string,
    ) => {
      const { startDateUpdates, endDateUpdates } =
        getScheduledStopPointIdsToEdit(stopArea, validityStart, validityEnd);

      const updates = compact([startDateUpdates, endDateUpdates]);
      if (updates.length === 0) {
        return [];
      }

      const result = await editStopPointsMutation({
        variables: { updates },
      });

      const updatedIds = (result.data?.stopPoints ?? []).flatMap((sps) =>
        compact(sps?.returning.map((sp) => sp.scheduled_stop_point_id)),
      );

      return updatedIds;
    },
    [editStopPointsMutation],
  );
}

export function useCutStopAreaValidity() {
  const updateStopArea = useUpdateStopArea();
  const updateStopPoints = useUpdateStopPoints();

  return useCallback(
    async (
      stopArea: EnrichedStopPlace,
      validityStart: string,
      validityEnd?: string,
      versionName?: string,
    ) => {
      const mutatedStopPoints = await updateStopPoints(
        stopArea,
        validityStart,
        validityEnd,
      );

      const mutatedStopArea = await updateStopArea(
        stopArea,
        validityStart,
        validityEnd,
        versionName,
      );

      return { mutatedStopArea, mutatedStopPoints };
    },
    [updateStopArea, updateStopPoints],
  );
}
