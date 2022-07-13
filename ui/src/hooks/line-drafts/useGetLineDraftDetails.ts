import { DateTime } from 'luxon';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useObservationDateQueryParam, useUrlQuery } from '..';
import {
  RouteRoute,
  useGetRoutesWithStopsQuery,
} from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import { isDateInRange } from '../../time';
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

  const { queryParams } = useUrlQuery();
  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();

  // Get all draft routes by line label
  const routeFilters = {
    ...constructRouteLineLabelGqlFilter(label),
    ...constructPriorityEqualGqlFilter(Priority.Draft),
  };

  const result = useGetRoutesWithStopsQuery(mapToVariables({ routeFilters }));

  const routes = mapRouteResultToRoutes(result);

  // Filter routes by observationDate in UI (and not in gql query) to avoid
  // unnecessary graphql queries which would cause the list to reload on every date change
  const filteredRoutes = observationDate
    ? routes.filter((route) =>
        isRouteActiveOnObservationDate(route, observationDate),
      )
    : [];

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!queryParams.observationDate) {
      setObservationDateToUrl(DateTime.now().toISODate(), true);
    }
  }, [queryParams.observationDate, setObservationDateToUrl]);

  useEffect(() => {
    initializeObservationDate();
  }, [initializeObservationDate]);

  return { routes: filteredRoutes };
};
