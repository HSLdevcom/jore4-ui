import { StopPlaceInput, StopPlaceMaintenance, seedOrganisationsByLabel } from '../datasets';
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
  organisationIdsByLabel: Map<string, string>
): Array<StopRegistryStopPlaceOrganisationRef> | undefined => {
  if (!maintenance) {
    return undefined;
  }

  const organisationRefs: Array<StopRegistryStopPlaceOrganisationRef> =
    Object.entries(maintenance)
      .map(([key, organisationLabel]) => {
        if (!organisationLabel) {
          return null;
        }

        const organisation = seedOrganisationsByLabel[organisationLabel]
        const maintenanceOrganisationId =
          organisationIdsByLabel.get(organisation?.name);
        if (!maintenanceOrganisationId) {
          throw new Error(
            `Could not find organisation with label ${organisationLabel}`,
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
    organisationIdsByLabel = new Map()
  }: {
    scheduledStopPointId: UUID,
    stopPlace: StopPlaceInput['stopPlace'],
    maintenance?: StopPlaceInput['maintenance'],
    organisationIdsByLabel?: Map<string, string>
  }
) => {
  const stopPlaceForInsert = {
    ...stopPlace,
    organisations: mapStopPlaceMaintenanceToInput(
      maintenance,
      organisationIdsByLabel
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
