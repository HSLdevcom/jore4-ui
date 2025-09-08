import { useTranslation } from 'react-i18next';
import {
  useGetOriginalQuaysLazyQuery,
  useGetStopPointsByQuayIdLazyQuery,
  useInsertStopPointMutation,
  useMoveQuayToStopPlaceMutation,
  useUpdateStopPointMutation,
} from '../../../../../generated/graphql';
import { showDangerToastWithError } from '../../../../../utils';
import {
  createAndInsertStopPoint,
  createQuayMappingForCopiedQuay,
  executeQuayMove,
  extractQuayValidityEnd,
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

  const fetchOriginalQuays = async (
    quayIds: ReadonlyArray<string>,
  ): Promise<QuayInfo[]> => {
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

    if (originalQuays.length === 0) {
      // No original quays found, cannot proceed as would cause quay mapping to fail
      throw new Error(
        t('stopAreaDetails.memberStops.errors.noOriginalQuaysFound'),
      );
    }

    const stopPointNeedingUpdate = existingStopPoints.find((stopPoint) => {
      const isMovingFromValidityStart =
        stopPoint.validity_start &&
        isSameDate(stopPoint.validity_start, params.moveQuayFromDate);
      return !isMovingFromValidityStart;
    });

    if (stopPointNeedingUpdate) {
      // Do the tiamat mutation first before updating the stop point validity end date
      const movedStopPlace = await executeQuayMove(params, moveQuayMutation);
      const newQuays = extractStopPlaceQuays(movedStopPlace);

      if (newQuays.length === 0) {
        // No new quays found, cannot proceed as would cause quay mapping to fail
        throw new Error(
          t('stopAreaDetails.memberStops.errors.noNewQuaysFound'),
        );
      }

      const quayMapping = createQuayMappingForCopiedQuay(
        originalQuays,
        newQuays,
        params.moveQuayFromDate,
      );

      const originalQuayId = stopPointNeedingUpdate.stop_place_ref;
      if (!originalQuayId) {
        throw new Error(
          t('stopAreaDetails.memberStops.errors.originalQuayIdRequired'),
        );
      }

      const newQuayId = quayMapping.get(originalQuayId);
      if (!newQuayId) {
        throw new Error(
          t('stopAreaDetails.memberStops.errors.noMappingForQuayId', {
            quayId: originalQuayId,
          }),
        );
      }

      const newQuayValidityEnd = extractQuayValidityEnd(
        movedStopPlace,
        newQuayId,
      );

      // Update the original stop point
      const validityEndDate = getPreviousDay(params.moveQuayFromDate);
      await updateStopPointValidity(
        stopPointNeedingUpdate.scheduled_stop_point_id,
        validityEndDate,
        updateStopPointMutation,
      );

      // Create a new stop point
      await createAndInsertStopPoint(
        stopPointNeedingUpdate,
        newQuayId,
        params.moveQuayFromDate,
        newQuayValidityEnd,
        insertStopPointMutation,
      );

      return { data: { stop_registry: { moveQuaysToStop: movedStopPlace } } };
    }

    const originalQuayId = params.quayIds[0];
    if (!originalQuayId) {
      throw new Error(
        t('stopAreaDetails.memberStops.errors.originalQuayIdRequired'),
      );
    }

    const movedStopPlace = await executeQuayMove(params, moveQuayMutation);
    const quayValidityEnd = extractQuayValidityEnd(
      movedStopPlace,
      originalQuayId,
    );

    if (quayValidityEnd) {
      const stopPointId = existingStopPoints.find(
        (sp) => sp.stop_place_ref === originalQuayId,
      )?.scheduled_stop_point_id;

      if (!stopPointId) {
        throw new Error(
          t('stopAreaDetails.memberStops.errors.stopPointIdRequired'),
        );
      }

      // Update the stop point validity end date if the stop place has an end date
      await updateStopPointValidity(
        stopPointId,
        quayValidityEnd,
        updateStopPointMutation,
      );
    }

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
