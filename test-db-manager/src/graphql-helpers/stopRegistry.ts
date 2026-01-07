/* eslint-disable no-console */
import compact from 'lodash/compact';
import uniqBy from 'lodash/uniqBy';
import {
  OrganisationIdsByName,
  QuayDetailsByLabel,
  QuayNetexRef,
  StopPlaceIdsByName,
  StopPlaceNetexRef,
  TerminalIdsByName,
} from '../datasets';
import {
  InputMaybe,
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryInfoSpotInput,
  StopRegistryKeyValuesInput,
  StopRegistryOrganisationInput,
  StopRegistryParentStopPlaceInput,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
} from '../generated/graphql';
import { hasuraApi } from '../hasuraApi';
import {
  mapToGetAllStopPlaceLabelsAndIds,
  mapToGetStopPointByLabelQuery,
  mapToInsertInfoSpotMutation,
  mapToInsertOrganisationMutation,
  mapToInsertStopPlaceMutation,
  mapToInsertTerminalMutation,
  mapToUpdateScheduledStopPointStopPlaceRefMutation,
  mapToUpdateTerminalMutation,
} from '../queries';
import {
  GetAllStopPlaceLabelsAndIdsResult,
  GetStopPointByLabelResult,
  InsertInfoSpotsResult,
  InsertOrganisationResult,
  InsertStopPlaceResult,
  InsertTerminalResult,
  KnownValueKey,
  UpdateScheduledStopPointStopPlaceRefResult,
} from '../types';

const testQuayIdentityTag = 'TestQuayIdentityTag';

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

function findKeyValue(
  keyValues: ReadonlyArray<StopRegistryKeyValuesInput | null | undefined>,
  key: string,
): string | null {
  const keyValue = keyValues.find((it) => it?.key === key);
  if (!keyValue) {
    throw new Error(
      `Expected to find keyValue for key(${key}) but none was found! keyValues: ${JSON.stringify(keyValues, null, 2)}`,
    );
  }

  return keyValue.values?.at(0) ?? null;
}

function findQuayTag(quay: StopRegistryQuayInput): string {
  const tag = findKeyValue(quay.keyValues ?? [], testQuayIdentityTag);

  if (tag === null) {
    throw new Error(
      `Quay was expected to be tagged with Test datat tracking ID, but the tag was null! Quay: ${JSON.stringify(quay, null, 2)}`,
    );
  }

  return tag;
}

function getStopPlaceAndQuayRefsFromInsertResult(
  label: string,
  insertStopPlaceResult: InsertStopPlaceResult,
): StopPlaceNetexRef {
  const insertedStopPlace =
    insertStopPlaceResult.data?.stop_registry?.mutateStopPlace?.at(0);

  if (!insertedStopPlace) {
    throw new Error(
      `No StopPlace found in the Tiamat response! Response: ${JSON.stringify(insertStopPlaceResult, null, 2)}`,
    );
  }

  const quayRef: Array<QuayNetexRef> = insertedStopPlace.quays.map((quay) => {
    return {
      label: quay.publicCode,
      netexId: quay.id,
      tag: findQuayTag(quay),
      shelterRef: quay?.placeEquipments?.shelterEquipment?.map(
        (shelter: { id: string }) => shelter.id,
      ),
    };
  });

  return {
    label,
    netexId: insertedStopPlace.id,
    quayRef,
  };
}

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

  const stopPlaceNetexRef = getStopPlaceAndQuayRefsFromInsertResult(
    stopPlace.privateCode?.value ?? 'error',
    insertStopPlaceResult,
  );

  for (const quay of stopPlaceNetexRef.quayRef) {
    const scheduledStopPointId = scheduledStopPoints[quay.tag] ?? 'null';
    const stopPlaceRef = quay.netexId;

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
        `Failed to update scheduled stop point after inserting stop place! scheduledStopPointId: ${scheduledStopPointId}, stopPlaceRef: ${stopPlaceRef}, quayRef: ${quay}, response: ${JSON.stringify(
          updateResult,
          null,
          2,
        )}`,
      );
    }
  }

  return stopPlaceNetexRef;
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

