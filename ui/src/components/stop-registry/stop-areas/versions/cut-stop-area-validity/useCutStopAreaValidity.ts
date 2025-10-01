import compact from 'lodash/compact';
import { useCallback } from 'react';
import {
  GetStopPlaceDetailsDocument,
  useEditMultipleStopPointsMutation,
  useUpsertStopAreaMutation,
} from '../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../types';
import { getEnrichedStopPlace } from '../../stop-area-details/useGetStopAreaDetails';
import { CutDirection, CutStopAreaValidityResult } from './types';
import {
  getScheduledStopPointIdsToEdit,
  mapToEditStopAreaInput,
} from './utils';

function useUpdateStopPoints() {
  const [editStopPointsMutation] = useEditMultipleStopPointsMutation();

  return useCallback(
    async (
      stopArea: EnrichedStopPlace,
      cutDirection: CutDirection,
      validityStart: string,
      validityEnd: string | null,
    ) => {
      const { startDateUpdates, endDateUpdates } =
        getScheduledStopPointIdsToEdit(
          stopArea,
          cutDirection,
          validityStart,
          validityEnd,
        );

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

function useUpdateStopArea() {
  const [upsertStopAreaMutation] = useUpsertStopAreaMutation();

  return useCallback(
    async (
      stopArea: EnrichedStopPlace,
      cutDirection: CutDirection,
      validityStart: string,
      validityEnd: string | null,
      versionName: string,
      doRefetch: boolean = false,
    ): Promise<EnrichedStopPlace> => {
      const input = mapToEditStopAreaInput(
        stopArea,
        cutDirection,
        validityStart,
        validityEnd,
        versionName,
      );

      if (!input) {
        return stopArea;
      }

      const result = await upsertStopAreaMutation({
        variables: { input },
        refetchQueries: doRefetch ? [GetStopPlaceDetailsDocument] : [],
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

/**
 * This hook returns a function that cuts the validity of a stop area,
 * and the quays and stop points under it to the given dates. It does
 * not extend the validity if the given period is longer than the current one.
 *
 * Note that the dates are not validated here, so the caller must ensure
 * that the given dates are valid.
 */
export function useCutStopAreaValidity() {
  const updateStopArea = useUpdateStopArea();
  const updateStopPoints = useUpdateStopPoints();

  return useCallback(
    async (
      stopArea: EnrichedStopPlace,
      cutDirection: CutDirection,
      validityStart: string,
      validityEnd: string | null,
      versionName: string,
      refetchArea: boolean = false,
    ): Promise<CutStopAreaValidityResult> => {
      const mutatedStopPoints = await updateStopPoints(
        stopArea,
        cutDirection,
        validityStart,
        validityEnd,
      );

      const mutatedStopArea = await updateStopArea(
        stopArea,
        cutDirection,
        validityStart,
        validityEnd,
        versionName,
        refetchArea,
      );

      return { mutatedStopArea, mutatedStopPoints };
    },
    [updateStopArea, updateStopPoints],
  );
}
