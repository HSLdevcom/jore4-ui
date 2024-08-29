import { StopPlaceInput, StopPlaceMaintenance } from '../datasets';
import { StopRegistryStopPlaceOrganisationRef, StopRegistryStopPlaceOrganisationRelationshipType } from '../generated/graphql';
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
import { isNotNullish } from '../utils';

const mapStopPlaceMaintenanceToInput = (
  maintenance: StopPlaceMaintenance | undefined | null,
  organisationIdsByName: Map<string, string>
): Array<StopRegistryStopPlaceOrganisationRef> | undefined => {
  if (!maintenance) {
    return undefined;
  }

  const organisationRefs: Array<StopRegistryStopPlaceOrganisationRef> =
    Object.entries(maintenance)
      .map(([key, organisationName]) => {
        if (!organisationName) {
          return null;
        }

        const maintenanceOrganisationId = organisationIdsByName.get(organisationName);
        if (!maintenanceOrganisationId) {
          throw new Error(
            `Could not find organisation with label ${organisationName}`,
          );
        }

        return {
          organisationRef: maintenanceOrganisationId,
          relationshipType:
            key as StopRegistryStopPlaceOrganisationRelationshipType,
        };
      })
      .filter(isNotNullish);

  return organisationRefs;
};

/**
 * Inserts a new stop place to stop registry,
 * and updates its id to the scheduled stop point.
 */
export const insertStopPlaceForScheduledStopPoint = async (
  {
    scheduledStopPointId,
    stopPlace,
    maintenance,
    organisationIdsByName = new Map()
  }: {
    scheduledStopPointId: UUID,
    stopPlace: StopPlaceInput['stopPlace'],
    maintenance?: StopPlaceInput['maintenance'],
    organisationIdsByName?: Map<string, string>
  }
) => {
  const stopPlaceForInsert = {
    ...stopPlace,
    organisations: mapStopPlaceMaintenanceToInput(
      maintenance,
      organisationIdsByName
    ),
  };

  const insertStopPlaceResult = (await hasuraApi(
    mapToInsertStopPlaceMutation(stopPlaceForInsert),
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
      `Failed to update scheduled stop point after inserting stop place! scheduledStopPointId: ${scheduledStopPointId}, stopPlaceRef: ${stopPlaceRef}, response: ${JSON.stringify(
        updateResult,
      )}`,
    );
  }

  return stopPlaceRef;
};
