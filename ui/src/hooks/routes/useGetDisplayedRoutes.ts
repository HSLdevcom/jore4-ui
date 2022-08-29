import { gql } from '@apollo/client';
import { useEffect } from 'react';
import {
  useGetLineRoutesByLabelQuery,
  useGetRouteByIdQuery,
  useGetRouteDetailsByLabelsQuery,
} from '../../generated/graphql';
import { Operation } from '../../redux';
import {
  constructActiveDateGqlFilter,
  constructLabelGqlFilter,
} from '../../utils';
import { filterRoutesByHighestPriority } from '../line-details';
import { useLoader } from '../ui';
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

const GQL_GET_ROUTE_BY_ID = gql`
  query GetRouteById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...displayed_route
    }
  }
`;

const GQL_DISPLAYED_ROUTE = gql`
  fragment displayed_route on route_route {
    route_id
    label
    validity_start
    validity_end
    priority
    direction
  }
`;

export const useGetDisplayedRoutes = () => {
  const { observationDate } = useObservationDateQueryParam();
  const { routeLabel, lineLabel, routeId } = useMapQueryParams();

  const { setIsLoading } = useLoader(Operation.FetchRoutes);

  // Get routes by ROUTE LABEL

  const routesByRouteLabelResult = useGetRouteDetailsByLabelsQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      labels: [routeLabel!],
      date: observationDate,
    },
    skip: !routeLabel,
  });

  const routesByRouteLabel = routesByRouteLabelResult.data?.route_route || [];

  // Get routes by LINE LABEL

  const lineFilters = {
    ...constructLabelGqlFilter(lineLabel),
  };

  const lineRouteFilters = {
    ...constructActiveDateGqlFilter(observationDate),
  };

  const routesByLineLabelResult = useGetLineRoutesByLabelQuery({
    variables: {
      lineFilters,
      lineRouteFilters,
    },
    skip: !lineLabel,
  });

  const routesByLineLabel =
    routesByLineLabelResult?.data?.route_line[0].line_routes || [];

  // Get routes by ROUTE ID

  const routesByRouteIdResult = useGetRouteByIdQuery({
    variables: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      routeId: routeId!,
    },
    skip: !routeId,
  });

  const routeByRouteId = routesByRouteIdResult.data?.route_route_by_pk;
  const routesByRouteId = routeByRouteId ? [routeByRouteId] : [];

  const routes = [
    ...routesByRouteLabel,
    ...routesByLineLabel,
    ...routesByRouteId,
  ];

  const displayedRoutes = filterRoutesByHighestPriority(routes);

  const isLoading =
    routesByRouteLabelResult.loading ||
    routesByLineLabelResult.loading ||
    routesByRouteIdResult.loading;

  useEffect(() => {
    /**
     * Here we sync route fetch query loading state with useLoader hook state.
     *
     * We could also use useLoader's immediatelyOn option instead of useEffect,
     * but using options to dynamically control loading state feels semantically wrong.
     */
    setIsLoading(isLoading);
  }, [setIsLoading, isLoading]);

  return {
    displayedRouteIds: displayedRoutes.map((route) => route.route_id),
  };
};