function getQuayHash(quay: StopRegistryQuayInput): string {
  const keyValues = quay.keyValues ?? [];

  try {
    const validityStart = findKeyValue(keyValues, KnownValueKey.ValidityStart);
    const validityEnd = findKeyValue(keyValues, KnownValueKey.ValidityEnd);
    const priority = findKeyValue(keyValues, KnownValueKey.Priority);

    return `${quay.publicCode}-${validityStart}-${validityEnd}-${priority}`;
  } catch (cause) {
    throw new Error(
      `Multiple StopPoints were found for quay(${JSON.stringify(quay, null, 0)}), but the quay does not contain all needed fields (validityStart, validityEnd, priority) to match it with the StopPoints!`,
      { cause },
    );
  }
}

function getStopPointHash(stopPoint: StopPointType): string {
  return `${stopPoint.label}-${stopPoint.validity_start}-${stopPoint.validity_end}-${stopPoint.priority}`;
}

type QuayRefAndStopPoint = {
  readonly tag: string;
  readonly stopPoint: StopPointType;
};

function resolveStopPointForQuay(
  quay: StopRegistryQuayInput,
  stopPointCandidates: ReadonlyArray<StopPointType>,
): QuayRefAndStopPoint {
  const { publicCode } = quay;
  const tag = findQuayTag(quay);

  if (!publicCode) {
    throw new Error(
      `Quay must have a publicCode, so that it may be linked with a StopPoint! Quay: ${JSON.stringify(quay, null, 2)}`,
    );
  }

  if (stopPointCandidates.length === 0) {
    throw new Error(
      `No StopPoints were found where label=publicCode(${publicCode})!`,
    );
  }

  if (stopPointCandidates.length === 1) {
    return { tag, stopPoint: stopPointCandidates[0] };
  }

  const quayHash = getQuayHash(quay);
  const stopPoint = stopPointCandidates.find(
    (candidate) => getStopPointHash(candidate) === quayHash,
  );

  if (!stopPoint) {
    throw new Error(
      `No StopPoint found matching the Quay's hash(${quayHash})! Data: ${JSON.stringify({ quay, stopPointCandidates }, null, 2)}`,
    );
  }

  return { tag, stopPoint };
}

type StopPointsByQuayTag = Readonly<Record<string, StopPointType>>;

async function resolveStopPointRefs(
  stopPlace: Partial<StopRegistryStopPlaceInput>,
): Promise<StopPointsByQuayTag> {
  const stopPointRefPromises = stopPlace.quays
    ?.filter((quay) => quay !== null)
    .map(async (quay): Promise<QuayRefAndStopPoint> => {
      const label = quay.publicCode ?? 'error';
      // Find related scheduled stop points.
      const stopPointResult = (await hasuraApi(
        mapToGetStopPointByLabelQuery(label),
      )) as GetStopPointByLabelResult;

      const stopPointCandidates =
        stopPointResult?.data?.service_pattern_scheduled_stop_point ?? [];

      return resolveStopPointForQuay(quay, stopPointCandidates);
    })
    .filter((a) => !!a);

  if (!stopPointRefPromises) {
    throw new Error(
      `Unable to for create stop points for ${stopPlace.publicCode}`,
    );
  }
  const stopPointTuples = await Promise.all(stopPointRefPromises);

  return Object.fromEntries(
    stopPointTuples.map((spr) => [spr.tag, spr.stopPoint]),
  );
}

type QuayTagToStopPointId = Readonly<Record<string, UUID>>;
function getStopPointLabelToIdMapping(
  stopPointRefs: StopPointsByQuayTag,
): QuayTagToStopPointId {
  return Object.fromEntries(
    Object.entries(stopPointRefs).map((spr) => [
      spr[0],
      spr[1].scheduled_stop_point_id,
    ]),
  );
}

function getKeyValuesFromStopPoint(
  stopPointRefs: StopPointsByQuayTag,
  quayTag: string,
): Array<StopRegistryKeyValuesInput> {
  const ref = stopPointRefs[quayTag];
  if (!ref) {
    throw new Error(`Stop point not found for quayTag(${quayTag})`);
  }

  return [
    {
      key: KnownValueKey.Priority,
      values: [ref.priority.toString(10)],
    },
    {
      key: KnownValueKey.ValidityStart,
      values: [ref.validity_start],
    },
    {
      key: KnownValueKey.ValidityEnd,
      values: [ref.validity_end],
    },
  ];
}

function patchQuayIfNeeded(
  stopPointRefs: StopPointsByQuayTag,
  stopPointsRequired: boolean,
  quay: StopRegistryQuayInput,
): StopRegistryQuayInput {
  if (!stopPointsRequired) {
    return quay;
  }

  return {
    ...quay,
    keyValues: [
      ...compact(quay.keyValues),
      ...getKeyValuesFromStopPoint(stopPointRefs, findQuayTag(quay)),
    ],
  };
}

