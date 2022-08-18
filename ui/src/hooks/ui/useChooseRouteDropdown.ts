import { gql } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import {
  RouteAllFieldsFragment,
  useGetRouteDetailsByLabelWildcardQuery,
  useGetSelectedRouteDetailsByIdQuery,
} from '../../generated/graphql';
import { Priority } from '../../types/Priority';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';

const GQL_GET_ROUTE_DETAILS_BY_LABEL_WILDCARD = gql`
  query GetRouteDetailsByLabelWildcard(
    $labelPattern: String!
    $date: timestamptz
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
  priorities: Priority[];
  routeId?: string;
}

export const useChooseRouteDropdown = ({
  query,
  observationDate,
  priorities,
  routeId,
}: Props) => {
  const routesResult = useGetRouteDetailsByLabelWildcardQuery(
    mapToVariables({
      labelPattern: `${mapToSqlLikeValue(query)}%`,
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

  const selectedRoute = selectedRouteResult.data?.route_route_by_pk as
    | RouteAllFieldsFragment
    | undefined;

  const queriedRoutes = (routesResult.data?.route_route ||
    []) as RouteAllFieldsFragment[];

  const selectedRouteIndex = queriedRoutes.findIndex(
    (item) => item.route_id === routeId,
  );

  // If no route is selected or selected route already is in the search results,
  // just return the search results.
  // Otherwise append selected route to search results.
  const routes =
    !selectedRoute || selectedRouteIndex !== -1
      ? queriedRoutes
      : [selectedRoute, ...queriedRoutes];

  return { routes: sortBy(routes, 'label') };
};
