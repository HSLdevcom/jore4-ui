import { useTranslation } from 'react-i18next';
import {
  useGetOriginalQuaysLazyQuery,
  useGetStopPointsByQuayIdLazyQuery,
  useInsertStopPointMutation,
  useMoveQuayToStopPlaceMutation,
  useUpdateStopPointMutation,
} from '../../../../generated/graphql';
import { showDangerToastWithError } from '../../../../utils';
import {
  createAndInsertStopPoint,
  createQuayMapping,
  executeQuayMove,
  extractStopPlaceQuays,
  fetchExistingStopPoints,
  getPreviousDay,
  isSameDate,
  updateStopPointValidity,
} from './utils/helpers';
import { MoveQuayParams, QuayInfo } from './utils/types';

export const useMoveQuayToStopPlace = () => {
  const { t } = useTranslation();
  const [moveQuayMutation, { loading: moveLoading, error: moveError, reset }] =
    useMoveQuayToStopPlaceMutation();
  const [getStopPointsByQuayId] = useGetStopPointsByQuayIdLazyQuery();
  const [insertStopPointMutation] = useInsertStopPointMutation();
  const [updateStopPointMutation] = useUpdateStopPointMutation();
  const [getOriginalQuays] = useGetOriginalQuaysLazyQuery();

  const fetchOriginalQuays = async (quayIds: string[]): Promise<QuayInfo[]> => {
    const originalQuaysResult = await getOriginalQuays({
      variables: { quayId: quayIds[0] },
    });

    const stopPlace = originalQuaysResult.data?.stop_registry?.stopPlace?.[0];
    const allQuaysInOriginalStop = extractStopPlaceQuays(stopPlace);

    return allQuaysInOriginalStop.filter((quay) =>
      quayIds.includes(quay?.id ?? ''),
    );
  };

  const moveQuayToStopPlace = async (params: MoveQuayParams) => {
    const [originalQuays, existingStopPoints] = await Promise.all([
      fetchOriginalQuays(params.quayIds),
      fetchExistingStopPoints(params.quayIds, getStopPointsByQuayId),
    ]);

    const stopPointNeedingUpdate = existingStopPoints.find((stopPoint) => {
      const isMovingFromValidityStart =
        stopPoint.validity_start &&
        isSameDate(stopPoint.validity_start, params.moveQuayFromDate);
      return !isMovingFromValidityStart;
    });

    if (stopPointNeedingUpdate) {
      const validityEndDate = getPreviousDay(params.moveQuayFromDate);
      await updateStopPointValidity(
        stopPointNeedingUpdate.scheduled_stop_point_id,
        validityEndDate,
        updateStopPointMutation,
      );

      const movedStopPlace = await executeQuayMove(params, moveQuayMutation);

      const newQuays = extractStopPlaceQuays(movedStopPlace);
      const quayMapping = createQuayMapping(originalQuays, newQuays);

      const originalQuayId = stopPointNeedingUpdate.stop_place_ref;
      if (!originalQuayId) {
        throw new Error('Original quay ID is required');
      }

      const newQuayId = quayMapping.get(originalQuayId);
      if (!newQuayId) {
        throw new Error(`No mapping found for quay ID: ${originalQuayId}`);
      }
      await createAndInsertStopPoint(
        stopPointNeedingUpdate,
        newQuayId,
        params.moveQuayFromDate,
        insertStopPointMutation,
      );

      return { data: { stop_registry: { moveQuaysToStop: movedStopPlace } } };
    }
    // Moving from validity start, no stop point updates needed
    const movedStopPlace = await executeQuayMove(params, moveQuayMutation);
    return { data: { stop_registry: { moveQuaysToStop: movedStopPlace } } };
  };

  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    moveQuayToStopPlace,
    loading: moveLoading,
    error: moveError,
    defaultErrorHandler,
    reset,
  };
};
