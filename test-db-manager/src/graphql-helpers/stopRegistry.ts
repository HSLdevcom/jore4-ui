/* eslint-disable no-console */
import {
  OrganisationIdsByName,
  StopAreaIdsByName,
  StopPlaceIdsByLabel,
  StopPlaceNetexRef,
} from '../datasets';
import {
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryOrganisationInput,
  StopRegistryStopPlace,
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

/**
 * Inserts a new stop place to stop registry,
 * and updates its id to the scheduled stop point.
 */
export const insertStopPlaceForScheduledStopPoint = async ({
  scheduledStopPointId,
  stopPlace,
}: {
  scheduledStopPointId: UUID;
  stopPlace: Partial<StopRegistryStopPlace>;
}) => {
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

const insertStopPlace = async ({
  label,
  stopPlace,
}: {
  label: string;
  stopPlace: Partial<StopRegistryStopPlace>;
}): Promise<StopPlaceNetexRef> => {
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
  stopArea: Partial<StopRegistryGroupOfStopPlacesInput>,
): Promise<string> => {
  try {
    const { data } = (await hasuraApi(
      mapToInsertStopAreaMutation(stopArea),
    )) as InsertStopAreaResult;

    if (data === null) {
      throw new Error('Null data returned from Tiamat');
    }

    return data.stop_registry.mutateGroupOfStopPlaces.id;
  } catch (error) {
    console.error(
      'An error occurred while inserting stop area!',
      stopArea.name?.value,
      error,
    );
    throw error;
  }
};

export const insertOrganisations = async (
  organisations: Array<StopRegistryOrganisationInput>,
) => {
  const collectedOrganisationIds: OrganisationIdsByName = {};

  console.log('Inserting organisations...');
  // Need to run these sequentially. Will get transaction errors if trying to do concurrently.
  for (let index = 0; index < organisations.length; index++) {
    const organisation = organisations[index];
    console.log(
      `Organisation ${organisation.name}: organisation insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const result = await insertOrganisation(organisation);
    collectedOrganisationIds[result.name] = result.id;
    console.log(
      `Organisation ${organisation.name}: organisation insert finished!`,
    );
  }
  console.log(`Inserted ${organisations.length} organisations.`);

  return collectedOrganisationIds;
};

export const insertStopPlaces = async (
  stopPlaces: Array<{
    label: string;
    stopPlace: Partial<StopRegistryStopPlace>;
  }>,
) => {
  const collectedStopIds: StopPlaceIdsByLabel = {};

  console.log('Inserting stop places...');
  for (let index = 0; index < stopPlaces.length; index++) {
    const stopPlace = stopPlaces[index];
    console.log(`Stop point ${stopPlace.label}: stop place insert starting...`);
    // eslint-disable-next-line no-await-in-loop
    const netexRef = await insertStopPlace(stopPlace);
    collectedStopIds[netexRef.label] = netexRef.netexId;
    console.log(`Stop point ${stopPlace.label}: stop place insert finished!`);
  }
  console.log(`Inserted ${stopPlaces.length} stop places.`);

  return collectedStopIds;
};

export const insertStopAreas = async (
  stopAreas: Array<Partial<StopRegistryGroupOfStopPlacesInput>>,
): Promise<StopAreaIdsByName> => {
  const collectedAreaIds: StopAreaIdsByName = {};

  console.log('Inserting stop areas...');
  for (let index = 0; index < stopAreas.length; index++) {
    const stopArea = stopAreas[index];
    console.log(
      `Stop area ${stopArea?.name?.value}: stop area insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const id = await insertStopArea(stopArea);
    console.log(
      `Stop area ${stopArea?.name?.value}: stop area inserted with id: ${id}`,
    );
    if (stopArea.name?.value && id) {
      collectedAreaIds[stopArea.name.value] = id;
    }
    console.log(
      `Stop area ${stopArea?.name?.value}: stop area insert finished!`,
    );
  }

  console.log(`Inserted ${stopAreas.length} stop areas.`);

  return collectedAreaIds;
};
