/* eslint-disable no-console */
import {
  OrganisationIdsByName,
  QuayDetailsByLabel,
  QuayNetexRef,
  StopPlaceIdsByName,
  StopPlaceNetexRef,
  TerminalIdsByName,
} from '../datasets';
import {
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryInfoSpotInput,
  StopRegistryOrganisationInput,
  StopRegistryParentStopPlaceInput,
  StopRegistryStopPlaceInput,
} from '../generated/graphql';
import { hasuraApi } from '../hasuraApi';
import {
  extractQuayIdsFromResponse,
  mapToInsertInfoSpotMutation,
  mapToInsertOrganisationMutation,
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
  scheduledStopPoints,
  stopPlace,
}: {
  scheduledStopPoints: Record<string, UUID>;
  stopPlace: Partial<StopRegistryStopPlaceInput>;
}): Promise<StopPlaceNetexRef> => {
  const insertStopPlaceResult = (await hasuraApi(
    mapToInsertStopPlaceMutation(stopPlace),
  )) as InsertStopPlaceResult;

  const stopPlaceRefs: { label: string; netexId: string }[] =
    extractQuayIdsFromResponse(insertStopPlaceResult);

  const quayRef: Array<QuayNetexRef> =
    insertStopPlaceResult.data.stop_registry.mutateStopPlace[0]?.quays.map(
      (quay) => {
        return {
          label: quay.publicCode,
          netexId: quay.id,
          shelterRef: quay?.placeEquipments?.shelterEquipment?.map(
            (shelter: { id: string }) => shelter.id,
          ),
        };
      },
    );

  // eslint-disable-next-line no-restricted-syntax
  for (const sp of stopPlaceRefs) {
    const scheduledStopPointId = scheduledStopPoints[sp.label] ?? 'null';
    const stopPlaceRef = sp.netexId;

    // eslint-disable-next-line no-await-in-loop
    const updateResult = (await hasuraApi(
      mapToUpdateScheduledStopPointStopPlaceRefMutation({
        scheduledStopPointId,
        stopPlaceRef,
      }),
    )) as UpdateScheduledStopPointStopPlaceRefResult;

    if (
      !updateResult?.data?.update_service_pattern_scheduled_stop_point_by_pk
    ) {
      throw new Error(
        `Failed to update scheduled stop point after inserting stop place! scheduledStopPointId: ${scheduledStopPointId}, stopPlaceRef: ${stopPlaceRef}, response: ${JSON.stringify(
          updateResult,
        )}`,
      );
    }
  }

  return {
    label: stopPlace.privateCode?.value ?? 'error',
    netexId: insertStopPlaceResult.data.stop_registry.mutateStopPlace[0]?.id,
    quayRef,
  };
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

type StopPointType = {
  scheduled_stop_point_id: UUID;
  label: string;
  stop_place_ref: string | null;
  priority: number;
  validity_start: string | null;
  validity_end: string | null;
};

const insertStopPlace = async ({
  stopPlace,
}: {
  stopPlace: Partial<StopRegistryStopPlaceInput>;
}): Promise<StopPlaceNetexRef> => {
  const stopPointRefPromises = stopPlace.quays
    ?.filter((quay) => quay !== null)
    .map(async (quay): Promise<{ label: string; stopPoint: StopPointType }> => {
      const label = quay.publicCode ?? 'error';
      // Find related scheduled stop points.
      const stopPointResult = (await hasuraApi(
        mapToGetStopPointByLabelQuery(label),
      )) as GetStopPointByLabelResult;

      const stopPoints =
        stopPointResult?.data?.service_pattern_scheduled_stop_point;
      const stopPoint: StopPointType = stopPoints && stopPoints[0];
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
      const returnvalue: { label: string; stopPoint: StopPointType } = {
        label,
        stopPoint,
      };
      return returnvalue;
    })
    .filter((a) => !!a);

  if (!stopPointRefPromises) {
    throw new Error(
      `Unable to for create stop points for ${stopPlace.publicCode}`,
    );
  }
  const stopPointTuples: Array<{ label: string; stopPoint: StopPointType }> =
    await Promise.all(stopPointRefPromises);

  const stopPointRefs: Record<string, StopPointType> = Object.fromEntries(
    stopPointTuples.map((spr) => [spr.label, spr.stopPoint]),
  );

  try {
    // TODO: Scheduled Stop Point should be per Quay (new Timat stop), not per Stop Place (new Tiamat Stop Area)
    // eslint-disable-next-line no-param-reassign
    stopPlace.quays = stopPlace.quays
      ?.filter((quay) => quay !== null)
      .map((quay) => {
        const ref = stopPointRefs[quay?.publicCode ?? 'error'];
        if (!ref) {
          throw new Error('lol');
        }
        return {
          ...quay,
          keyValues: [
            ...(quay.keyValues ?? []),
            {
              key: 'priority',
              values: [ref.priority.toString(10)],
            },
            {
              key: 'validityStart',
              values: [ref.validity_start],
            },
            {
              key: 'validityEnd',
              values: [ref.validity_end],
            },
          ],
        };
      });
    const stopPlaceRef = await insertStopPlaceForScheduledStopPoint({
      scheduledStopPoints: Object.fromEntries(
        Object.entries(stopPointRefs).map((spr) => [
          spr[0],
          spr[1].scheduled_stop_point_id,
        ]),
      ),
      stopPlace: {
        ...stopPlace,
        keyValues: [
          ...(stopPlace.keyValues ?? []),
          {
            key: 'priority',
            values: ['10'],
          },
          {
            key: 'validityStart',
            values: ['2000-01-01'],
          },
          {
            key: 'validityEnd',
            values: ['2052-01-01'],
          },
        ],
      },
    });
    return stopPlaceRef;
  } catch (error) {
    console.error(
      'An error occurred while inserting stop place!',
      stopPlace.privateCode,
      stopPlace,
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
  stopPlaces: Array<Partial<StopRegistryStopPlaceInput>>,
) => {
  const collectedStopIds: StopPlaceIdsByName = {};
  const collectedQuayDetails: QuayDetailsByLabel = {};

  console.log('Inserting stop places...');
  for (let index = 0; index < stopPlaces.length; index++) {
    const stopPlace = stopPlaces[index];
    console.log(
      `Stop place ${stopPlace.privateCode?.value}: stop place insert starting...`,
    );
    // eslint-disable-next-line no-await-in-loop
    const netexRef = await insertStopPlace({ stopPlace });
    collectedStopIds[netexRef.label] = netexRef.netexId;
    netexRef.quayRef.forEach((quay) => {
      collectedQuayDetails[quay.label] = {
        netexId: quay.netexId,
        shelters: quay.shelterRef,
      };
    });
    console.log(
      `Stop place ${stopPlace.privateCode?.value}: stop place insert finished!`,
    );
  }
  console.log(`Inserted ${stopPlaces.length} stop places.`);

  return { collectedStopIds, collectedQuayDetails };
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
