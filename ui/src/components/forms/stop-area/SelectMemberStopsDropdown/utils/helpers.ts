import { DateTime } from 'luxon';
import {
  ServicePatternScheduledStopPointInsertInput,
  useGetStopPointsByQuayIdLazyQuery,
  useInsertStopPointMutation,
  useMoveQuayToStopPlaceMutation,
  useUpdateStopPointMutation,
} from '../../../../../generated/graphql';
import { PartialScheduledStopPointSetInput } from '../../../../../graphql';
import {
  MoveQuayParams,
  MoveStopPlace,
  QuayInfo,
  StopPointInfo,
} from './types';

export function getPreviousDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}

export function isSameDate(date1: string | DateTime, date2: string): boolean {
  const dateStr1 = typeof date1 === 'string' ? date1 : date1.toISODate();
  return dateStr1 === date2;
}

export function extractStopPlaceQuays(
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

export function createQuayMapping(
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

export async function fetchExistingStopPoints(
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

export async function executeQuayMove(
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

export async function updateStopPointValidity(
  stopPointId: string,
  validityEnd: string,
  updateStopPointMutation: ReturnType<typeof useUpdateStopPointMutation>[0],
): Promise<void> {
  const updateChanges: PartialScheduledStopPointSetInput = {
    validity_end: DateTime.fromISO(validityEnd),
  };

  const result = await updateStopPointMutation({
    variables: {
      stopId: stopPointId,
      changes: updateChanges,
    },
  });

  if (result.errors && result.errors.length > 0) {
    throw new Error(
      `Stop point validity update failed: ${result.errors.map((e) => e.message).join(', ')}`,
    );
  }

  if (!result.data) {
    throw new Error('Stop point validity update returned no data');
  }
}

export async function createAndInsertStopPoint(
  originalStopPoint: StopPointInfo,
  newQuayId: string,
  moveFromDate: string,
  insertStopPointMutation: ReturnType<typeof useInsertStopPointMutation>[0],
) {
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
  const stopPoint = vehicleModes?.length
    ? {
        ...baseStopPoint,
        vehicle_mode_on_scheduled_stop_point: {
          data: vehicleModes.map((vm) => ({
            vehicle_mode: vm.vehicle_mode,
          })),
        },
      }
    : baseStopPoint;

  await insertStopPointMutation({
    variables: {
      stopPoint,
    },
  });
}
