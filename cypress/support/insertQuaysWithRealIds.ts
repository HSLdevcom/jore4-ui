import {
  StopRegistryQuayInput,
  getPrivateCodeGenerator,
  getQuayPublicCodeGenerator,
  insertStopPlaces,
} from '@hsl/jore4-test-db-manager';
import {
  InsertQuayInput,
  InsertQuayInputs,
  InsertQuaysResult,
  QuayTagToNetexId,
  QuayTagToPublicCode,
  QuayTagToShelters,
} from './types';

async function fillInIds<Tags extends string>(
  inputs: InsertQuayInputs<Tags>,
): Promise<InsertQuayInputs<Tags>> {
  const genPublicCode = getQuayPublicCodeGenerator();
  const genPrivateCode = getPrivateCodeGenerator('quay');

  const promisedEntriesWithIds = Object.entries<InsertQuayInput>(inputs).map<
    Promise<[Tags, InsertQuayInput]>
  >(async ([tag, { stopPlaceId, input }]) => {
    const [publicCode, privateCode] = await Promise.all([
      input.publicCode ?? genPublicCode(input.geometry),
      input.privateCode ??
        genPrivateCode().then((value) => ({
          type: 'HSL/JORE-4',
          value,
        })),
    ]);

    const quayWithIds: StopRegistryQuayInput = {
      ...input,
      publicCode,
      privateCode,
    };

    return [tag as Tags, { stopPlaceId, input: quayWithIds }];
  });

  return Object.fromEntries(
    await Promise.all(promisedEntriesWithIds),
  ) as InsertQuayInputs<Tags>;
}

async function updateQuayStopPlaces<Tags extends string>(
  inputsWithIds: InsertQuayInputs<Tags>,
) {
  const byStopPlace = Object.values<InsertQuayInput>(inputsWithIds).reduce<
    Record<string, Array<StopRegistryQuayInput>>
  >((r, { stopPlaceId, input }) => {
    return {
      ...r,
      [stopPlaceId]: (r[stopPlaceId] ?? []).concat(input),
    };
  }, {});

  const stopPlaceUpdates = Object.entries(
    byStopPlace,
  ).map<StopRegistryQuayInput>(([id, quays]) => ({ id, quays }));

  return insertStopPlaces(stopPlaceUpdates, false);
}

export async function insertQuaysWithRealIds<Tags extends string>(
  inputs: InsertQuayInputs<Tags>,
): Promise<InsertQuaysResult<Tags>> {
  const inputsWithIds = await fillInIds(inputs);
  const { collectedQuayDetails } = await updateQuayStopPlaces(inputsWithIds);

  const tagToPublicCode = Object.fromEntries(
    Object.entries<InsertQuayInput>(inputsWithIds).map(([tag, input]) => [
      tag,
      input.input.publicCode ?? '',
    ]),
  ) as QuayTagToPublicCode<Tags>;

  const tagToNetexId = Object.fromEntries(
    Object.entries<InsertQuayInput>(inputsWithIds).map(([tag, input]) => [
      tag,
      collectedQuayDetails[input.input.publicCode ?? ''].netexId ?? '',
    ]),
  ) as QuayTagToNetexId<Tags>;

  const tagToShelters = Object.fromEntries(
    Object.entries<InsertQuayInput>(inputsWithIds).map(([tag, input]) => [
      tag,
      (collectedQuayDetails[input.input.publicCode ?? ''].shelters ??
        []) as ReadonlyArray<string>,
    ]),
  ) as QuayTagToShelters<Tags>;

  return {
    inputs: inputsWithIds,
    tagToPublicCode,
    tagToNetexId,
    tagToShelters,
  };
}
