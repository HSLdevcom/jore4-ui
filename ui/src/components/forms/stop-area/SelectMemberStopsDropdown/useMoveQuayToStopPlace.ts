import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import {
  ServicePatternScheduledStopPointInsertInput,
  useGetOriginalQuaysLazyQuery,
  useGetStopPointsByQuayIdLazyQuery,
  useInsertStopPointMutation,
  useMoveQuayToStopPlaceMutation,
  useUpdateStopPointMutation,
} from '../../../../generated/graphql';
import { PartialScheduledStopPointSetInput } from '../../../../graphql/servicePattern';
import { showDangerToastWithError } from '../../../../utils';
import {
  MoveQuayParams,
  MoveStopPlace,
  QuayInfo,
  StopPointInfo,
} from './utils/types';

function getPreviousDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

function isSameDate(date1: string | DateTime, date2: string): boolean {
  const dateStr1 = typeof date1 === 'string' ? date1 : date1.toISODate();
  return dateStr1 === date2;
}

function extractStopPlaceQuays(
  stopPlace: MoveStopPlace | null | undefined,
): QuayInfo[] {
  // eslint-disable-next-line no-underscore-dangle
  if (stopPlace?.__typename !== 'stop_registry_StopPlace') {
    return [];
  }

  if (!stopPlace.quays) {
    return [];
  }

  return stopPlace.quays
    .filter((quay): quay is NonNullable<typeof quay> => quay !== null)
    .map((quay) => ({
      id: quay.id ?? '',
      publicCode: quay.publicCode ?? '',
    }))
    .filter((quay) => quay.id && quay.publicCode);
}

function createQuayMapping(
  originalQuays: QuayInfo[],
  newQuays: QuayInfo[],
): Map<string, string> {
  const mapping = new Map<string, string>();

  originalQuays.forEach((originalQuay) => {
    if (!originalQuay?.id || !originalQuay?.publicCode) {
      return;
    }

    const matchingNewQuay = newQuays.find(
      (newQuay) => newQuay?.publicCode === originalQuay.publicCode,
    );

    if (matchingNewQuay?.id) {
      mapping.set(originalQuay.id, matchingNewQuay.id);
    }
  });

  return mapping;
}

function createNewStopPoint(
  originalStopPoint: StopPointInfo,
  newQuayId: string,
  moveFromDate: string,
): ServicePatternScheduledStopPointInsertInput {
  const baseStopPoint: ServicePatternScheduledStopPointInsertInput = {
    priority: originalStopPoint.priority,
    direction: originalStopPoint.direction,
    label: originalStopPoint.label,
    timing_place_id: originalStopPoint.timing_place_id,
    validity_start: DateTime.fromISO(moveFromDate),
    validity_end: originalStopPoint.validity_end,
    located_on_infrastructure_link_id:
      originalStopPoint.located_on_infrastructure_link_id,
    stop_place_ref: newQuayId,
    measured_location: originalStopPoint.measured_location,
  };

  // Add vehicle modes if they exist
  const vehicleModes = originalStopPoint.vehicle_mode_on_scheduled_stop_point;
  if (vehicleModes?.length) {
    return {
      ...baseStopPoint,
      vehicle_mode_on_scheduled_stop_point: {
        data: vehicleModes.map((vm) => ({
          vehicle_mode: vm.vehicle_mode,
        })),
      },
    };
  }

  return baseStopPoint;
}

async function fetchExistingStopPoints(
  quayIds: string[],
  getStopPointsByQuayId: ReturnType<
    typeof useGetStopPointsByQuayIdLazyQuery
  >[0],
): Promise<StopPointInfo[]> {
  const stopPointsResult = await getStopPointsByQuayId({
    variables: { quayIds },
  });

  return stopPointsResult.data?.service_pattern_scheduled_stop_point ?? [];
}

