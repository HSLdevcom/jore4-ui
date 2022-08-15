import { DateTime } from 'luxon';
import { useGetRouteDetailsByLabelWildcardQuery } from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import { Priority } from '../../types/Priority';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';

export const useChooseRouteDropdown = (
  query: string,
  observationDate: DateTime,
  priorities: Priority[],
) => {
  const routesResult = useGetRouteDetailsByLabelWildcardQuery(
    mapToVariables({
      label: `${mapToSqlLikeValue(query)}%`,
      date: observationDate.toISO(),
      priorities,
    }),
  );
  const routes = mapRouteResultToRoutes(routesResult);

  return routes;
};
