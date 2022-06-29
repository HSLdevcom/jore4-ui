import { ServicePatternScheduledStopPoint } from '../generated/graphql';

const sortStopsByTraversalForwards = (
  stop1: ServicePatternScheduledStopPoint,
  stop2: ServicePatternScheduledStopPoint,
) =>
  stop1.relative_distance_from_infrastructure_link_start -
  stop2.relative_distance_from_infrastructure_link_start;

const sortStopsByTraversalBackwards = (
  stop1: ServicePatternScheduledStopPoint,
  stop2: ServicePatternScheduledStopPoint,
) =>
  stop2.relative_distance_from_infrastructure_link_start -
  stop1.relative_distance_from_infrastructure_link_start;

/** Sort the stops on the same link according to the link traversal direction */
export const sortStopsOnInfraLink = (
  stopPoints: ServicePatternScheduledStopPoint[],
  isTraversalForwards: boolean,
) =>
  stopPoints.sort(
    isTraversalForwards
      ? sortStopsByTraversalForwards
      : sortStopsByTraversalBackwards,
  );
