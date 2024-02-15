import { StopRegistryStopPlace } from '../generated/graphql';
import { hasuraApi } from '../hasuraApi';
import {
  extractStopPlaceIdFromResponse,
  mapToInsertStopPlaceMutation,
} from '../queries';
import { mapToUpdateScheduledStopPointStopPlaceRefMutation } from '../queries/routesAndLines';
import {
  InsertStopPlaceResult,
  UpdateScheduledStopPointStopPlaceRefResult,
} from '../types';

/**
 * Inserts a new stop place to stop registry,
 * and updates its id to the scheduled stop point.
 */
export const insertStopPlaceForScheduledStopPoint = async (
  scheduledStopPointId: UUID,
  stopPlace: Partial<StopRegistryStopPlace>,
) => {
  const insertStopPlaceResult = (await hasuraApi(
    mapToInsertStopPlaceMutation(stopPlace),
  )) as InsertStopPlaceResult;

  const stopPlaceRef = extractStopPlaceIdFromResponse(insertStopPlaceResult);

  const updateResult = (await hasuraApi(
    mapToUpdateScheduledStopPointStopPlaceRefMutation({
      scheduledStopPointId,
      stopPlaceRef,
    }),
  )) as UpdateScheduledStopPointStopPlaceRefResult;

  if (!updateResult?.data?.update_service_pattern_scheduled_stop_point_by_pk) {
    throw new Error(
      `Failed to update scheduled stop point after inserting stop place! scheduledStopPointId: ${scheduledStopPointId}, stopPlaceRef: ${stopPlaceRef}`,
    );
  }

  return stopPlaceRef;
};
