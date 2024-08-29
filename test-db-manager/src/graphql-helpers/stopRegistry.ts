/* eslint-disable no-console */
import {
  StopAreaInput,
  StopPlaceInput,
  StopPlaceMaintenance,
  StopPlaceNetexRef,
} from '../datasets';
import {
  StopRegistryOrganisationInput,
  StopRegistryStopPlaceOrganisationRef,
  StopRegistryStopPlaceOrganisationRelationshipType,
  StopRegistryVersionLessEntityRefInput,
} from '../generated/graphql';
import { hasuraApi } from '../hasuraApi';
import {
  extractStopPlaceIdFromResponse,
  mapToInsertOrganisationMutation,
  mapToInsertStopAreaMutation,
  mapToInsertStopPlaceMutation,
} from '../queries';
import {
  mapToGetStopPointByLabelQuery,
  mapToUpdateScheduledStopPointStopPlaceRefMutation,
} from '../queries/routesAndLines';
import {
  GetStopPointByLabelResult,
  InsertOrganisationResult,
  InsertStopAreaResult,
  InsertStopPlaceResult,
  UpdateScheduledStopPointStopPlaceRefResult,
} from '../types';
import { isNotNullish } from '../utils';

export type StopPlaceIdsByLabel = Map<string, string>;
export type OrganisationIdsByName = Map<string, string>;

const mapStopPlaceMaintenanceToInput = (
  maintenance: StopPlaceMaintenance | undefined | null,
  organisationIdsByName: OrganisationIdsByName,
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

        const maintenanceOrganisationId =
          organisationIdsByName.get(organisationName);
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
export const insertStopPlaceForScheduledStopPoint = async ({
  scheduledStopPointId,
  stopPlace,
  maintenance,
  organisationIdsByName = new Map(),
}: {
  scheduledStopPointId: UUID;
  stopPlace: StopPlaceInput['stopPlace'];
  maintenance?: StopPlaceInput['maintenance'];
  organisationIdsByName?: OrganisationIdsByName;
}) => {
  const stopPlaceForInsert = {
    ...stopPlace,
    organisations: mapStopPlaceMaintenanceToInput(
      maintenance,
      organisationIdsByName,
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

const insertOrganisation = async (
  organisation: StopRegistryOrganisationInput,
) => {
  try {
    const returnValue = (await hasuraApi(
      mapToInsertOrganisationMutation(organisation),
    )) as InsertOrganisationResult;

    if (returnValue.data === null) {
      throw new Error('Null data returned from Tiamat');
    }

    return returnValue.data.stop_registry.mutateOrganisation[0];
  } catch (error) {
    console.error(
      'An error occurred while inserting organisation!',
      organisation.name,
      error,
    );
    throw error;
  }
};

const insertStopPlace = async (
  { label, maintenance, stopPlace }: StopPlaceInput,
  organisationIdsByName: OrganisationIdsByName,
): Promise<StopPlaceNetexRef> => {
  // Find related scheduled stop point.
  const stopPointResult = (await hasuraApi(
    mapToGetStopPointByLabelQuery(label),
  )) as GetStopPointByLabelResult;

  const stopPoints =
    stopPointResult?.data?.service_pattern_scheduled_stop_point;
  const stopPoint = stopPoints && stopPoints[0];
  const stopPointId = stopPoint?.scheduled_stop_point_id;

  if (!stopPointId) {
    throw new Error(
      `Could not find scheduled stop point with label ${label}. Did you forget to import route DB dump?`,
    );
  }
  if (stopPoints.length > 1) {
    // It is possible that there are multiple stop points for one label, with different priorities and/or validity times.
    // With current dump this does not happen, but if things change, we might need some more logic here...
    console.warn(
      `Found multiple stop points for label ${label}, using the first one...`,
    );
  }

  try {
    const stopPlaceRef = await insertStopPlaceForScheduledStopPoint({
      scheduledStopPointId: stopPointId,
      stopPlace,
      maintenance,
      organisationIdsByName,
    });

    if (stopPoint.stop_place_ref) {
      console.warn(
        `Stop point ${label} (${stopPointId}) already has a stop place with id ${stopPoint.stop_place_ref}. Overwrote with ${stopPlaceRef}.`,
      );
    }
    return { netexId: stopPlaceRef, label };
  } catch (error) {
    console.error(
      'An error occurred while inserting stop place!',
      label,
      stopPlace,
      error,
    );
    throw error;
  }
};

const insertStopArea = async (
  stopArea: StopAreaInput,
  stopPlaces: StopPlaceIdsByLabel,
) => {
  const area = {
    ...stopArea.stopArea,
    members: stopArea.memberLabels.map(
      (label) =>
        ({
          ref: stopPlaces.get(label),
        }) as StopRegistryVersionLessEntityRefInput,
    ),
  };

  try {
    const returnValue = (await hasuraApi(
      mapToInsertStopAreaMutation(area),
    )) as InsertStopAreaResult;
    if (returnValue.data === null) {
      throw new Error('Null data returned from Tiamat');
    }
  } catch (error) {
    console.error(
      'An error occurred while inserting stop area!',
      stopArea.stopArea.name?.value,
      error,
    );
    throw error;
  }
};

export const insertOrganisations = async (
  organisations: Array<StopRegistryOrganisationInput>,
) => {
  const collectedOrganisationIds: OrganisationIdsByName = new Map();

  console.log('Inserting organisations...');
  // Need to run these sequentially. Will get transaction errors if trying to do concurrently.
  for (let index = 0; index < organisations.length; index++) {
    const organisation = organisations[index];
    console.log(
      `Organisation ${organisation.name}: organisation insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const result = await insertOrganisation(organisation);
    collectedOrganisationIds.set(result.name, result.id);
    console.log(
      `Organisation ${organisation.name}: organisation insert finished!`,
    );
  }
  console.log(`Inserted ${organisations.length} organisations.`);

  return collectedOrganisationIds;
};

export const insertStopPlaces = async (
  stopPlaces: Array<StopPlaceInput>,
  organisationIds: OrganisationIdsByName,
) => {
  const collectedStopIds: StopPlaceIdsByLabel = new Map();

  console.log('Inserting stop places...');
  for (let index = 0; index < stopPlaces.length; index++) {
    const stopPoint = stopPlaces[index];
    console.log(
      `Stop point ${stopPoint?.label}: stop place insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const netexRef = await insertStopPlace(stopPoint, organisationIds);
    collectedStopIds.set(netexRef.label, netexRef.netexId);
    console.log(`Stop point ${stopPoint?.label}: stop place insert finished!`);
  }
  console.log(`Inserted ${stopPlaces.length} stop places.`);

  return collectedStopIds;
};

export const insertStopAreas = async (
  stopAreas: Array<StopAreaInput>,
  stopPlaceIds: StopPlaceIdsByLabel,
) => {
  console.log('Inserting stop areas...');
  for (let index = 0; index < stopAreas.length; index++) {
    const stopArea = stopAreas[index];
    console.log(
      `Stop area ${stopArea?.stopArea.name?.value}: stop area insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    await insertStopArea(stopArea, stopPlaceIds);
    console.log(
      `Stop area ${stopArea?.stopArea.name?.value}: stop area insert finished!`,
    );
  }
  console.log(`Inserted ${stopAreas.length} stop areas.`);
};
