import { gql } from '@apollo/client';
import {
  LineTableRowFragment,
  RouteDirectionEnum,
  RouteTableRowFragment,
  useSearchLinesAndRoutesQuery,
} from '../../../../generated/graphql';
import {
  DisplayedSearchResultType,
  buildSearchLinesAndRoutesGqlQueryVariables,
} from '../../../../utils';
import { useSearchQueryParser } from './useSearchQueryParser';

const GQL_SEARCH_LINES_AND_ROUTES = gql`
  query SearchLinesAndRoutes(
    $lineFilter: route_line_bool_exp
    $routeFilter: route_route_bool_exp
    $lineOrderBy: [route_line_order_by!]
    $routeOrderBy: [route_route_order_by!]
  ) {
    route_line(where: $lineFilter, order_by: $lineOrderBy) {
      ...LineTableRow
    }
    route_route(where: $routeFilter, order_by: $routeOrderBy) {
      ...RouteTableRow
    }
  }
`;

type UseSearchResultsResult = {
  readonly loading: boolean;
  readonly lines: ReadonlyArray<LineTableRowFragment>;
  /** Routes reduced to only have 1 direction per label */
  readonly reducedRoutes: ReadonlyArray<RouteTableRowFragment>;
  readonly routes: ReadonlyArray<RouteTableRowFragment>;
  readonly resultCount: number;
  readonly resultType: DisplayedSearchResultType;
};

export function useSearchResults(): UseSearchResultsResult {
  const parsedSearchQueryParameters = useSearchQueryParser();

  const { data, loading } = useSearchLinesAndRoutesQuery({
    variables: buildSearchLinesAndRoutesGqlQueryVariables(
      parsedSearchQueryParameters.search,
    ),
  });

  const lines = data?.route_line ?? [];
  const routes = data?.route_route ?? [];

  // Reduce routes to only have the 'Outbound' versions of the routes if there are two
  // versions of the route
  const reducedRoutes = routes.reduce(
    (acc: ReadonlyArray<RouteTableRowFragment>, current) => {
      const duplicateUniqueLabelExists = acc.some(
        (route) => route.unique_label === current.unique_label,
      );

      if (!duplicateUniqueLabelExists) {
        return [...acc, current];
      }

      // In case we have two directions of the same route, we want to show the details of
      // the Outbound routes. So if the 'current' is 'Outbound', it means that the
      // route inside 'acc' is 'Inbound' and needs to be replaced.
      if (current.direction === RouteDirectionEnum.Outbound) {
        const filtered = acc.filter(
          (r) => r.unique_label !== current.unique_label,
        );
        return [...filtered, current];
      }
      // If the 'current' is 'Inbound', it means that 'acc' already has the 'Outbound'
      // version of the route.
      return acc;
    },
    [],
  );

  const resultCounts: Record<DisplayedSearchResultType, number> = {
    [DisplayedSearchResultType.Lines]: lines.length,
    [DisplayedSearchResultType.Routes]: reducedRoutes.length,
  };
  const resultType = parsedSearchQueryParameters.filter.displayedType;

  return {
    loading,
    lines,
    reducedRoutes,
    routes,
    resultCount: resultCounts[resultType],
    resultType,
  };
}
