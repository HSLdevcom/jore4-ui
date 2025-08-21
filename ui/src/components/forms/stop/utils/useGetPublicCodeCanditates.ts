import { gql } from '@apollo/client';
import { distance, lengthToDegrees } from '@turf/turf';
import type { Point } from 'geojson';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  GetExistingQuayPublicCodesQuery,
  useGetExistingQuayPublicCodesQuery,
} from '../../../../generated/graphql';

const GQL_GET_EXISTING_PUBLIC_CODES = gql`
  query GetExistingQuayPublicCodes(
    $newStopLocation: geometry!
    $distanceToNearbyStops: Float!
  ) {
    stopsDatabase: stops_database {
      municipality: stops_database_topographic_place(
        where: {
          topographic_place_type: { _eq: "MUNICIPALITY" }
          persistable_polygon: { polygon: { _st_contains: $newStopLocation } }
        }
        limit: 1 # There should be no overlapping municipalities
      ) {
        id
        name: name_value
      }

      usedPublicCodes: stops_database_quay(distinct_on: [public_code]) {
        id
        publicCode: public_code
      }

      nearbyStops: stops_database_quay(
        where: {
          centroid: {
            _st_d_within: {
              distance: $distanceToNearbyStops
              from: $newStopLocation
            }
          }
        }
        distinct_on: [public_code]
      ) {
        id
        publicCode: public_code
        centroid
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

const distanceToNearbyStops = lengthToDegrees(100, 'meters');

const candidateCount = 10;

type ExpectedPrefixResult = {
  readonly expectedPrefix: string;
  readonly municipality: string;
};

function useExpectedPrefix(
  data: GetExistingQuayPublicCodesQuery | undefined,
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

function useUsedPublicCodes(
  data: GetExistingQuayPublicCodesQuery | undefined,
): ReadonlySet<string> {
  const rawCodes = data?.stopsDatabase?.usedPublicCodes;
  return useMemo(
    () => new Set(compact(rawCodes?.map((it) => it.publicCode))),
    [rawCodes],
  );
}

type ValidStop = {
  readonly id: ExplicitAny;
  readonly centroid: Point;
  readonly publicCode: string;
};

function useNearbyStops(
  data: GetExistingQuayPublicCodesQuery | undefined,
  newStopLocation: Point,
): ReadonlyArray<string> {
  const rawCodes = data?.stopsDatabase?.nearbyStops;
  return useMemo(
    () =>
      compact(rawCodes)
        .filter(
          (it): it is ValidStop =>
            !!(it.centroid && it.centroid.type === 'Point' && it.publicCode),
        )
        .toSorted((a, b) => {
          const aDistance = distance(newStopLocation, a.centroid);
          const bDistance = distance(newStopLocation, b.centroid);
          return aDistance - bDistance;
        })
        .map((it) => it.publicCode),
    [rawCodes, newStopLocation],
  );
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

function generateCandidates(
  usedPublicCodes: ReadonlySet<string>,
  nearbyStops: ReadonlyArray<string>,
  query: string,
  expectedPrefix: string | null,
  count: number,
) {
  const matchingNearbyStops = query
    ? nearbyStops.filter((code) => code.startsWith(query))
    : nearbyStops;

  const candidates = new Set<string>();

  // Generate codes based on nearby stops.
  // eslint-disable-next-line no-restricted-syntax
  for (const nearbyStop of matchingNearbyStops) {
    if (candidates.size === count) {
      break;
    }

    const candidate = genNextPublicCode(usedPublicCodes, nearbyStop);
    if (candidate) {
      candidates.add(candidate);
    }
  }

  // Generate new generic codes, based on the input query or if nothing
  // has been entered yet, the location municipality is used instead.
  let lastCandidate: string | null = query || expectedPrefix;
  while (candidates.size < count && lastCandidate) {
    lastCandidate = genNextPublicCode(usedPublicCodes, lastCandidate);

    if (lastCandidate) {
      candidates.add(lastCandidate);
    }
  }

  return Array.from(candidates);
}

type GetPublicCodeCandidatesOpts = {
  readonly latitude: number;
  readonly longitude: number;
  readonly query: string;
  readonly skip: boolean;
};

type GetPublicCodeCandidatesResult = {
  readonly candidates: ReadonlyArray<string>;
  readonly expectedPrefix: string | null;
  readonly municipality: string | null;
  readonly loading: boolean;
};

/**
 * Provides 10 recommendations for Public Code of a new stop
 *
 * Starts by generating code candidates based on other stops that are located
 * close to the new stop (currently withing 100m radius).
 *
 * A potential candidate is generated from each close-by stop by:
 * 1. Sort the stops from closest to farthest away.
 * 2. Filter the close-by stops to include only those, that have their Public
 *    code start with the current user input. When empty all are included.
 * 3. Strip the municipality prefix from the stop's Public Code
 * 4. Increase the numeric value by 1 in a loop, until an unused code is found,
 *    but only until 9999.
 * 5. Add the candidate to the result set. Multiple stops could result in the
 *    same code if their codes are close to each other.
 * 6. Continue until we have 10 candidates or run out of stops.
 *
 * If there are still less than 10 candidates, generate extra ones simply based
 * on the user input and already used codes.
 * 1. Take the user input or the expected municipality prefix based on the stop's
 *    location. If there is no input, or the municipality prefix is unknown,
 *    nothing gets generated.
 * 2. Strip the municipality prefix from the user input, and pad the numeric
 *    portion to be 4 digits long `H12` → `1200`.
 * 3. Increase the numeric value by 1 in a loop, until an unused code is found,
 *    but only until 9999.
 * 4. Add the candidate to the result set. These might have already been generated
 *    from close-by stops.
 * 5. Continue until we have 10 candidates or hit code 9999.
 *
 * The algorithm is eager and can generate candidates that do not fully match
 * the users input, but such candidates will be filtered out by the browser's
 * autocomplete feature.
 *
 * @param latitude coordinate of the newly created stop
 * @param longitude coordinate of the newly created stop
 * @param query current user input in the Public Code field of the form
 * @param skip fetching of candidates when editing an existing stop
 */
export function useGetPublicCodeCandidates({
  latitude,
  longitude,
  query: uncleanQuery,
  skip,
}: GetPublicCodeCandidatesOpts): GetPublicCodeCandidatesResult {
  const query = uncleanQuery.trim();
  const newStopLocation: Point = useMemo(
    () => ({
      type: 'Point',
      coordinates: [longitude, latitude],
    }),
    [latitude, longitude],
  );

  const { data, loading } = useGetExistingQuayPublicCodesQuery(
    skip
      ? { skip }
      : {
          variables: { distanceToNearbyStops, newStopLocation },
        },
  );

  const { expectedPrefix = null, municipality = null } =
    useExpectedPrefix(data) ?? {};
  const usedPublicCodes = useUsedPublicCodes(data);
  const nearbyStops = useNearbyStops(data, newStopLocation);

  const candidates = useMemo(
    () =>
      generateCandidates(
        usedPublicCodes,
        nearbyStops,
        query,
        expectedPrefix,
        candidateCount,
      ),
    [usedPublicCodes, nearbyStops, query, expectedPrefix],
  );

  return { candidates, expectedPrefix, municipality, loading };
}
