import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import { DateTime } from 'luxon';
import { FilterableStopInfo } from '../types';
import { Priority } from '../types/enums';
import { isCurrentEntity } from './validity';

/**
 * Removes any stop instances from the array that are not valid for the
 * given observation date or that are not highest priority.
 *
 * What is important here is that
 * 1. the order of stops is preserved (e.g. order in which they are along the route geometry)
 * 2. we do not remove duplicate same priority instances stops from the array,
 * because same stop can be along the route geometry multiple times (e.g. loop in the geometry)
 */
export function filterHighestPriorityCurrentStops<
  TStop extends FilterableStopInfo,
>(
  stops: ReadonlyArray<TStop>,
  observationDate: DateTime,
  allowDrafts = false,
): Array<TStop> {
  // Get all current stops, remove drafts if they are not allowed
  const currentStops = stops.filter(
    (stop: TStop) =>
      isCurrentEntity(observationDate, stop) &&
      (allowDrafts || stop.priority !== Priority.Draft),
  );

  // Group stops by label
  const stopsGroupedByLabel = groupBy(currentStops, (stop) => stop.label);

  // Map out the highest priority stop instance from each group
  return Object.values(stopsGroupedByLabel).map((sameLabelStopInstances) =>
    // Non empty array always contains an element
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    maxBy(sameLabelStopInstances, 'priority')!,
  );
}
