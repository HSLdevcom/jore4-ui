import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSetObservationDateToUrl, useUrlQuery } from '..';
import {
  RouteRoute,
  useGetRoutesWithStopsQuery,
} from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import { isDateInRange, parseDate } from '../../time';
import { Priority } from '../../types/Priority';
import {
  constructPriorityEqualGqlFilter,
  constructRouteLineLabelGqlFilter,
  mapToVariables,
} from '../../utils';

const isRouteActiveOnObservationDate = (
  route: RouteRoute,
  observationDate: DateTime,
) => isDateInRange(observationDate, route.validity_start, route.validity_end);

export const useGetLineDraftDetails = () => {
  const { label } = useParams<{ label: string }>();

  const queryParams = useUrlQuery();
  const setObservationDateToUrl = useSetObservationDateToUrl();

  // useMemo hook is used because DateTime.now() is constantly changing
  // which causes unwanted re-triggers
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

  // Filter routes by observationDate in UI (and not in gql query) to avoid
  // unnecessary graphql queries which would cause the list to reload on every date change
  const filteredRoutes = routes.filter((route) =>
    isRouteActiveOnObservationDate(route, observationDate),
  );

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!queryParams.observationDate) {
      setObservationDateToUrl(DateTime.now().toISODate(), true);
    }
  }, [queryParams.observationDate, setObservationDateToUrl]);

  useEffect(() => {
    initializeObservationDate();
  }, [initializeObservationDate]);

  return { routes: filteredRoutes, observationDate };
};
