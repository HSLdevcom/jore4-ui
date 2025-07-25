import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useFindQuaysByQueryQuery } from '../../../../generated/graphql';
import { selectedStopSchema } from './schema';

const LIMIT = 5;

const GQL_FIND_QUAYS_BY_QUERY = gql`
  query findQuaysByQuery($cursor: bigint!, $limit: Int!, $query: String!) {
    stops_database {
      findStopsForTerminal(
        args: { query: $query }
        limit: $limit
        order_by: [{ cursor: asc }]
        where: { cursor: { _gt: $cursor } }
      ) {
        cursor
        stops
      }
    }
  }
`;

export function useFindQuaysByQuery(query: string) {
  const [allFetchedForQuery, setAllFetchedForQuery] = useState(false);

  useEffect(() => setAllFetchedForQuery(false), [query]);

  const { data, fetchMore, loading } = useFindQuaysByQueryQuery({
    variables: {
      query: `${query}%`,
      limit: LIMIT,
      cursor: 0,
    },
    skip: !query,
  });

  const { options, allQueryResults } = useMemo(() => {
    if (!data?.stops_database?.findStopsForTerminal) {
      return { options: [], allQueryResults: [] };
    }

    const allStops = data.stops_database.findStopsForTerminal.flatMap(
      (result) => result.stops ?? [],
    );

    const mappedStops = allStops.map((stop) => ({
      ...stop,
      validityEnd: stop.validityEnd ?? undefined,
      indefinite: !stop.validityEnd,
    }));

    const parsedStops = mappedStops
      .map((quay) => selectedStopSchema.safeParse(quay))
      .filter((result) => result.success)
      .map((result) => result.data);

    const matchingStops = parsedStops.filter((stop) =>
      stop.publicCode?.toLowerCase().includes(query.toLowerCase()),
    );

    return { options: matchingStops, allQueryResults: parsedStops };
  }, [data, query]);

  const findStopsResults = data?.stops_database?.findStopsForTerminal ?? [];
  const allFetched = allFetchedForQuery || findStopsResults.length < LIMIT;

  const fetchNextPage = () => {
    if (allFetched) {
      throw new Error('Nothing more to fetch!');
    }

    const lastCursor = findStopsResults.at(-1)?.cursor ?? 0;

    return fetchMore({
      variables: {
        cursor: lastCursor,
        query: `${query}%`,
        limit: LIMIT,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        const prevResults = prev?.stops_database?.findStopsForTerminal ?? [];
        const newResults =
          fetchMoreResult?.stops_database?.findStopsForTerminal ?? [];

        if (newResults.length < LIMIT) {
          setAllFetchedForQuery(true);
        }

        return {
          stops_database: {
            findStopsForTerminal: [...prevResults, ...newResults],
          },
        };
      },
    });
  };

  return { options, allQueryResults, loading, fetchNextPage, allFetched };
}
