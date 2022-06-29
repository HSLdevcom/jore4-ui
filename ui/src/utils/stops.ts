import { ServicePatternScheduledStopPoint } from '../generated/graphql';

/** Sort the stops on the same link according to the link traversal direction */
export const sortStopsOnInfraLink = (
  stopPoints: ServicePatternScheduledStopPoint[],
  isTraversalForwards: boolean,
) =>
  stopPoints.sort((stop1, stop2) =>
    isTraversalForwards
      ? stop1.relative_distance_from_infrastructure_link_start -
        stop2.relative_distance_from_infrastructure_link_start
      : stop2.relative_distance_from_infrastructure_link_start -
        stop1.relative_distance_from_infrastructure_link_start,
  );