async function executeQuayMove(
  params: MoveQuayParams,
  moveQuayMutation: ReturnType<typeof useMoveQuayToStopPlaceMutation>[0],
) {
  const moveResult = await moveQuayMutation({
    variables: {
      toStopPlaceId: params.toStopPlaceId,
      quayIds: params.quayIds,
      moveQuayFromDate: params.moveQuayFromDate,
      fromVersionComment: params.fromVersionComment,
      toVersionComment: params.toVersionComment,
    },
    refetchQueries: ['getStopPlaceDetails'],
  });

  const movedStopPlace = moveResult?.data?.stop_registry?.moveQuaysToStop;
  if (!movedStopPlace) {
    throw new Error('Move operation failed - no data returned');
  }

  return movedStopPlace;
}

async function updateStopPointValidity(
  stopPointId: string,
  validityEnd: string,
  updateStopPointMutation: ReturnType<typeof useUpdateStopPointMutation>[0],
) {
  const updateChanges: PartialScheduledStopPointSetInput = {
    validity_end: DateTime.fromISO(validityEnd),
  };

  await updateStopPointMutation({
    variables: {
      stopId: stopPointId,
      changes: updateChanges,
    },
  });
}

async function updateStopPointReference(
  stopPointId: string,
  newStopPlaceRef: string,
  updateStopPointMutation: ReturnType<typeof useUpdateStopPointMutation>[0],
) {
  const updateChanges: PartialScheduledStopPointSetInput = {
    stop_place_ref: newStopPlaceRef,
  };

  await updateStopPointMutation({
    variables: {
      stopId: stopPointId,
      changes: updateChanges,
    },
  });
}

async function createStopPoint(
  stopPoint: ServicePatternScheduledStopPointInsertInput,
  insertStopPointMutation: ReturnType<typeof useInsertStopPointMutation>[0],
) {
  await insertStopPointMutation({
    variables: {
      stopPoint,
    },
  });
}

async function updateStopPoints(
  existingStopPoints: StopPointInfo[],
  quayMapping: Map<string, string>,
  moveFromDate: string,
  updateStopPointMutation: ReturnType<typeof useUpdateStopPointMutation>[0],
  insertStopPointMutation: ReturnType<typeof useInsertStopPointMutation>[0],
) {
  const validityEndDate = getPreviousDay(moveFromDate);

  const stopPointUpdates = existingStopPoints
    .filter((originalStopPoint) => {
      const originalQuayId = originalStopPoint.stop_place_ref;
      return originalQuayId && quayMapping.has(originalQuayId);
    })
    .map(async (originalStopPoint) => {
      const originalQuayId = originalStopPoint.stop_place_ref;
      if (!originalQuayId) {
        throw new Error('Original quay ID is required');
      }

      const newQuayId = quayMapping.get(originalQuayId);
      if (!newQuayId) {
        throw new Error(`No mapping found for quay ID: ${originalQuayId}`);
      }

      // Check if the move is from the validity start date
      const isMovingFromValidityStart =
        originalStopPoint.validity_start &&
        isSameDate(originalStopPoint.validity_start, moveFromDate);

      if (isMovingFromValidityStart) {
        // If moving from validity start, just update the stop_place_ref
        await updateStopPointReference(
          originalStopPoint.scheduled_stop_point_id,
          newQuayId,
          updateStopPointMutation,
        );
      } else {
        // End the old stop point and create a new one
        await updateStopPointValidity(
          originalStopPoint.scheduled_stop_point_id,
          validityEndDate,
          updateStopPointMutation,
        );

        const newStopPoint = createNewStopPoint(
          originalStopPoint,
          newQuayId,
          moveFromDate,
        );
        await createStopPoint(newStopPoint, insertStopPointMutation);
      }
    });

  await Promise.all(stopPointUpdates);
}

export const useMoveQuayToStopPlace = () => {
  const { t } = useTranslation();
  const [moveQuayMutation, { loading: moveLoading, error: moveError }] =
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

    const movedStopPlace = await executeQuayMove(params, moveQuayMutation);

    const newQuays = extractStopPlaceQuays(movedStopPlace);
    const quayMapping = createQuayMapping(originalQuays, newQuays);

    await updateStopPoints(
      existingStopPoints,
      quayMapping,
      params.moveQuayFromDate,
      updateStopPointMutation,
      insertStopPointMutation,
    );

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
  };
};
