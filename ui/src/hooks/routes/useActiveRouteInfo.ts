import { gql } from '@apollo/client';
import flow from 'lodash/flow';
import {
  RouteMetadataFragment,
  RouteRoute,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../generated/graphql';
import { mapRouteResultToRoutes } from '../../graphql';
import { selectHasChangesInProgress, selectMapEditor } from '../../redux';
import { useAppSelector } from '../redux';
import { filterHighestPriorityCurrentStops } from '../stops';
import { useObservationDateQueryParam } from '../urlQuery';
import { mapRouteFormToInput } from './useEditRouteMetadata';
import { getRouteStops } from './useExtractRouteFromFeature';

const GQL_ROUTE_METADATA = gql`
  fragment route_metadata on route_route {
    name_i18n
    label
    priority
    validity_start
    validity_end
    direction
  }
`;

export const useActiveRouteInfo = () => {
  const { observationDate } = useObservationDateQueryParam();
  const { editedRouteData, selectedRouteId, creatingNewRoute } =
    useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  // Get selected route data
  const routesResult = useGetRoutesWithInfrastructureLinksQuery({
    // selectedRouteId must be defined, because query is skipped if selectedRouteId is undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { route_ids: [selectedRouteId!] },
    skip: !selectedRouteId,
  });
  const routes = mapRouteResultToRoutes(routesResult);
  const selectedRoute = routes?.[0];

  const routeMetadata: RouteMetadataFragment = creatingNewRoute
    ? // If we are creating a route, edited route metadata has been set
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mapRouteFormToInput(editedRouteData.metaData!)
    : selectedRoute;

  /*
   * Get array of route's RouteStops
   * Select the highest priority stop instances that are valid
   * at selected observation date
   */
  const getHighestPriorityRouteStops = flow(
    (route: RouteRoute) =>
      route.route_journey_patterns[0].scheduled_stop_point_in_journey_patterns,
    (stopsInJourneyPattern) =>
      stopsInJourneyPattern.flatMap((stop) => stop.scheduled_stop_points),
    (stops) => filterHighestPriorityCurrentStops(stops, observationDate, true),
    getRouteStops,
  );

  // If selectedRoute is not yet loaded or no route is selected,
  // do not try to get stops from route
  const selectedRouteStops = selectedRoute
    ? getHighestPriorityRouteStops(selectedRoute)
    : [];

  // If creating/editing a route, show edited route stops
  // otherwise show selected route's stops
  const routeStops = routeEditingInProgress
    ? editedRouteData.stops
    : selectedRouteStops;

  return { routeMetadata, routeStops };
};
