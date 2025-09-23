import compact from 'lodash/compact';
import {
  JourneyPatternRouteFieldsFragment,
  QuayDetailsFragment,
} from '../../../../../../generated/graphql';
import { parseDate } from '../../../../../../time';
import { EnrichedStopPlace } from '../../../../../../types';
import { useGetJourneyPatternsOfStopPointDuringTimePeriod } from '../../queries/useGetJourneyPatternsOfStopPointDuringTimePeriod';
import { useGetStopAreaVersionsLazy } from '../../queries/useGetStopAreaVersions';
import {
  OverlappingMultipleStopAreaVersions,
  StopAreaEditWouldMakeRouteInvalidError,
} from '../../types';

/**
 * Checks if the stop point validity is being shortened. Returns true if it is.
 */
const isStopPointValidityShortened = (
  originalStartDate: number,
  originalEndDate: number,
  newStartDate: number,
  newEndDate: number,
): boolean => {
  if (
    (newStartDate > originalEndDate && newEndDate > originalEndDate) ||
    newEndDate < originalStartDate
  ) {
    // No change to current stop point validity, nothing to check
    return false;
  }

  // Check if the new start date is later than the original start date OR
  // the new end date is earlier than the original end date
  return newStartDate > originalStartDate || newEndDate < originalEndDate;
};

const getEarliestRouteStartDate = (
  routes: ReadonlyArray<JourneyPatternRouteFieldsFragment>,
): number => {
  return routes.reduce((earliest, route) => {
    const routeStart =
      route.validity_start?.toMillis() ?? Number.NEGATIVE_INFINITY;

    return routeStart < earliest ? routeStart : earliest;
  }, Number.POSITIVE_INFINITY);
};

const getLatestRouteEndDate = (
  routes: ReadonlyArray<JourneyPatternRouteFieldsFragment>,
): number => {
  return routes.reduce((latest, route) => {
    const routeEnd = route.validity_end?.toMillis() ?? Number.POSITIVE_INFINITY;

    return routeEnd > latest ? routeEnd : latest;
  }, Number.NEGATIVE_INFINITY);
};

export const useAssertForCopyStopArea = () => {
  const getJourneyPatternsOfStopPointDuringTimePeriod =
    useGetJourneyPatternsOfStopPointDuringTimePeriod();
  const getStopAreaVersions = useGetStopAreaVersionsLazy();

  const checkWillQuayRoutesBeInvalidatedByChange = async (
    quay: QuayDetailsFragment,
    cutStartDate: string,
    cutEndDate: string | null,
    newStartDate: number,
    newEndDate: number,
  ) => {
    const stopPoint = quay.scheduled_stop_point;
    if (!stopPoint) {
      // No stop point, nothing to check
      return false;
    }

    const stopPointStartDate = stopPoint.validity_start;
    const stopPointEndDate = stopPoint.validity_end ?? null;
    if (!stopPointStartDate) {
      // No start date, should not happen
      return true;
    }

    const stopPointStartDateMillis = parseDate(stopPointStartDate).toMillis();
    const stopPointEndDateMillis =
      parseDate(stopPointEndDate)?.toMillis() ?? Number.POSITIVE_INFINITY;

    if (
      !isStopPointValidityShortened(
        stopPointStartDateMillis,
        stopPointEndDateMillis,
        newStartDate,
        newEndDate,
      )
    ) {
      // Stop point validity not shortened, nothing to check
      return false;
    }

    // Check against routes valid during the original stop point validity
    const journeyPatterns = await getJourneyPatternsOfStopPointDuringTimePeriod(
      stopPoint.label,
      stopPointStartDate,
      stopPointEndDate,
    );

    const routes = compact(
      journeyPatterns.map((item) => item.journey_pattern_route),
    );

    if (routes.length === 0) {
      // No routes using the stop point, nothing to check
      return false;
    }

    const cutStartMillis = parseDate(cutStartDate).toMillis();
    const cutEndMillis =
      parseDate(cutEndDate)?.toMillis() ?? Number.POSITIVE_INFINITY;

    // For comparison, take the earliest start date and the latest end date. When handling
    // cut start date and stop point start date, we want to use the more limiting of these
    // dates to handle more complex cases like when quay validity is different than the
    // area validity etc
    const earliestStartDate = Math.min(
      Math.max(cutStartMillis, stopPointStartDateMillis),
      newStartDate,
    );
    const latestEndDate = Math.max(
      Math.min(cutEndMillis, stopPointEndDateMillis),
      newEndDate,
    );

    // Check if the new validity would cut any route validity
    return (
      getEarliestRouteStartDate(routes) < earliestStartDate ||
      getLatestRouteEndDate(routes) > latestEndDate
    );
  };

  const assertNoOverlappingVersions = async (
    privateCode: string,
    currentVersionNetexId: string,
    validityStart: string,
    validityEnd?: string,
  ) => {
    const stopAreaVersionsResult = await getStopAreaVersions(privateCode);

    const mappedVersions = stopAreaVersionsResult.stopAreaVersions.map(
      (version) => ({
        netexId: version.netex_id,
        validityStart: version.validity_start,
        validityEnd: version.validity_end,
      }),
    );

    const currentVersionRemoved = mappedVersions.filter(
      (v) => v.netexId !== currentVersionNetexId,
    );

    const currentStart = parseDate(validityStart).toMillis();
    const currentEnd =
      parseDate(validityEnd)?.toMillis() ?? Number.POSITIVE_INFINITY;

    const overlap = currentVersionRemoved.some((version) => {
      const versionStart = version.validityStart.toMillis();
      const versionEnd =
        version.validityEnd?.toMillis() ?? Number.POSITIVE_INFINITY;

      //    If the new one ends before the current one has even started → No overlap
      // or If the new one starts after the current one has ended → No overlap
      if (versionEnd < currentStart || versionStart > currentEnd) {
        return false;
      }

      // Else there is at least one day of overlap.
      return true;
    });

    if (overlap) {
      throw new OverlappingMultipleStopAreaVersions(
        'Stop area versions overlap',
      );
    }
  };

  const assertRouteStaysValidAfterStopPointChanges = async (
    stopArea: EnrichedStopPlace,
    cutStartDate: string,
    cutEndDate: string | null,
    newStartDate: string,
    newEndDate: string | null,
  ): Promise<void> => {
    const newStartDateMillis = parseDate(newStartDate).toMillis();
    const newEndDateMillis =
      parseDate(newEndDate)?.toMillis() ?? Number.POSITIVE_INFINITY;

    const allQuays = compact(stopArea.quays);
    const quayCheckPromises = allQuays.map(async (quay) =>
      checkWillQuayRoutesBeInvalidatedByChange(
        quay,
        cutStartDate,
        cutEndDate,
        newStartDateMillis,
        newEndDateMillis,
      ),
    );

    const results = await Promise.all(quayCheckPromises);
    if (results.some((r) => r)) {
      throw new StopAreaEditWouldMakeRouteInvalidError();
    }
  };

  return {
    assertNoOverlappingVersions,
    assertRouteStaysValidAfterStopPointChanges,
  };
};
