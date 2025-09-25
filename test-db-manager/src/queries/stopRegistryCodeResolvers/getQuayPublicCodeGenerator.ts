// eslint-disable-next-line n/no-extraneous-import
import type { Point } from 'geojson';
import { gql } from 'graphql-tag';
import compact from 'lodash/compact';
import { getGqlString } from '../../builders/mutations/utils';
import {
  GetExistingQuayPublicCodesQuery,
  GetLocationMunicipalityQuery,
  GetLocationMunicipalityQueryVariables,
  StopRegistryGeoJsonInput,
} from '../../generated/graphql';
import { hasuraApi } from '../../hasuraApi';

const GQL_GET_LOCATION_MUNICIPALITY = gql`
  query GetLocationMunicipality($location: geometry!) {
    stopsDatabase: stops_database {
      municipality: stops_database_topographic_place(
        where: {
          topographic_place_type: { _eq: "MUNICIPALITY" }
          persistable_polygon: { polygon: { _st_contains: $location } }
        }
        # There should be no overlapping municipalities
        limit: 1
      ) {
        name: name_value
      }
    }
  }
`;

const GQL_GET_EXISTING_PUBLIC_CODES = gql`
  query GetExistingQuayPublicCodes {
    stopsDatabase: stops_database {
      usedPublicCodes: stops_database_quay(distinct_on: [public_code]) {
        publicCode: public_code
      }
    }
  }
`;

const knownMunicipalityPrefixes = {
  Helsinki: 'H',
  Vantaa: 'V',
  Espoo: 'E',
  Kauniainen: 'Ka',
  Siuntio: 'So',
  Kirkkonummi: 'Ki',
  Sipoo: 'Si',
  Kerava: 'Ke',
  Tuusula: 'Tu',
} as const;

function assertIsPoint(
  location: StopRegistryGeoJsonInput | Point | null | undefined,
): asserts location is Point {
  if (!location) {
    throw new Error(
      `Given location is not of type Point! Location: ${location}`,
    );
  }

  const json = JSON.stringify(location, null, 0);

  if (location.type !== 'Point') {
    throw new Error(`Given location is not of type Point! Location: ${json}`);
  }

  const coordinates = location.coordinates as unknown as readonly unknown[];
  if (!Array.isArray(location.coordinates)) {
    throw new Error(
      `Given location does not have a list of coordinates! Location: ${json}`,
    );
  }

  const [long, lat, ...unexpected] = coordinates;
  if (
    typeof long !== 'number' ||
    typeof lat !== 'number' ||
    unexpected.length
  ) {
    throw new Error(
      `Given location does not have a proper list of coordinates! Location: ${json}`,
    );
  }
}

type ExpectedPrefixResult = {
  readonly expectedPrefix: string;
  readonly municipality: string;
};

function getExpectedPrefix(
  data: GetLocationMunicipalityQuery | undefined,
): ExpectedPrefixResult | null {
  const municipality = data?.stopsDatabase?.municipality.at(0)?.name ?? '';

  if (municipality in knownMunicipalityPrefixes) {
    const expectedPrefix =
      knownMunicipalityPrefixes[
        municipality as keyof typeof knownMunicipalityPrefixes
      ];

    return { expectedPrefix, municipality };
  }

  return null;
}

function getUsedPublicCodes(
  data: GetExistingQuayPublicCodesQuery | undefined,
): Set<string> {
  const rawCodes = data?.stopsDatabase?.usedPublicCodes;
  return new Set(compact(rawCodes?.map((it) => it.publicCode)));
}

function genNextPublicCode(
  usedPublicCodes: ReadonlySet<string>,
  nextFrom: string,
): string | null {
  const regExpMatches = /(\p{Letter}+)(\d*)/u.exec(nextFrom);
  if (!regExpMatches) {
    return null;
  }

  const [, prefix, currentIndexStr] = regExpMatches;

  // Make sure we have a numeric code of at least 4 numbers.
  // Needed when generating code based on user input.
  const paddedIndexStr = currentIndexStr.padEnd(4, '0');
  const currentIndex = Number(paddedIndexStr);
  if (!Number.isSafeInteger(currentIndex)) {
    return null;
  }

  let nextIndex = currentIndex + 1;
  while (nextIndex <= 9999) {
    const candidate = `${prefix}${nextIndex.toString(10).padStart(4, '0')}`;
    if (!usedPublicCodes.has(candidate)) {
      return candidate;
    }
    nextIndex += 1;
  }

  return null;
}

type QuayPublicCodeGeneratorFn = (
  location: StopRegistryGeoJsonInput | Point | null | undefined,
) => Promise<string>;

async function resolveCodePrefixForLocation(
  location: StopRegistryGeoJsonInput | Point | null | undefined,
): Promise<ExpectedPrefixResult> {
  assertIsPoint(location);

  const { data } = await hasuraApi<
    GetLocationMunicipalityQuery,
    GetLocationMunicipalityQueryVariables
  >(
    {
      query: getGqlString(GQL_GET_LOCATION_MUNICIPALITY),
      variables: { location },
    },
    true,
  );

  const prefixInfo = getExpectedPrefix(data);
  if (!prefixInfo) {
    throw new Error(
      `Failed to resolve Municipality prefix for location(${location.coordinates})! Hasura response: ${JSON.stringify(data, null, 2)}`,
    );
  }

  return prefixInfo;
}

export function getQuayPublicCodeGenerator(): QuayPublicCodeGeneratorFn {
  // Initialize DB query, and perform it on the background.
  // Keep this top level function synchronous, by only capturing the Promise
  // without awaiting it here yet.
  const promisedUsedPublicCodes = hasuraApi<GetExistingQuayPublicCodesQuery>(
    { query: getGqlString(GQL_GET_EXISTING_PUBLIC_CODES) },
    true,
  )
    .then((result) => result.data)
    .then(getUsedPublicCodes);

  return async (
    location: StopRegistryGeoJsonInput | Point | null | undefined,
  ) => {
    const [{ expectedPrefix, municipality }, usedCodes] = await Promise.all([
      resolveCodePrefixForLocation(location),
      // Await the promised DB codes. Returns the same object (Set) each time
      // the Promise is awaited.
      promisedUsedPublicCodes,
    ]);
    const nextCode = genNextPublicCode(usedCodes, expectedPrefix);

    if (!nextCode) {
      throw new Error(
        `Unabled to generate new Quay PublicCode for location(${location?.coordinates}) on Municipality(${municipality})!`,
      );
    }

    usedCodes.add(nextCode);
    return nextCode;
  };
}
