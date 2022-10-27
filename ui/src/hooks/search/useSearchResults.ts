import { gql } from '@apollo/client';
import {
  LineTableRowFragment,
  RouteAllFieldsFragment,
  useSearchLinesAndRoutesQuery,
} from '../../generated/graphql';
import {
  buildSearchLinesAndRoutesGqlQueryVariables,
  DisplayedSearchResultType,
  mapToVariables,
} from '../../utils';
import { useSearchQueryParser } from './useSearchQueryParser';

const GQL_SEARCH_LINES_AND_ROUTES = gql`
  query SearchLinesAndRoutes(
    $lineFilter: route_line_bool_exp
    $routeFilter: route_route_bool_exp
    $lineOrderBy: [route_line_order_by!]
    $routeOrderBy: [route_route_order_by!]
  ) {
    route_line(where: $lineFilter, order_by: $lineOrderBy) {
      ...line_table_row
    }
    route_route(where: $routeFilter, order_by: $routeOrderBy) {
      ...route_all_fields
    }
  }
`;

export const useSearchResults = (): {
  lines: LineTableRowFragment[];
  routes: RouteAllFieldsFragment[];
  resultCount: number;
  resultType: DisplayedSearchResultType;
} => {
  const parsedSearchQueryParameters = useSearchQueryParser();

  const searchQueryVariables = buildSearchLinesAndRoutesGqlQueryVariables(
    parsedSearchQueryParameters.search,
  );

  const result = useSearchLinesAndRoutesQuery(
    mapToVariables(searchQueryVariables),
  );

  const lines = (result.data?.route_line || []) as LineTableRowFragment[];
  const routes = (result.data?.route_route || []) as RouteAllFieldsFragment[];

  const getResultCount = () => {
    switch (parsedSearchQueryParameters.filter.displayedData) {
      case DisplayedSearchResultType.Lines:
        return lines?.length;
      case DisplayedSearchResultType.Routes:
        return routes?.length;
      default:
        // eslint-disable-next-line no-console
        console.error(
          `Error: ${parsedSearchQueryParameters.filter.displayedData} does not exist.`,
        );
        return 0;
    }
  };

  return {
    lines,
    routes,
    resultCount: getResultCount(),
    resultType: parsedSearchQueryParameters.filter.displayedData,
  };
};
