import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import { useObservationDateQueryParam } from '..';
import {
  RouteValidityFragment,
  useGetRoutesWithStopsQuery,
} from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import { isDateInRange } from '../../time';
import { Priority } from '../../types/enums';
import {
  buildPriorityEqualGqlFilter,
  buildRouteLineLabelGqlFilter,
  mapToVariables,
} from '../../utils';

const isRouteActiveOnObservationDate = (
  route: RouteValidityFragment,
  observationDate: DateTime,
) => isDateInRange(observationDate, route.validity_start, route.validity_end);

export const useGetLineDraftDetails = () => {
  const { label } = useParams<{ label: string }>();

  const { observationDate } = useObservationDateQueryParam();

  // Get all draft routes by line label
  const routeFilters = {
    ...buildRouteLineLabelGqlFilter(label),
    ...buildPriorityEqualGqlFilter(Priority.Draft),
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

  return { routes: filteredRoutes };
};
