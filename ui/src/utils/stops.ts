import flip from 'lodash/flip';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';
import { ScheduledStopPointAllFieldsFragment } from '../generated/graphql';
import { FilterableStopInfo } from '../types';
import { Priority } from '../types/enums';
import { isCurrentEntity } from './validity';

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
  stops: Array<TStop>,
  isTraversalForwards: boolean,
) => stops.sort(sortStopsOnInfraLinkComparator(isTraversalForwards));

/**
 * Adds stops to or removes stops from the first stop parameter, depending on
 * belongsToJourneyPattern boolean.
 * @param stops list of stops to modify
 * @param stopsToActOn list of stops to add or remove
 * @param belongsToJourneyPattern should stops be added or removed. true to add, false to remove
 * @returns stops list with the provided stops added to or removed from it
 */
export const addOrRemoveStopLabelsFromIncludedStops = (
  stops: ReadonlyArray<string>,
  stopsToActOn: ReadonlyArray<string>,
  belongsToJourneyPattern: boolean,
) =>
  belongsToJourneyPattern
    ? uniq([...stops, ...stopsToActOn])
    : stops.filter((label) => !stopsToActOn.includes(label));

export const hasPriority = (
  priority: Priority,
  stop: { readonly priority: Priority },
) => stop.priority === priority;

/**
 * Removes any stop instances from the array that are not valid for the
 * given observation date or that are not highest priority.
 *
 * What is important here is that
 * 1. the order of stops is preserved (e.g. order in which they are along the route geometry)
 * 2. we do not remove duplicate same priority instances stops from the array,
 * because same stop can be along the route geometry multiple times (e.g. loop in the geometry)
 */
export const filterHighestPriorityCurrentStops = <
  TStop extends FilterableStopInfo,
>(
  stops: ReadonlyArray<TStop>,
  observationDate: DateTime,
  allowDrafts = false,
) => {
  // Get all current stops, remove drafts if they are not allowed
  const currentStops = stops.filter(
    (stop: TStop) =>
      isCurrentEntity(observationDate, stop) &&
      (allowDrafts || !hasPriority(Priority.Draft, stop)),
  );

  // Group stops by label
  const stopsGroupedByLabel = groupBy(currentStops, (stop) => stop.label);

  // Map out the highest priority stop instance from each group
  return Object.values(stopsGroupedByLabel).map(
    (sameLabelStopInstances) =>
      // Non empty array always contains an element
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      maxBy(sameLabelStopInstances, 'priority')!,
  );
};
