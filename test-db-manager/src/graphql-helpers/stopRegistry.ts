/* eslint-disable no-console */
import {
  OrganisationIdsByName,
  StopAreaIdsByName,
  StopPlaceDetailsByLabel,
  StopPlaceNetexRef,
  TerminalIdsByName,
} from '../datasets';
import {
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryInfoSpotInput,
  StopRegistryOrganisationInput,
  StopRegistryParentStopPlaceInput,
  StopRegistryStopPlace,
} from '../generated/graphql';
import { hasuraApi } from '../hasuraApi';
import {
  extractStopPlaceIdFromResponse,
  mapToInsertInfoSpotMutation,
  mapToInsertOrganisationMutation,
  mapToInsertStopAreaMutation,
  mapToInsertStopPlaceMutation,
  mapToInsertTerminalMutation,
  mapToUpdateTerminalMutation,
} from '../queries';
import {
  mapToGetStopPointByLabelQuery,
  mapToUpdateScheduledStopPointStopPlaceRefMutation,
} from '../queries/routesAndLines';
import {
  GetStopPointByLabelResult,
  InsertInfoSpotsResult,
  InsertOrganisationResult,
  InsertStopAreaResult,
  InsertStopPlaceResult,
  InsertTerminalResult,
  UpdateScheduledStopPointStopPlaceRefResult,
} from '../types';

const getTiamatResponseBody = (res: ExplicitAny) => {
  const { data, errors } = res;
  if (errors) {
    throw new Error(
      `Tiamat error occurred: ${JSON.stringify(errors, null, 2)}`,
    );
  }
  if (!data) {
    throw new Error('Null data returned from Tiamat');
  }
  return data;
};

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

  const shelterRef =
    insertStopPlaceResult.data.stop_registry.mutateStopPlace[0]?.quays[0]?.placeEquipments?.shelterEquipment?.map(
      (shelter: { id: string }) => shelter.id,
    );
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

  return { netexId: stopPlaceRef, shelterRef };
};

const insertOrganisation = async (
  organisation: StopRegistryOrganisationInput,
) => {
  try {
    const res = (await hasuraApi(
      mapToInsertOrganisationMutation(organisation),
    )) as InsertOrganisationResult;
    const data = getTiamatResponseBody(res);

    return data.stop_registry.mutateOrganisation[0];
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
      stopPlace: {
        ...stopPlace,
        keyValues: [
          ...(stopPlace.keyValues ?? []),
          {
            key: 'priority',
            values: [stopPoint.priority.toString(10)],
          },
          {
            key: 'validityStart',
            values: [stopPoint.validity_start],
          },
          {
            key: 'validityEnd',
            values: [stopPoint.validity_end],
          },
        ],
      },
    });

    if (stopPoint.stop_place_ref) {
      console.warn(
        `Stop point ${label} (${stopPointId}) already has a stop place with id ${stopPoint.stop_place_ref}. Overwrote with ${stopPlaceRef.netexId}.`,
      );
    }
    return {
      netexId: stopPlaceRef.netexId,
      shelterRef: stopPlaceRef.shelterRef,
      label,
    };
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
    const res = (await hasuraApi(
      mapToInsertStopAreaMutation(stopArea),
    )) as InsertStopAreaResult;
    const data = getTiamatResponseBody(res);

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

const insertTerminal = async (
  terminal: Partial<StopRegistryCreateMultiModalStopPlaceInput>,
): Promise<string> => {
  try {
    const res = (await hasuraApi(
      mapToInsertTerminalMutation(terminal),
    )) as InsertTerminalResult;
    const data = getTiamatResponseBody(res);

    return data.stop_registry.createMultiModalStopPlace.id;
  } catch (error) {
    console.error(
      'An error occurred while inserting terminal!',
      terminal.name?.value,
      error,
    );
    throw error;
  }
};

const updateTerminal = async (
  id: string,
  terminal: Partial<StopRegistryParentStopPlaceInput>,
) => {
  try {
    const res = await hasuraApi(
      mapToUpdateTerminalMutation({ id, ...terminal }),
    );
    getTiamatResponseBody(res);
  } catch (error) {
    console.error(
      'An error occurred while updating terminal!',
      terminal.name?.value,
      error,
    );
    throw error;
  }
};

const insertInfoSpot = async (infoSpot: Partial<StopRegistryInfoSpotInput>) => {
  try {
    const res = (await hasuraApi(
      mapToInsertInfoSpotMutation(infoSpot),
    )) as InsertInfoSpotsResult;
    const data = getTiamatResponseBody(res);
    return data;
  } catch (error) {
    console.error(
      'An error occurred while inserting info spot!',
      infoSpot.label,
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
  const collectedStopIds: StopPlaceDetailsByLabel = {};

  console.log('Inserting stop places...');
  for (let index = 0; index < stopPlaces.length; index++) {
    const stopPlace = stopPlaces[index];
    console.log(`Stop point ${stopPlace.label}: stop place insert starting...`);
    // eslint-disable-next-line no-await-in-loop
    const netexRef = await insertStopPlace(stopPlace);
    collectedStopIds[netexRef.label] = {
      netexId: netexRef.netexId,
      shelters: netexRef.shelterRef,
    };
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

export const insertTerminals = async (
  terminalCreateInputs: Array<
    Partial<StopRegistryCreateMultiModalStopPlaceInput>
  >,
  terminalUpdateInputs: Array<Partial<StopRegistryParentStopPlaceInput>>,
): Promise<TerminalIdsByName> => {
  const collectedTerminalIds: TerminalIdsByName = {};

  console.log('Inserting terminals...');
  for (let index = 0; index < terminalCreateInputs.length; index++) {
    const terminalCreateInput = terminalCreateInputs[index];
    const terminalUpdateInput = terminalUpdateInputs[index];
    console.log(
      `Terminal ${terminalCreateInput?.name?.value}: terminal insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const id = await insertTerminal(terminalCreateInput);
    console.log(
      `Terminal ${terminalCreateInput?.name?.value}: terminal inserted with id: ${id}`,
    );
    if (terminalCreateInput.name?.value && id) {
      collectedTerminalIds[terminalCreateInput.name.value] = id;
    }

    // Update rest of the fields that can not be set with the Create mutation.
    console.log(
      `Terminal ${terminalCreateInput?.name?.value}: updating with additional details...`,
    );
    // eslint-disable-next-line no-await-in-loop
    await updateTerminal(id, terminalUpdateInput);

    console.log(
      `Terminal ${terminalCreateInput?.name?.value}: terminal insert finished!`,
    );
  }

  console.log(`Inserted ${terminalCreateInputs.length} terminals.`);

  return collectedTerminalIds;
};

export const insertInfoSpots = async (
  infoSpots: Array<Partial<StopRegistryInfoSpotInput>>,
) => {
  console.log('Inserting info spots...');
  for (let index = 0; index < infoSpots.length; index++) {
    const infoSpot = infoSpots[index];
    console.log(`Info spot ${infoSpot.label}: insert starting...`);
    // eslint-disable-next-line no-await-in-loop
    await insertInfoSpot(infoSpot);
    console.log(`Info spot ${infoSpot.label}: insert finished!`);
  }
  console.log(`Inserted ${infoSpots.length} info spots.`);
};
