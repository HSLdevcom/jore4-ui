import flip from 'lodash/flip';
import { ServicePatternScheduledStopPoint } from '../generated/graphql';

const sortStopsByTraversalForwards = (
  stop1: ServicePatternScheduledStopPoint,
  stop2: ServicePatternScheduledStopPoint,
) =>
  stop1.relative_distance_from_infrastructure_link_start -
  stop2.relative_distance_from_infrastructure_link_start;

/**
 * Sort the stops on the same link according to the link traversal direction based on the
 * distance from the link start
 * @param stops list of stops on a single infra link
 * @param isTraversalForwards the traversal direction of the route along the link
 */
export const sortStopsOnInfraLink = (
  stops: ServicePatternScheduledStopPoint[],
  isTraversalForwards: boolean,
) =>
  stops.sort(
    isTraversalForwards
      ? sortStopsByTraversalForwards
      : flip(sortStopsByTraversalForwards),
  );
