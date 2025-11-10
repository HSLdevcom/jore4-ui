import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useResolveStopPlaceNetexIdsByLineIdsQuery } from '../../../../generated/graphql';
import { PagingInfo } from '../../../../types';
import { SortingInfo } from '../types';
import { useStopSearchResults } from '../utils/useStopSearchResults';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

const GQL_RESOLVE_STOP_PLACE_NETEXT_IDS_BY_ROUTE_IDS = gql`
  query ResolveStopPlaceNetexIdsByLineIds($routeIds: [uuid!]!) {
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
    .flatMap((line) => line.line_routes)
    .map((route) => route.route_id);

  const {
    loading: resolveStopPlaceIdsLoading,
    data: resolveStopPlaceIdsData,
    error: resolveStopPlaceIdsError,
    refetch: resolveStopPlaceIdsRefetch,
  } = useResolveStopPlaceNetexIdsByLineIdsQuery({
    variables: { routeIds },
  });

  const rawQuayIds =
    resolveStopPlaceIdsData?.stopPoints.map(
      (stopPoints) => stopPoints.stop_place_ref,
    ) ?? [];
  const quayIds = uniq(compact(rawQuayIds));

  const {
    stops,
    resultCount,
    loading: resultsLoading,
    error: resultsError,
    refetch: stopsRefetch,
  } = useStopSearchResults({
    where: { netex_id: { _in: quayIds } },
    skip: quayIds.length === 0,
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
