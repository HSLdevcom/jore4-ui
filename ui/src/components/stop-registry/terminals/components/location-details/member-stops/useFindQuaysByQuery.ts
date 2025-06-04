import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import {
  MemberStopStopPlaceDetailsFragment,
  useFindQuaysByQueryQuery,
} from '../../../../../../generated/graphql';
import { selectedStopSchema } from '../location-details-form/schema';

const LIMIT = 10;

const GQL_FIND_QUAYS_BY_QUERY = gql`
  query findQuaysByQuery(
    $offset: Int!
    $limit: Int!
    $publicCodeFilter: String!
  ) {
    stops_database {
      stops: stops_database_stop_place_newest_version(
        where: {
          stop_place_quays: {
            quay: { public_code: { _ilike: $publicCodeFilter } }
          }
        }
        offset: $offset
        limit: $limit
        order_by: [{ public_code: asc }]
      ) {
        TiamatStopPlace {
          ...member_stop_stop_place_details
        }
      }
    }
  }

  fragment member_stop_stop_place_details on stop_registry_StopPlace {
    id
    name {
      value
    }
    quays {
      ...member_stop_quay_details
    }
  }

  fragment member_stop_quay_details on stop_registry_Quay {
    id
    publicCode
    scheduled_stop_point {
      scheduled_stop_point_id
      validity_start
      validity_end
    }
  }
`;

const isStopPlace = (
  item: unknown,
): item is MemberStopStopPlaceDetailsFragment => {
  return (
    typeof item === 'object' &&
    item !== null &&
    '__typename' in item &&
    // eslint-disable-next-line no-underscore-dangle
    (item as { __typename: string }).__typename === 'stop_registry_StopPlace' &&
    'quays' in item &&
    Array.isArray((item as MemberStopStopPlaceDetailsFragment).quays)
  );
};

function hasQuayMatchingQuery(
  stopPlace: MemberStopStopPlaceDetailsFragment,
  query: string,
): boolean {
  return (stopPlace.quays ?? []).some((quay) =>
    quay?.publicCode?.toLowerCase().includes(query.toLowerCase()),
  );
}

function createQuayOptions(stopPlace: MemberStopStopPlaceDetailsFragment) {
  return (stopPlace.quays ?? []).map((quay) => ({
    stopPlaceId: stopPlace.id,
    name: stopPlace.name?.value,
    quayId: quay?.id,
    publicCode: quay?.publicCode,
    validityStart: quay?.scheduled_stop_point?.validity_start?.toString() ?? '',
    validityEnd: quay?.scheduled_stop_point?.validity_end?.toString() ?? '',
    indefinite: false,
  }));
}

export function useFindQuaysByQuery(query: string) {
  const [allFetchedForQuery, setAllFetchedForQuery] = useState(false);

  useEffect(() => setAllFetchedForQuery(false), [query]);

  const { data, fetchMore, loading } = useFindQuaysByQueryQuery({
    variables: {
      publicCodeFilter: `${query}%`,
      offset: 0,
      limit: LIMIT,
    },
    skip: !query,
  });

  const options = useMemo(() => {
    if (!data?.stops_database?.stops) {
      return [];
    }

    const validStopPlaces = data.stops_database.stops
      .flatMap((stop) => stop.TiamatStopPlace ?? [])
      .filter(isStopPlace);

    const matchingQuays = validStopPlaces
      .filter((stopPlace) => hasQuayMatchingQuery(stopPlace, query))
      .flatMap((stopPlace) => createQuayOptions(stopPlace));

    return matchingQuays
      .map((quay) => selectedStopSchema.safeParse(quay))
      .filter((result) => result.success)
      .map((result) => result.data);
  }, [data, query]);

  const rawStops = data?.stops_database?.stops;
  const allFetched = allFetchedForQuery ?? (rawStops?.length ?? 0) < LIMIT;

  const fetchNextPage = () => {
    if (allFetched) {
      throw new Error('Nothing more to fetch!');
    }

    return fetchMore({
      variables: { offset: rawStops?.length ?? 0 },
      updateQuery: (prev, { fetchMoreResult }) => {
        const prevItems = prev?.stops_database?.stops ?? [];
        const newItems = fetchMoreResult?.stops_database?.stops ?? [];

        if (newItems.length < LIMIT) {
          setAllFetchedForQuery(true);
        }

        return {
          stops_database: {
            stops: [...prevItems, ...newItems],
          },
        };
      },
    });
  };

  return { options, loading, fetchNextPage, allFetched };
}
