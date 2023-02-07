import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  RouteAllFieldsFragment,
  useGetRouteDetailsByLabelWildcardQuery,
  useGetSelectedRouteDetailsByIdQuery,
} from '../../generated/graphql';
import { Priority } from '../../types/enums';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';

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

  const routes = (routesResult.data?.route_route ||
    []) as RouteAllFieldsFragment[];

  return { routes, selectedRoute };
};
