import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useResolveStopPlaceNetextIdsByLineIdsQuery } from '../../../../generated/graphql';
import { PagingInfo } from '../../../../types';
import { SortingInfo } from '../types';
import { useStopSearchResults } from '../utils/useStopSearchResults';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

const GQL_RESOLVE_STOP_PLACE_NETEXT_IDS_BY_ROUTE_IDS = gql`
  query ResolveStopPlaceNetextIdsByLineIds($routeIds: [uuid!]!) {
    stopPoints: service_pattern_scheduled_stop_point(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: { on_route_id: { _in: $routeIds } }
        }
        stop_place_ref: { _is_null: false }
      }
    ) {
      scheduled_stop_point_id
      stop_place_ref
    }
  }
`;

export function useGetStopSearchByLinesResult(
  lines: ReadonlyArray<FindStopByLineInfo>,
  pagingInfo: PagingInfo,
  sortingInfo: SortingInfo,
) {
  const routeIds = lines
    .map((line) => line.line_routes.map((route) => route.route_id))
    .flat(1);

  const {
    loading: resolveStopPlaceIdsLoading,
    data: resolveStopPlaceIdsData,
    error: resolveStopPlaceIdsError,
    refetch: resolveStopPlaceIdsRefetch,
  } = useResolveStopPlaceNetextIdsByLineIdsQuery({
    variables: { routeIds },
  });

  const rawStopPlaceIds =
    resolveStopPlaceIdsData?.stopPoints.map(
      (stopPlace) => stopPlace.stop_place_ref,
    ) ?? [];
  const stopPlaceIds = uniq(compact(rawStopPlaceIds));

  const {
    stops,
    resultCount,
    loading: resultsLoading,
    error: resultsError,
    refetch: stopsRefetch,
  } = useStopSearchResults({
    where: { netex_id: { _in: stopPlaceIds } },
    skip: stopPlaceIds.length === 0,
    pagingInfo,
    sortingInfo,
  });

  return {
    stops,
    resultCount,
    loading: resolveStopPlaceIdsLoading || resultsLoading,
    error: resolveStopPlaceIdsError ?? resultsError,
    resolveStopPlaceIdsInError: !!resolveStopPlaceIdsError,
    stopsInError: !!resultsError,
    resolveStopPlaceIdsRefetch,
    stopsRefetch,
  };
}
