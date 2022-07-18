import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  RouteRoute,
  useGetRoutesWithStopsQuery,
} from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import { parseDate } from '../../time';
import { Priority } from '../../types/Priority';
import {
  constructPriorityEqualGqlFilter,
  constructRouteLineLabelGqlFilter,
  mapToVariables,
} from '../../utils';
import { useUrlQuery } from '../useUrlQuery';

const filterRoutesByObservationDate = (
  routes: RouteRoute[],
  observationDate: DateTime,
) => {
  return routes.filter((route) => {
    const validityStart = route.validity_start;
    const validityEnd = route.validity_end;

    const isActiveOnObservationDate =
      (!validityStart || validityStart <= observationDate) &&
      (!validityEnd || validityEnd >= observationDate);

    return isActiveOnObservationDate;
  });
};

export const useGetLineDraftDetails = () => {
  const { label } = useParams<{ label: string }>();

  const { queryParams } = useUrlQuery();

  const observationDate = useMemo(
    () =>
      parseDate(queryParams.observationDate as string | undefined) ??
      DateTime.now(),
    [queryParams.observationDate],
  );

  // Get all draft routes by line label
  const routeFilters = {
    ...constructRouteLineLabelGqlFilter(label),
    ...constructPriorityEqualGqlFilter(Priority.Draft),
  };

  const result = useGetRoutesWithStopsQuery(mapToVariables({ routeFilters }));

  const routes = mapRouteResultToRoutes(result);

  // Filter routes by observationDate in front end (and not in gql query) to avoid
  // unnecessary graphql queries which would cause the list to reload on every date change
  const filteredRoutes = filterRoutesByObservationDate(routes, observationDate);

  return { routes: filteredRoutes, observationDate };
};
