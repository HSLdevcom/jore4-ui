import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useMemo } from 'react';
import { useResolveStopPlaceNetexIdsByLineIdsQuery } from '../../../../generated/graphql';
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

export function useResolveQuayIdsByLines(
  lines: ReadonlyArray<FindStopByLineInfo>,
) {
  const routeIds = lines
    .flatMap((line) => line.line_routes)
    .map((route) => route.route_id);

  const {
    loading,
    data: resolveStopPlaceIdsData,
    error,
    refetch,
  } = useResolveStopPlaceNetexIdsByLineIdsQuery({
    variables: { routeIds },
  });

  const quayIds = useMemo(() => {
    const rawQuayIds =
      resolveStopPlaceIdsData?.stopPoints.map(
        (stopPoints) => stopPoints.stop_place_ref,
      ) ?? [];

    return uniq(compact(rawQuayIds));
  }, [resolveStopPlaceIdsData]);

  return {
    quayIds,
    loading,
    error,
    refetch,
  };
}
