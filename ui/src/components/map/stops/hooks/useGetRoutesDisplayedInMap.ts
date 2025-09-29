import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  RouteRouteBoolExp,
  useGetLineRoutesByLabelQuery,
  useGetRouteByFiltersQuery,
} from '../../../../generated/graphql';
import { Operation } from '../../../../redux';
import {
  buildActiveDateGqlFilter,
  buildLabelGqlFilter,
  buildLabelInGqlFilter,
  buildPriorityInGqlFilter,
} from '../../../../utils';
import { useMapDataLayerLoader } from '../../../common/hooks';
import { filterRoutesByHighestPriority } from '../../../routes-and-lines/line-details/useGetLineDetails';
import { useMapUrlStateContext } from '../../utils/mapUrlState';

const GQL_GET_LINE_ROUTES_BY_LABEL = gql`
  query GetLineRoutesByLabel(
    $lineFilters: route_line_bool_exp
    $lineRouteFilters: route_route_bool_exp
  ) {
    route_line(where: $lineFilters) {
      line_id
      line_routes(where: $lineRouteFilters) {
        ...displayed_route
      }
    }
  }
`;

const GQL_GET_ROUTE_BY_FILTERS = gql`
  query GetRouteByFilters($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      ...displayed_route
    }
  }
`;

const GQL_DISPLAYED_ROUTE = gql`
  fragment displayed_route on route_route {
    route_id
    label
    variant
    validity_start
    validity_end
    priority
    direction
    route_journey_patterns {
      journey_pattern_id
      scheduled_stop_point_in_journey_patterns {
        journey_pattern_id
        scheduled_stop_point_label
        scheduled_stop_point_sequence
      }
    }
  }
`;

export const useGetRoutesDisplayedInMap = () => {
  const {
    state: {
      displayedRoute: {
        routeLabels,
        lineLabel,
        routeId,
        showSelectedDaySituation,
        routePriorities,
      },
      filters: { observationDate },
    },
  } = useMapUrlStateContext();

  const routeFilters = {
    ...buildActiveDateGqlFilter(observationDate),
    ...(routePriorities ? buildPriorityInGqlFilter(routePriorities) : {}),
  };

  const skipRoutesByRouteInfoResult = !routeLabels?.length && !routeId;
  // Get routes by ROUTE LABEL OR ID
  const routesByRouteInfoResult = useGetRouteByFiltersQuery({
    variables: {
      routeFilters: {
        _and: [
          {
            _or: [
              routeLabels && buildLabelInGqlFilter(routeLabels),
              routeId && { route_id: { _eq: routeId } },
              // Remove undefined instances with filter
            ].filter((i) => i) as RouteRouteBoolExp[],
          },
          routeFilters,
        ],
      },
    },
    skip: skipRoutesByRouteInfoResult,
  });

  // Get routes by LINE LABEL
  const lineFilters = {
    ...buildLabelGqlFilter(lineLabel),
  };

  const skipRoutesByLineLabelResult = !lineLabel;
  const routesByLineLabelResult = useGetLineRoutesByLabelQuery({
    variables: {
      lineFilters,
      lineRouteFilters: routeFilters,
    },
    skip: skipRoutesByLineLabelResult,
  });

  const rawRoutesByRoute = routesByRouteInfoResult.data?.route_route;
  const rawLines = routesByLineLabelResult?.data?.route_line;

  const routes = useMemo(() => {
    const lineRoutes = rawLines?.flatMap((line) => line.line_routes);

    return [...(rawRoutesByRoute ?? []), ...(lineRoutes ?? [])];
  }, [rawRoutesByRoute, rawLines]);

  // If we choose not to show the situation on selected day,
  // do not filter routes
  const displayedRoutes = useMemo(
    () =>
      showSelectedDaySituation ? filterRoutesByHighestPriority(routes) : routes,
    [routes, showSelectedDaySituation],
  );

  const displayedRouteIds = useMemo(
    () => displayedRoutes.map((route) => route.route_id),
    [displayedRoutes],
  );

  const initialLoadDone =
    !!(
      routesByRouteInfoResult.previousData ??
      routesByRouteInfoResult.data ??
      routesByLineLabelResult.previousData ??
      routesByLineLabelResult.data
    ) ||
    (skipRoutesByRouteInfoResult && skipRoutesByLineLabelResult);
  const isLoading =
    routesByRouteInfoResult.loading || routesByLineLabelResult.loading;

  useMapDataLayerLoader(Operation.FetchRoutes, initialLoadDone, isLoading);

  return { displayedRoutes, displayedRouteIds, loading: isLoading };
};
