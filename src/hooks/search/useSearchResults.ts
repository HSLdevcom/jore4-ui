import {
  RouteLine,
  RouteRoute,
  useSearchAllLinesQuery,
} from '../../generated/graphql';
import { mapSearchAllLinesResult } from '../../graphql';
import { constructGqlFilterObject, mapToVariables } from '../../utils';
import { useSearchQueryParser } from './useSearchQueryParser';

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

  const resultCount =
    (parsedQueryParameters.filter.displayRoutes
      ? routes?.length
      : lines?.length) || 0;

  return {
    lines,
    routes,
    resultCount,
  };
};
