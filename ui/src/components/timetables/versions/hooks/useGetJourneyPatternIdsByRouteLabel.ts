import { QueryResult, gql } from '@apollo/client';
import flow from 'lodash/flow';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import uniqWith from 'lodash/uniqWith';
import { DateTime } from 'luxon';
import {
  GetRouteInfoForTimetableVersionsQuery,
  RouteInfoForTimetableVersionFragment,
  useGetRouteInfoForTimetableVersionsQuery,
} from '../../../../generated/graphql';
import {
  buildActiveDateRangeGqlFilter,
  buildRouteLineLabelGqlFilter,
  getRouteLabelVariantText,
} from '../../../../utils';

const GQL_ROUTE_INFO_FOR_TIMETABLE_VERSION_FRAGMENT = gql`
  fragment route_info_for_timetable_version on route_route {
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
      ...route_info_for_timetable_version
    }
  }
`;

/**
 * Removes the second direction from the result, if there are two directions.
 * For Timetable versions we only want to have 1 row per route label because
 * the validities are the same for both directions.
 */
const removeSecondDirectionRouteFromResult = (
  result: QueryResult<GetRouteInfoForTimetableVersionsQuery>,
) =>
  uniqWith(
    result.data?.route_route,
    (curr, next) =>
      curr.label === next.label &&
      curr.variant === next.variant &&
      curr.priority === next.priority &&
      curr.validity_start?.toISODate() === next.validity_start?.toISODate() &&
      curr.validity_end?.toISODate() === next.validity_end?.toISODate(),
  );

const groupByLabelAndVariant = (
  routeInfo: ReadonlyArray<RouteInfoForTimetableVersionFragment>,
) => groupBy(routeInfo, (route) => getRouteLabelVariantText(route));

const extractDistinctJourneyPatternIdsGroupedByRouteLabel = (
  groupedDataByLabelAndVariant: Record<
    string,
    ReadonlyArray<RouteInfoForTimetableVersionFragment>
  >,
): Record<string, UUID[]> =>
  Object.entries(groupedDataByLabelAndVariant).reduce(
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

/**
 * Fetches one journey patterns per route (only one direction is enough) by line label for timetable versions.
 * Returns object which has route labelAndVariant as key and distinct journey pattern ids as value
 */
export const useGetJourneyPatternIdsByLineLabel = ({
  label,
  startDate,
  endDate,
}: {
  label: string;
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const routeFilters = {
    ...buildRouteLineLabelGqlFilter(label),
    ...buildActiveDateRangeGqlFilter(startDate, endDate),
  };

  const result = useGetRouteInfoForTimetableVersionsQuery({
    variables: { routeFilters },
  });

  const journeyPatternIdsGroupedByRouteLabel = flow(
    removeSecondDirectionRouteFromResult,
    groupByLabelAndVariant,
    extractDistinctJourneyPatternIdsGroupedByRouteLabel,
  )(result);

  return {
    journeyPatternIdsGroupedByRouteLabel,
    loading: result.loading,
  };
};
