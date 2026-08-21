import { gql } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import uniqWith from 'lodash/uniqWith';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  GetRouteInfoForTimetableVersionsQuery,
  RouteInfoForTimetableVersionFragment,
  RouteRouteBoolExp,
  useGetRouteInfoForTimetableVersionsQuery,
} from '../../../../generated/graphql';
import { getRouteLabelVariantText } from '../../../../utils';

const GQL_ROUTE_INFO_FOR_TIMETABLE_VERSION_FRAGMENT = gql`
  fragment RouteInfoForTimetableVersion on route_route {
    route_id
    label
    variant
    validity_start
    priority
    validity_end
    route_journey_patterns {
      journey_pattern_id
    }
  }
`;

const GQL_GET_ROUTE_INFO_FOR_TIMETABLE_VERSIONS = gql`
  query GetRouteInfoForTimetableVersions($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      ...RouteInfoForTimetableVersion
    }
  }
`;

/** Builds an object for gql to filter route by line label */
function buildRouteLineLabelGqlFilter(label: string): RouteRouteBoolExp {
  return { route_line: { label: { _eq: label } } };
}

/**
 * Builds an object for gql to filter out all
 * results which are not active on the given date range
 */
export function buildActiveDateRangeGqlFilter(
  startDate: DateTime,
  endDate: DateTime,
): RouteRouteBoolExp {
  return {
    _or: [
      {
        _and: [
          {
            _or: [
              { validity_start: { _lte: startDate } },
              { validity_start: { _is_null: true } },
            ],
          },
          {
            _or: [
              { validity_end: { _gte: startDate } },
              { validity_end: { _is_null: true } },
            ],
          },
        ],
      },
      {
        _and: [
          {
            _or: [
              { validity_start: { _lte: endDate } },
              { validity_start: { _is_null: true } },
            ],
          },
          {
            _or: [
              { validity_end: { _gte: startDate } },
              { validity_end: { _is_null: true } },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * Removes the second direction from the result, if there are two directions.
 * For Timetable versions we only want to have 1 row per route label because
 * the validities are the same for both directions.
 */
function removeSecondDirectionRouteFromResult(
  data: GetRouteInfoForTimetableVersionsQuery,
) {
  return uniqWith(
    data.route_route,
    (curr, next) =>
      curr.label === next.label &&
      curr.variant === next.variant &&
      curr.priority === next.priority &&
      curr.validity_start?.toISODate() === next.validity_start?.toISODate() &&
      curr.validity_end?.toISODate() === next.validity_end?.toISODate(),
  );
}

function groupByLabelAndVariant(
  routeInfo: ReadonlyArray<RouteInfoForTimetableVersionFragment>,
) {
  return groupBy(routeInfo, (route) => getRouteLabelVariantText(route));
}

function extractDistinctJourneyPatternIdsGroupedByRouteLabel(
  groupedDataByLabelAndVariant: Record<
    string,
    ReadonlyArray<RouteInfoForTimetableVersionFragment>
  >,
): Record<string, UUID[]> {
  return Object.entries(groupedDataByLabelAndVariant).reduce(
    (object, [key, value]) => {
      return {
        ...object,
        [key]: uniq(
          value
            .flatMap((route) => route.route_journey_patterns)
            .map((journeyPattern) => journeyPattern.journey_pattern_id),
        ),
      };
    },
    {},
  );
}

/**
 * Fetches one journey patterns per route (only one direction is enough) by line label for timetable versions.
 * Returns object which has route labelAndVariant as key and distinct journey pattern ids as value
 */
export function useGetJourneyPatternIdsByLineLabel({
  label,
  startDate,
  endDate,
}: {
  readonly label: string;
  readonly startDate: DateTime;
  readonly endDate: DateTime;
}) {
  const { data, ...rest } = useGetRouteInfoForTimetableVersionsQuery({
    variables: {
      routeFilters: {
        ...buildRouteLineLabelGqlFilter(label),
        ...buildActiveDateRangeGqlFilter(startDate, endDate),
      },
    },
  });

  const journeyPatternIdsGroupedByRouteLabel = useMemo(() => {
    if (!data) {
      return {};
    }

    const withSingleDirection = removeSecondDirectionRouteFromResult(data);
    const grouped = groupByLabelAndVariant(withSingleDirection);
    return extractDistinctJourneyPatternIdsGroupedByRouteLabel(grouped);
  }, [data]);

  return { ...rest, journeyPatternIdsGroupedByRouteLabel };
}
