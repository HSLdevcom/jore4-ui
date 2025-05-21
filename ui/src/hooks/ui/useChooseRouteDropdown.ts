import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useState } from 'react';
import {
  RouteAllFieldsFragment,
  useGetRouteDetailsByLabelWildcardQuery,
  useGetSelectedRouteDetailsByIdQuery,
} from '../../generated/graphql';
import { Priority } from '../../types/enums';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';
import { useDebouncedString } from '../useDebouncedString';

const GQL_GET_ROUTE_DETAILS_BY_LABEL_WILDCARD = gql`
  query GetRouteDetailsByLabelWildcard(
    $labelPattern: String!
    $date: date
    $priorities: [Int!]
  ) {
    route_route(
      limit: 7
      where: {
        label: { _ilike: $labelPattern }
        validity_start: { _lte: $date }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
        priority: { _in: $priorities }
      }
      order_by: { label: asc }
    ) {
      ...route_all_fields
    }
  }
`;

const GQL_GET_SELECTED_ROUTE_DETAILS_BY_ID = gql`
  query GetSelectedRouteDetailsById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...route_all_fields
    }
  }
`;

interface Props {
  query: string;
  observationDate: DateTime;
  priorities: ReadonlyArray<Priority>;
  routeId?: string;
}

export const useChooseRouteDropdown = ({
  query,
  observationDate,
  priorities,
  routeId,
}: Props) => {
  const [debouncedQuery] = useDebouncedString(query, 300);

  const [routes, setRoutes] = useState<RouteAllFieldsFragment[]>(Array);
  const routesResult = useGetRouteDetailsByLabelWildcardQuery(
    mapToVariables({
      labelPattern: `${mapToSqlLikeValue(debouncedQuery)}%`,
      date: observationDate.toISO(),
      priorities,
    }),
  );

  // It is possible that the selected line is not in the line search results,
  // fetch it separately by id here.
  const selectedRouteResult = useGetSelectedRouteDetailsByIdQuery({
    skip: !routeId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { routeId: routeId! },
  });

  if (
    !routesResult.loading &&
    routesResult.data &&
    routesResult.data?.route_route !== routes
  ) {
    setRoutes(routesResult.data.route_route);
  }

  const selectedRoute = selectedRouteResult.data?.route_route_by_pk as
    | RouteAllFieldsFragment
    | undefined;

  // While fetching the selected route, we can use the data from routes
  const displayedSelectedRoute = selectedRouteResult.loading
    ? routes.find((route) => route.route_id === routeId)
    : selectedRoute;

  return { routes, selectedRoute: displayedSelectedRoute };
};