function combineKeyValues(
  ...keyValueLists: ReadonlyArray<
    ReadonlyArray<InputMaybe<StopRegistryKeyValuesInput>> | null | undefined
  >
): Array<StopRegistryKeyValuesInput> {
  return uniqBy(keyValueLists.map(compact).flat(1), 'key');
}

function assembleStopPlace(
  stopPlace: Partial<StopRegistryStopPlaceInput>,
  patchedQuays: Array<StopRegistryQuayInput>,
): StopRegistryStopPlaceInput {
  return {
    ...stopPlace,
    quays: patchedQuays.length ? patchedQuays : [null],
    keyValues: combineKeyValues(
      [
        {
          key: KnownValueKey.Priority,
          values: ['10'],
        },
        {
          key: KnownValueKey.ValidityStart,
          values: ['2000-01-01'],
        },
        {
          key: KnownValueKey.ValidityEnd,
          values: ['2052-01-01'],
        },
      ],
      stopPlace.keyValues,
    ),
  };
}

async function insertStopPlaceAndUpdateStopPointIfNeededTo(
  stopPlace: StopRegistryStopPlaceInput,
  stopPointsRequired: boolean,
  scheduledStopPoints: QuayTagToStopPointId,
): Promise<StopPlaceNetexRef> {
  if (stopPointsRequired) {
    return insertStopPlaceForScheduledStopPoint({
      stopPlace,
      scheduledStopPoints,
    });
  }

  const insertStopPlaceResult = (await hasuraApi(
    mapToInsertStopPlaceMutation(stopPlace),
  )) as InsertStopPlaceResult;
  return getStopPlaceAndQuayRefsFromInsertResult(
    stopPlace.privateCode?.value ?? 'error',
    insertStopPlaceResult,
  );
}

function tagQuays(
  stopPlace: Partial<StopRegistryStopPlaceInput>,
): Partial<StopRegistryStopPlaceInput> {
  if (stopPlace.quays?.length) {
    return {
      ...stopPlace,
      quays: compact(stopPlace.quays).map((quay) => ({
        ...quay,
        keyValues: combineKeyValues(quay.keyValues, [
          {
            key: testQuayIdentityTag,
            values: [Math.random().toString(10).substring(2)],
          },
        ]),
      })),
    };
  }

  return stopPlace;
}

const insertStopPlace = async ({
  stopPlace,
  stopPointsRequired,
}: {
  stopPlace: Partial<StopRegistryStopPlaceInput>;
  stopPointsRequired: boolean;
}): Promise<StopPlaceNetexRef> => {
  const taggedStopPlace = tagQuays(stopPlace);

  const stopPointRefs = stopPointsRequired
    ? await resolveStopPointRefs(taggedStopPlace)
    : {};
  const stopPointLabelToIdMapping = getStopPointLabelToIdMapping(stopPointRefs);

  const patchQuay = (quay: StopRegistryQuayInput) =>
    patchQuayIfNeeded(stopPointRefs, stopPointsRequired, quay);

  try {
    // TODO: Scheduled Stop Point should be per Quay (new Timat stop), not per Stop Place (new Tiamat Stop Area)
    const patchedQuays = compact(taggedStopPlace.quays).map(patchQuay);
    const stopPlaceInput = assembleStopPlace(taggedStopPlace, patchedQuays);

    return await insertStopPlaceAndUpdateStopPointIfNeededTo(
      stopPlaceInput,
      stopPointsRequired,
      stopPointLabelToIdMapping,
    );
  } catch (error) {
    console.error(
      'An error occurred while inserting stop place!',
      taggedStopPlace.privateCode,
      taggedStopPlace,
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
  stopPointsRequired: boolean,
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
    const netexRef = await insertStopPlace({ stopPlace, stopPointsRequired });
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

export const fetchStopPlaceIdsAndLabels = async () => {
  const stopIds: StopPlaceIdsByName = {};

  const stopPlaceFetchResult = (await hasuraApi(
    mapToGetAllStopPlaceLabelsAndIds(),
  )) as GetAllStopPlaceLabelsAndIdsResult;

  stopPlaceFetchResult.data.stop_registry.stopPlace.forEach((stop) => {
    if (stop.privateCode.value !== null) {
      stopIds[stop.privateCode.value] = stop.id;
    }
  });

  return stopIds;
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
