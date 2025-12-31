import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useGetLineRouteStopIdsQuery } from '../../../../generated/graphql';

const GQL_GET_LINE_ROUTE_STOP_IDS = gql`
  query getLineRouteStopIds($routeIds: [uuid!]) {
    stopPoints: service_pattern_scheduled_stop_point(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: { on_route_id: { _in: $routeIds } }
        }
      }
    ) {
      scheduled_stop_point_id
      quay: newest_quay {
        netex_id
      }
    }
  }
`;

export function useGetLineRouteStopIds(routeIds: ReadonlyArray<UUID>) {
  const { data, error, ...rest } = useGetLineRouteStopIdsQuery({
    variables: { routeIds },
    skip: routeIds.length === 0,
  });

  const stopIds = compact(
    uniq(data?.stopPoints.map((stopPoint) => stopPoint.quay?.netex_id)),
  );

  return { stopIds, error, ...rest };
}
