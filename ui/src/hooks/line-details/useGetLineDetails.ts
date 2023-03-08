import { gql } from '@apollo/client';
import produce from 'immer';
import groupBy from 'lodash/groupBy';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineWithRoutesFragment,
  RouteDefaultFieldsFragment,
  RouteDirectionEnum,
  RouteLine,
  useGetHighestPriorityLineDetailsWithRoutesAsyncQuery,
  useGetLineDetailsWithRoutesByIdQuery,
  useGetLineValidityPeriodByIdAsyncQuery,
} from '../../generated/graphql';
import {
  mapLineDetailsWithRoutesResult,
  mapLineValidityPeriod,
} from '../../graphql';
import {
  buildActiveDateGqlFilter,
  buildDraftPriorityGqlFilter,
  buildLabelGqlFilter,
} from '../../utils';
import { getRouteLabelVariantText } from '../../utils/route';
import { useObservationDateQueryParam } from '../urlQuery';

const GQL_INFRASTRUCTURE_LINK_WITH_STOPS_FRAGMENT = gql`
  fragment infrastructure_link_with_stops on infrastructure_network_infrastructure_link {
    ...infrastructure_link_all_fields
    scheduled_stop_points_located_on_infrastructure_link(
      where: $routeStopFilters
    ) {
      ...scheduled_stop_point_all_fields
      other_label_instances {
        ...scheduled_stop_point_default_fields
      }
      scheduled_stop_point_in_journey_patterns {
        ...scheduled_stop_point_in_journey_pattern_all_fields
        journey_pattern {
          journey_pattern_id
          on_route_id
        }
      }
    }
  }
`;
/* 
const GQL_ROUTE_WITH_INFRASTRUCTURE_LINKS_WITH_JS_AND_STOPS_FRAGMENT = gql`
  fragment route_with_infrastructure_links_with_jps_and_stops on route_route {
    ...route_all_fields
    infrastructure_links_along_route {
      route_id
      infrastructure_link_id
      infrastructure_link_sequence
      is_traversal_forwards
      infrastructure_link {
        ...infrastructure_link_with_stops
      }
    }
    route_journey_patterns {
      journey_pattern_id
    }
  }
`; */

const GQL_LINE_WITH_ROUTES_FRAGMENT = gql`
  fragment line_with_routes on route_line {
    ...line_all_fields
    line_routes(where: $lineRouteFilters) {
      ...route_with_infrastructure_links_with_stops_and_jps
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
      ...line_with_routes
    }
  }
`;

const findHighestPriorityRoute = <TRoute extends RouteDefaultFieldsFragment>(
  routes: TRoute[],
) =>
  routes.reduce((prev, curr) => (prev.priority > curr.priority ? prev : curr));

/** Returns highest priority routes filtered by given direction */
const filterRoutesByHighestPriorityAndDirection = <
  TRoute extends RouteDefaultFieldsFragment,
>(
  direction: RouteDirectionEnum,
  routes: TRoute[],
): TRoute[] => {
  const routesFilteredByDirection = routes.filter(
    (route) => route.direction === direction,
  );
  const routesGroupedByLabelAndVariant = groupBy(
    routesFilteredByDirection,
    getRouteLabelVariantText,
  );

  const highestPriorityRoutes = Object.keys(routesGroupedByLabelAndVariant).map(
    (key) => findHighestPriorityRoute(routesGroupedByLabelAndVariant[key]),
  );

  return highestPriorityRoutes;
};

export const filterRoutesByHighestPriority = <
  TRoute extends RouteDefaultFieldsFragment,
>(
  lineRoutes: TRoute[],
): TRoute[] => {
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
};

const filterLineDetailsByDate = <TLine extends LineWithRoutesFragment>(
  line: TLine,
) => {
  const filteredRoutes = filterRoutesByHighestPriority(line?.line_routes);

  const filteredLine = produce(line, (draft) => {
    draft.line_routes = filteredRoutes;
  });

  return filteredLine;
};

/** Returns the initial observation date depending on the parameters. */
const getInitialDate = (
  validityStart?: DateTime | null,
  validityEnd?: DateTime | null,
) => {
  const isActiveToday =
    (!validityStart || validityStart <= DateTime.now().startOf('day')) &&
    (!validityEnd || validityEnd >= DateTime.now().startOf('day'));

  if (isActiveToday) {
    return DateTime.now().startOf('day');
  }
  return validityStart;
};

const buildLineDetailsGqlFilters = (
  line?: RouteLine,
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

/** Gets the line details depending on query parameters. */
export const useGetLineDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();

  const [getLineValidityPeriodByIdQuery] =
    useGetLineValidityPeriodByIdAsyncQuery();

  const [getHighestPriorityLineDetails] =
    useGetHighestPriorityLineDetailsWithRoutesAsyncQuery();

  const [line, setLine] = useState<LineWithRoutesFragment>();

  const lineDetailsResult = useGetLineDetailsWithRoutesByIdQuery({
    variables: { line_id: id },
  });

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!observationDate) {
      const result = await getLineValidityPeriodByIdQuery({ line_id: id });
      const lineDetails = mapLineValidityPeriod(result);
      if (lineDetails) {
        const initialDate = getInitialDate(
          lineDetails?.validity_start,
          lineDetails?.validity_end,
        );

        if (initialDate?.isValid) {
          setObservationDateToUrl(initialDate, true);
        }
      }
    }
  }, [
    getLineValidityPeriodByIdQuery,
    id,
    observationDate,
    setObservationDateToUrl,
  ]);

  /** Fetches line details and filters results by observation date */
  const fetchLineDetails = useCallback(async () => {
    if (lineDetailsResult?.data && observationDate?.isValid) {
      const lineDetails = mapLineDetailsWithRoutesResult(lineDetailsResult);

      const lineByDateResult = await getHighestPriorityLineDetails(
        buildLineDetailsGqlFilters(lineDetails, observationDate),
      );

      const lineByDate = lineByDateResult.data?.route_line.length
        ? lineByDateResult.data?.route_line[0]
        : undefined;

      const filteredLine = lineByDate
        ? filterLineDetailsByDate(lineByDate)
        : undefined;

      setLine(filteredLine);
    }
  }, [getHighestPriorityLineDetails, lineDetailsResult, observationDate]);

  useEffect(() => {
    initializeObservationDate();
  }, [initializeObservationDate]);

  useEffect(() => {
    fetchLineDetails();
  }, [fetchLineDetails]);

  console.log(JSON.stringify(line, null, 2));

  return {
    line,
  };
};
