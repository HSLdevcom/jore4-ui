import {
  PrivateCodeGeneratorFn,
  QuayPublicCodeGeneratorFn,
  StopRegistryQuayInput,
  getPrivateCodeGenerator,
  getQuayPublicCodeGenerator,
  insertStopPlaces,
} from '@hsl/jore4-test-db-manager';
import {
  InsertQuayInput,
  InsertQuayInputs,
  InsertQuaysResult,
  InsertQuaysWithRealIdsParams,
  QuayTagToNetexId,
  QuayTagToPublicCode,
  QuayTagToShelters,
} from './types';

type AsyncMappingMode = 'inParallel' | 'sequentially';

async function mapAsyncInParallelOrSequentially<InputT, OutputT>(
  mode: AsyncMappingMode,
  inputs: ReadonlyArray<InputT>,
  mapperFn: (input: InputT) => Promise<OutputT>,
): Promise<Array<OutputT>> {
  if (mode === 'inParallel') {
    return Promise.all(inputs.map(mapperFn));
  }

  const mapped = new Array(inputs.length);
  for (let i = 0; i < inputs.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    mapped[i] = await mapperFn(inputs[i]);
  }

  return mapped;
}

type Generators = {
  readonly genPublicCode: QuayPublicCodeGeneratorFn;
  readonly genPrivateCode: PrivateCodeGeneratorFn;
};

async function fillInIdsForSingleInputQuay(
  { genPublicCode, genPrivateCode }: Generators,
  { stopPlaceId, input }: InsertQuayInput,
): Promise<InsertQuayInput> {
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

  return { stopPlaceId, input: quayWithIds };
}

async function fillInIds<Tags extends string>(
  inputs: InsertQuayInputs<Tags>,
  mappingMode: AsyncMappingMode,
): Promise<InsertQuayInputs<Tags>> {
  const generators: Generators = {
    genPublicCode: getQuayPublicCodeGenerator(),
    genPrivateCode: getPrivateCodeGenerator('quay'),
  };

  const inputEntries = Object.entries<InsertQuayInput>(inputs);

  const entriesWithIds = await mapAsyncInParallelOrSequentially(
    mappingMode,
    inputEntries,
    async ([tag, input]): Promise<[Tags, InsertQuayInput]> => [
      tag as Tags,
      await fillInIdsForSingleInputQuay(generators, input),
    ],
  );

  return Object.fromEntries(entriesWithIds) as InsertQuayInputs<Tags>;
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

export async function insertQuaysWithRealIds<Tags extends string>({
  inputs,
  generateIdsSequentially = false,
}: InsertQuaysWithRealIdsParams<Tags>): Promise<InsertQuaysResult<Tags>> {
  const inputsWithIds = await fillInIds(
    inputs,
    generateIdsSequentially ? 'sequentially' : 'inParallel',
  );
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
