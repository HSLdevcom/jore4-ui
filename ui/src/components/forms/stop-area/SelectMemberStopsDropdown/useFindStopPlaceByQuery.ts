import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import {
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useFindStopPlacesByQueryAndGroupQuery,
} from '../../../../generated/graphql';
import { buildSearchStopByLabelOrNameFilter } from '../../../../utils';
import { stopAreaMemberStopSchema } from '../stopAreaFormSchema';

const LIMIT = 20;

const GQL_FIND_STOP_PLACES_BY_QUERY_AND_GROUP_QUERY = gql`
  query findStopPlacesByQueryAndGroup(
    $offset: Int!
    $limit: Int!
    $where: stops_database_stop_place_newest_version_bool_exp
  ) {
    stops_database {
      stops: stops_database_stop_place_newest_version(
        where: $where
        offset: $offset
        limit: $limit
        # Hasura does not allow order-by on cross DB relation.
        # So in practice the results are unsorted from user point of view.
        order_by: [{ name_value: asc }]
      ) {
        id
        netex_id
        name_lang
        name_value
        scheduled_stop_point: scheduled_stop_point_instance {
          scheduled_stop_point_id
          label
        }
      }
    }
  }
`;

function buildMemberStopGqlFilter(
  query: string,
  editedStopAreaId: string | null | undefined,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const baseWhere = buildSearchStopByLabelOrNameFilter(`${query}%`);

  const notInGroup: StopsDatabaseStopPlaceNewestVersionBoolExp = {
    _not: { group_of_stop_places_members: {} },
  };
  const inEdited: StopsDatabaseStopPlaceNewestVersionBoolExp | null =
    editedStopAreaId
      ? {
          group_of_stop_places_members: {
            group_of_stop_place: { netex_id: { _eq: editedStopAreaId } },
          },
        }
      : null;

  const notInAnotherGroup: StopsDatabaseStopPlaceNewestVersionBoolExp = inEdited
    ? { _or: [notInGroup, inEdited] }
    : notInGroup;

  return { _and: [baseWhere, notInAnotherGroup] };
}

export function useFindStopPlaceByQuery(
  query: string,
  editedStopAreaId: string | null | undefined,
) {
  const [allFetchedForQuery, setAllFetchedForQuery] = useState(false);
  useEffect(() => setAllFetchedForQuery(false), [query]);

  const { data, fetchMore, loading } = useFindStopPlacesByQueryAndGroupQuery({
    variables: {
      where: buildMemberStopGqlFilter(query, editedStopAreaId),
      offset: 0,
      limit: LIMIT,
    },
    skip: query === '',
  });

  const rawStops = data?.stops_database?.stops;

  const options = useMemo(
    () =>
      (rawStops ?? [])
        .map((stop) => ({
          id: stop.netex_id,
          name: {
            lang: stop.name_lang,
            value: stop.name_value,
          },
          scheduled_stop_point: stop.scheduled_stop_point,
        }))
        .map((rawStopPlace) => stopAreaMemberStopSchema.safeParse(rawStopPlace))
        .filter((parseResult) => parseResult.success)
        .map((parseResult) => parseResult.data),
    [rawStops],
  );

  const allFetched = allFetchedForQuery || (rawStops?.length ?? 0) < LIMIT;

  const fetchNextPage = () => {
    if (allFetched) {
      return Promise.reject(new Error('Nothing more to fetch!'));
    }

    return fetchMore({
      variables: { offset: rawStops?.length ?? 0 },
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        const previousItems = previousQueryResult?.stops_database?.stops ?? [];
        const newItems = fetchMoreResult?.stops_database?.stops ?? [];

        if (newItems.length < LIMIT) {
          setAllFetchedForQuery(true);
        }

        return {
          __typename: 'query_root',
          stops_database: {
            __typename: 'stops_database_stops_database_query',
            stops: [...previousItems, ...newItems],
          },
        };
      },
    });
  };

  return {
    options,
    loading,
    fetchNextPage,
    allFetched,
  };
}
