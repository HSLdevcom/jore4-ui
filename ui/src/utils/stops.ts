import flip from 'lodash/flip';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import { DateTime } from 'luxon';
import {
  ScheduledStopPointAllFieldsFragment,
  ScheduledStopPointDefaultFieldsFragment,
} from '../generated/graphql';
import { Priority } from '../types/Priority';

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

export const isFutureStop = <
  TStop extends ScheduledStopPointDefaultFieldsFragment,
>(
  observationDate: DateTime,
  stop: TStop,
) => {
  // if stop has been valid indefinitely from the start, it can never be a future stop
  if (!stop.validity_start) {
    return false;
  }

  // otherwise its validity has to start after the observation date
  return stop.validity_start > observationDate;
};

export const isPastStop = <
  TStop extends ScheduledStopPointDefaultFieldsFragment,
>(
  observationDate: DateTime,
  stop: TStop,
) => {
  // if stop is valid indefinitely, it can never be a past stop
  if (!stop.validity_end) {
    return false;
  }

  // otherwise its validity has to end before the observation date
  return stop.validity_end < observationDate;
};

export const isCurrentStop = <
  TStop extends ScheduledStopPointDefaultFieldsFragment,
>(
  observationDate: DateTime,
  stop: TStop,
) => {
  return (
    !isPastStop(observationDate, stop) && !isFutureStop(observationDate, stop)
  );
};

export const hasPriority = <
  TStop extends ScheduledStopPointDefaultFieldsFragment,
>(
  priority: Priority,
  stop: TStop,
) => stop.priority === priority;

export const filterHighestPriorityCurrentStops = <
  TStop extends ScheduledStopPointDefaultFieldsFragment,
>(
  stops: TStop[],
  observationDate: DateTime,
  allowDrafts = false,
) => {
  // Get all current stops
  const currentStops = stops.filter(
    (stop: TStop) =>
      isCurrentStop(observationDate, stop) &&
      (allowDrafts || !hasPriority(Priority.Draft, stop)),
  );

  // Group stops by label
  const groupedCurrentStops = groupBy(currentStops, 'label');

  // Pick stop instance with the highest priority for each stop label
  return (
    Object.values(groupedCurrentStops)
      .flatMap((stopInstances) => maxBy(stopInstances, 'priority'))
      // if for some reason the given group is empty, filter out the undefined values
      .filter((stop) => !!stop) as TStop[]
  );
};
