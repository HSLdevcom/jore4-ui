import {
  GetLineDetailsByIdQuery,
  InfraLinkAlongRouteDefaultFieldsFragment,
  RouteLine,
  RouteStopFieldsFragment,
  StopWithJourneyPatternFieldsFragment,
} from '../../../generated/graphql';
import { RouteInfraLink } from '../../../types';
import { StopPlaceState } from '../../../types/stop-registry';
import { illegalOptionalCast } from '../../../utils';

export function mapInfrastructureLinksAlongRouteToRouteInfraLinks<
  TLink extends InfraLinkAlongRouteDefaultFieldsFragment,
>(
  infraLinks: ReadonlyArray<TLink>,
): Array<RouteInfraLink<TLink['infrastructure_link']>> {
  return (
    infraLinks?.map((link) => ({
      ...link.infrastructure_link,
      is_traversal_forwards: link.is_traversal_forwards,
    })) ?? []
  );
}

// check if the stop belongs to any of the current route's journey patterns
export function stopBelongsToJourneyPattern(
  stop: StopWithJourneyPatternFieldsFragment,
  routeId: UUID,
) {
  return stop.scheduled_stop_point_in_journey_patterns.some(
    (item) => item.journey_pattern?.on_route_id === routeId,
  );
}

// Stops without a quay in the stop registry are considered to be in operation.
export function isStopInOperation(stop: RouteStopFieldsFragment) {
  return (
    !stop.newest_quay?.stop_state ||
    stop.newest_quay.stop_state === StopPlaceState.InOperation
  );
}

export function mapLineDetailsResult(
  data: GetLineDetailsByIdQuery | undefined,
) {
  return illegalOptionalCast<RouteLine>(data?.route_line_by_pk);
}
