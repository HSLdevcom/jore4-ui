import { useGetRoutesWithStopsQuery } from '../../../generated/graphql';
import {
  useObservationDateQueryParam,
  useRequiredParams,
} from '../../../hooks';
import { Priority } from '../../../types/enums';
import {
  buildPriorityEqualGqlFilter,
  buildRouteLineLabelGqlFilter,
  isRouteActiveOnObservationDate,
  mapToVariables,
} from '../../../utils';

export const useGetLineDraftDetails = () => {
  const { label } = useRequiredParams<{ label: string }>();

  const { observationDate } = useObservationDateQueryParam();

  // Get all draft routes by line label
  const routeFilters = {
    ...buildRouteLineLabelGqlFilter(label),
    ...buildPriorityEqualGqlFilter(Priority.Draft),
  };

  const result = useGetRoutesWithStopsQuery(mapToVariables({ routeFilters }));

  const routes = result.data?.route_route ?? [];

  // Filter routes by observationDate in UI (and not in gql query) to avoid
  // unnecessary graphql queries which would cause the list to reload on every date change
  const filteredRoutes = observationDate
    ? routes.filter((route) =>
        isRouteActiveOnObservationDate(route, observationDate),
      )
    : [];

  return { routes: filteredRoutes };
};
