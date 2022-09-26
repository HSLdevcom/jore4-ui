import flip from 'lodash/flip';
import uniq from 'lodash/uniq';
import { ScheduledStopPointAllFieldsFragment } from '../generated/graphql';

const sortStopsByTraversalForwards = <
  TStop extends ScheduledStopPointAllFieldsFragment,
>(
  stop1: TStop,
  stop2: TStop,
) =>
  stop1.relative_distance_from_infrastructure_link_start -
  stop2.relative_distance_from_infrastructure_link_start;

/**
 * Comparator for sorting stops of the same link based on the distance from the link start.
 * Note that the distances need to be inverted when the link is traversed backwards.
 * @param stops list of stops on a single infra link
 * @param isTraversalForwards the traversal direction of the route along the link
 */
export const sortStopsOnInfraLinkComparator = (isTraversalForwards: boolean) =>
  isTraversalForwards
    ? sortStopsByTraversalForwards
    : flip(sortStopsByTraversalForwards);

/**
 * Sort the stops on the same link according to the link traversal direction based on the
 * distance from the link start
 * @param stops list of stops on a single infra link
 * @param isTraversalForwards the traversal direction of the route along the link
 */
export const sortStopsOnInfraLink = <
  TStop extends ScheduledStopPointAllFieldsFragment,
>(
  stops: TStop[],
  isTraversalForwards: boolean,
) => stops.sort(sortStopsOnInfraLinkComparator(isTraversalForwards));

export const addOrRemoveStopLabelFromIncludedStops = (
  stops: string[],
  stop: string,
  belongsToJourneyPattern: boolean,
) =>
  belongsToJourneyPattern
    ? uniq([...stops, stop])
    : stops.filter((label) => label !== stop);
