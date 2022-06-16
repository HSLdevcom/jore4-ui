import {
  RouteLine,
  RouteRoute,
  useSearchAllLinesAndRoutesQuery,
} from '../../generated/graphql';
import { mapSearchAllLinesAndRoutesResult } from '../../graphql';
import { constructGqlFilterObject, mapToVariables } from '../../utils';
import {
  DisplayedSearchResultType,
  useSearchQueryParser,
} from './useSearchQueryParser';

export const useSearchResults = (): {
  lines: RouteLine[];
  routes: RouteRoute[];
  resultCount: number;
} => {
  const parsedQueryParameters = useSearchQueryParser();

  const searchConditions = constructGqlFilterObject(
    parsedQueryParameters.search,
  );

  const result = useSearchAllLinesAndRoutesQuery(
    mapToVariables(searchConditions),
  );
  const { lines, routes } = mapSearchAllLinesAndRoutesResult(result);

  const getResultCount = () => {
    switch (parsedQueryParameters.filter.displayedData) {
      case DisplayedSearchResultType.Lines:
        return lines?.length;
      case DisplayedSearchResultType.Routes:
        return routes?.length;
      default:
        // eslint-disable-next-line no-console
        console.error(
          `Error: ${parsedQueryParameters.filter.displayedData} does not exist.`,
        );
        return 0;
    }
  };

  return {
    lines,
    routes,
    resultCount: getResultCount(),
  };
};
