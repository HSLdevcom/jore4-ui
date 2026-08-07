import { gql } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import {
  LineAllFieldsFragment,
  LineWithRoutesUniqueFieldsFragment,
  RouteDirectionEnum,
  RouteUniqueFieldsFragment,
  useGetHighestPriorityLineDetailsWithRoutesQuery,
  useGetLineDetailsByIdQuery,
} from '../../../generated/graphql';
import {
  useObservationDateQueryParam,
  useRequiredParams,
} from '../../../hooks';
import {
  buildActiveDateGqlFilter,
  buildDraftPriorityGqlFilter,
  buildLabelGqlFilter,
  getRouteLabelVariantText,
} from '../../../utils';

const GQL_INFRASTRUCTURE_LINK_WITH_STOPS_FRAGMENT = gql`
  fragment InfrastructureLinkWithStops on infrastructure_network_infrastructure_link {
    ...InfrastructureLinkAllFields
    scheduled_stop_points_located_on_infrastructure_link(
      where: $routeStopFilters
    ) {
      ...ScheduledStopPointAllFields
      other_label_instances {
        ...ScheduledStopPointDefaultFields
      }
      scheduled_stop_point_in_journey_patterns {
        ...ScheduledStopPointInJourneyPatternAllFields
        journey_pattern {
          journey_pattern_id
          on_route_id
        }
      }
    }
  }
`;

const GQL_LINE_WITH_ROUTES_FRAGMENT = gql`
  fragment LineWithRoutes on route_line {
    ...LineAllFields
    line_routes(where: $lineRouteFilters) {
      ...RouteWithInfrastructureLinksWithStopsAndJps
    }
  }
`;

const GQL_GET_HIGHEST_PRIORITY_LINE_DETAILS_WITH_ROUTES = gql`
  query GetHighestPriorityLineDetailsWithRoutes(
    $lineFilters: route_line_bool_exp
    $lineRouteFilters: route_route_bool_exp
    $routeStopFilters: service_pattern_scheduled_stop_point_bool_exp
  ) {
    route_line(where: $lineFilters, order_by: { priority: desc }, limit: 1) {
      ...LineWithRoutesUniqueFields
    }
  }
`;

function findHighestPriorityRoute<TRoute extends RouteUniqueFieldsFragment>(
  routes: ReadonlyArray<TRoute>,
) {
  return routes.reduce((prev, curr) =>
    prev.priority > curr.priority ? prev : curr,
  );
}

/** Returns highest priority routes filtered by given direction */
function filterRoutesByHighestPriorityAndDirection<
  TRoute extends RouteUniqueFieldsFragment,
>(direction: RouteDirectionEnum, routes: ReadonlyArray<TRoute>): TRoute[] {
  const routesFilteredByDirection = routes.filter(
    (route) => route.direction === direction,
  );
  const routesGroupedByLabelAndVariant = groupBy(
    routesFilteredByDirection,
    getRouteLabelVariantText,
  );

  return Object.keys(routesGroupedByLabelAndVariant).map((key) =>
    findHighestPriorityRoute(routesGroupedByLabelAndVariant[key]),
  );
}

export function filterRoutesByHighestPriority<
  TRoute extends RouteUniqueFieldsFragment,
>(lineRoutes: ReadonlyArray<TRoute>): TRoute[] {
  // TODO: what if RouteDirectionEnum is not Inbound or Outbound?
  // In that case we are currently just filtering those routes out!
  const filteredOutboundRoutes = filterRoutesByHighestPriorityAndDirection(
    RouteDirectionEnum.Outbound,
    lineRoutes,
  );

  const filteredInboundRoutes = filterRoutesByHighestPriorityAndDirection(
    RouteDirectionEnum.Inbound,
    lineRoutes,
  );

  return [...filteredOutboundRoutes, ...filteredInboundRoutes];
}

function filterLineDetailsByDate<
  TLine extends LineWithRoutesUniqueFieldsFragment,
>(line: TLine): TLine {
  return {
    ...line,
    line_routes: filterRoutesByHighestPriority(line?.line_routes),
  };
}

const buildLineDetailsGqlFilters = (
  line?: LineAllFieldsFragment,
  observationDate?: DateTime | null,
) => {
  const lineFilters = {
    ...buildLabelGqlFilter(line?.label),
    ...buildActiveDateGqlFilter(observationDate),
    ...buildDraftPriorityGqlFilter(line?.priority),
  };

  const lineRouteFilters = {
    ...buildActiveDateGqlFilter(observationDate),
    ...buildDraftPriorityGqlFilter(line?.priority),
  };

  const routeStopFilters = buildActiveDateGqlFilter(observationDate);

  return {
    lineFilters,
    lineRouteFilters,
    routeStopFilters,
  };
};

export enum LineFetchError {
  LINE_MISSING_DEFAULT = 'LINE_MISSING_DEFAULT',
  LINE_NOT_VALID_FOR_DAY = 'LINE_NOT_VALID_FOR_DAY',
}

/** Gets the line details depending on query parameters. */
export function useGetLineDetails() {
  const { id } = useRequiredParams<{ id: string }>();

  const { observationDate } = useObservationDateQueryParam();

  const [line, setLine] = useState<LineWithRoutesUniqueFieldsFragment | null>(
    null,
  );
  const [lineError, setLineError] = useState<LineFetchError | null>(null);

  const lineDetailsResult = useGetLineDetailsByIdQuery({
    variables: { line_id: id },
  });
  const lineDetails = lineDetailsResult.data?.route_line_by_pk;

  const highestPrioLineDetailsResult =
    useGetHighestPriorityLineDetailsWithRoutesQuery(
      lineDetails
        ? {
            variables: buildLineDetailsGqlFilters(lineDetails, observationDate),
          }
        : { skip: true },
    );

  const lineByDate = highestPrioLineDetailsResult.data?.route_line.at(0);

  useEffect(() => {
    if (lineDetails && !lineByDate) {
      setLineError(LineFetchError.LINE_NOT_VALID_FOR_DAY);
    }

    if (lineByDate) {
      setLine(filterLineDetailsByDate(lineByDate));
    } else {
      setLine(null);
    }
  }, [lineDetails, lineByDate]);

  return { line, lineError };
}
