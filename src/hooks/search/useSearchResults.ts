import {
  RouteLine,
  RouteRoute,
  useSearchAllLinesQuery,
} from '../../generated/graphql';
import { mapSearchAllLinesResult } from '../../graphql';
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

  const linesResult = useSearchAllLinesQuery(mapToVariables(searchConditions));

  const lines = mapSearchAllLinesResult(linesResult);

  const routes = lines
    ?.map((line) => line.line_routes)
    ?.reduce((next, curr) => [...curr, ...next], []);

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
