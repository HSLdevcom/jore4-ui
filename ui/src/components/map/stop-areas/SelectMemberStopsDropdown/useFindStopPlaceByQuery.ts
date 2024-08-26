import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import {
  StopsDatabaseStopPlaceNewestVersionBoolExp,
  useFindStopPlacesByQueryAndGroupQuery,
} from '../../../../generated/graphql';
import { buildSearchStopsGqlQueryVariables } from '../../../../hooks';
import { AllOptionEnum } from '../../../../utils';
import { stopAreaMemberStopSchema } from '../stopAreaFormSchema';

const limit = 20;

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

type FindStopPlaceByQueryState = {
  readonly offset: number;
  readonly allFetched: boolean;
};

function getDefaultState(): FindStopPlaceByQueryState {
  return {
    offset: 0,
    allFetched: false,
  };
}

function queryToWhere(
  query: string,
  editedStopAreaId: string | null | undefined,
): StopsDatabaseStopPlaceNewestVersionBoolExp {
  const baseWhere = buildSearchStopsGqlQueryVariables({
    elyNumber: '',
    municipalities: AllOptionEnum.All,
    labelOrName: query,
  });

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
  const [state, setState] =
    useState<FindStopPlaceByQueryState>(getDefaultState());

  useEffect(() => setState(getDefaultState()), [query]);

  const { data, fetchMore, loading } = useFindStopPlacesByQueryAndGroupQuery({
    variables: {
      where: queryToWhere(query, editedStopAreaId),
      offset: state.offset,
      limit,
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

  const fetchNextPage = () => {
    const nextOffset = state.offset + limit;
    setState({ offset: nextOffset, allFetched: false });
    return fetchMore({
      variables: { offset: nextOffset },
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        const previousItems = previousQueryResult?.stops_database?.stops ?? [];
        const newItems = fetchMoreResult?.stops_database?.stops ?? [];

        if (newItems.length < limit) {
          setState({ offset: nextOffset, allFetched: true });
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
    allFetched: state.allFetched || (rawStops?.length ?? 0) < limit,
  };
}
