import { gql } from '@apollo/client';
import {
  RouteRouteBoolExp,
  useGetLineRoutesByLabelQuery,
  useGetRouteByFiltersQuery,
} from '../../generated/graphql';
import { Operation } from '../../redux';
import {
  buildActiveDateGqlFilter,
  buildLabelGqlFilter,
  buildLabelInGqlFilter,
  buildPriorityInGqlFilter,
} from '../../utils';
import { filterRoutesByHighestPriority } from '../line-details';
import { useMapDataLayerLoader } from '../ui';
import { useMapQueryParams, useObservationDateQueryParam } from '../urlQuery';

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
  const { observationDate } = useObservationDateQueryParam();
  const {
    routeLabels,
    lineLabel,
    routeId,
    showSelectedDaySituation,
    priorities,
  } = useMapQueryParams();

  const routeFilters = {
    ...buildActiveDateGqlFilter(observationDate),
    ...(priorities ? buildPriorityInGqlFilter(priorities) : {}),
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

  const routesByRouteInfo = routesByRouteInfoResult.data?.route_route ?? [];

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

  const routesByLineLabel =
    routesByLineLabelResult?.data?.route_line.flatMap(
      (line) => line.line_routes,
    ) ?? [];

  const routes = [...routesByRouteInfo, ...routesByLineLabel];

  // If we choose not to show the situation on selected day,
  // do not filter routes
  const displayedRoutes = showSelectedDaySituation
    ? filterRoutesByHighestPriority(routes)
    : routes;

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

  return {
    displayedRouteIds: displayedRoutes.map((route) => route.route_id),
    displayedRoutes,
  };
};
