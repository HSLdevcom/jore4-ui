import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useFindStopPlaceByQueryStringQuery } from '../../../../generated/graphql';
import { stopAreaMemberStopSchema } from '../stopAreaFormSchema';

const GQL_FIND_STOP_PLACE_BY_QUERY_STRING_QUERY = gql`
  query findStopPlaceByQueryString($query: String!, $page: Int!) {
    stop_registry {
      stopPlace(query: $query, page: $page, size: 10) {
        id
        name {
          lang
          value
        }
        groups {
          id
        }
        ... on stop_registry_StopPlace {
          scheduled_stop_point {
            scheduled_stop_point_id
            label
          }
        }
      }
    }
  }
`;

type FindStopPlaceByQueryState = {
  readonly page: number;
  readonly allFetched: boolean;
};

function getDefaultState(): FindStopPlaceByQueryState {
  return {
    page: 0,
    allFetched: false,
  };
}

export function useFindStopPlaceByQuery(
  query: string,
  editedStopAreaId: string | null | undefined,
) {
  const [state, setState] =
    useState<FindStopPlaceByQueryState>(getDefaultState());

  useEffect(() => setState(getDefaultState()), [query]);

  const { data, fetchMore, loading } = useFindStopPlaceByQueryStringQuery({
    variables: { query: `%${query}`, page: 0 },
    skip: query === '',
  });

  const rawStopPlaces = data?.stop_registry?.stopPlace;

  const options = useMemo(
    () =>
      (rawStopPlaces ?? [])
        // Option id valid for selection if:
        // a) it belongs to no StopArea (group)
        // b) it already belongs to the Area under edit
        .filter(
          (rawStopPlace) =>
            (rawStopPlace?.groups?.length ?? 0) === 0 ||
            (editedStopAreaId &&
              rawStopPlace?.groups?.every(
                (group) => group?.id === editedStopAreaId,
              )),
        )
        .map((rawStopPlace) => stopAreaMemberStopSchema.safeParse(rawStopPlace))
        .filter((parseResult) => parseResult.success)
        .map((parseResult) => parseResult.data),
    [rawStopPlaces, editedStopAreaId],
  );

  const fetchNextPage = () => {
    const nextPage = state.page + 1;
    setState({ page: nextPage, allFetched: false });
    return fetchMore({
      variables: { page: nextPage },
      updateQuery: (previousQueryResult, { fetchMoreResult }) => {
        const previousItems =
          previousQueryResult.stop_registry?.stopPlace ?? [];
        const newItems = fetchMoreResult.stop_registry?.stopPlace ?? [];

        if (newItems.length < 10) {
          setState({ page: nextPage, allFetched: true });
        }

        return {
          __typename: 'query_root',
          stop_registry: {
            __typename: 'stop_registryStopPlaceRegister',
            stopPlace: [...previousItems, ...newItems],
          },
        };
      },
    });
  };

  return {
    options,
    loading,
    fetchNextPage,
    allFetched: state.allFetched || (rawStopPlaces?.length ?? 0) < 10,
  };
}
