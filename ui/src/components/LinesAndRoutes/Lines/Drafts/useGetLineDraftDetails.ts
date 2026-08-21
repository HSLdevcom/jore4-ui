import { useGetRoutesWithStopsQuery } from '../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Priority } from '../../../../types/enums';
import {
  isRouteActiveOnObservationDate,
  useRequiredParams,
} from '../../../../utils';

export function useGetLineDraftDetails() {
  const { label } = useRequiredParams<{ label: string }>();

  const { observationDate } = useObservationDateQueryParam();

  const result = useGetRoutesWithStopsQuery({
    variables: {
      routeFilters: {
        route_line: { label: { _eq: label } },
        priority: { _eq: Priority.Draft },
      },
    },
  });

  const routes = result.data?.route_route ?? [];

  // Filter routes by observationDate in UI (and not in gql query) to avoid
  // unnecessary graphql queries which would cause the list to reload on every date change
  const filteredRoutes = observationDate
    ? routes.filter((route) =>
        isRouteActiveOnObservationDate(route, observationDate),
      )
    : [];

  return { routes: filteredRoutes };
}
