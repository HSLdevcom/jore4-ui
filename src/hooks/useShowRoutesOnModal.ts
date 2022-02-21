import { uniq } from 'lodash';
import { useContext } from 'react';
import { FormState as RouteFormState } from '../components/forms/RoutePropertiesForm';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';
import {
  GetRouteWithInfrastructureLinksDocument,
  GetRouteWithInfrastructureLinksQuery,
  GetRouteWithInfrastructureLinksQueryVariables,
  RouteRoute,
} from '../generated/graphql';
import {
  InfrastructureLinkAlongRoute,
  mapRoutesDetailsResult,
} from '../graphql';
import { mapToISODate } from '../time';
import { useAsyncQuery } from './useAsyncQuery';

const getRouteStopIds = (route: RouteRoute) => {
  return route.route_journey_patterns[0].scheduled_stop_point_in_journey_patterns.map(
    (point) => point.scheduled_stop_point_id,
  );
};

export const useShowRoutesOnModal = () => {
  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);

  const [fetchRouteDetails] = useAsyncQuery<
    GetRouteWithInfrastructureLinksQuery,
    GetRouteWithInfrastructureLinksQueryVariables
  >(GetRouteWithInfrastructureLinksDocument);

  const showRoutesOnModal = (routeIds: UUID[]) => {
    fetchRouteDetails({ route_ids: routeIds }).then((results) => {
      const routes = mapRoutesDetailsResult(results);

      const stopIds = routes.flatMap((route) => getRouteStopIds(route));

      const routeDetailsMap = new Map<UUID | null, Partial<RouteFormState>>();
      const infraLinksMap = new Map<UUID, InfrastructureLinkAlongRoute[]>();
      routes.forEach((route) => {
        routeDetailsMap.set(route.route_id, {
          description_i18n: route.description_i18n || '',
          label: route.label,
          on_line_id: route.on_line_id,
          priority: route.priority,
          validityStart: mapToISODate(route.validity_start),
          validityEnd: mapToISODate(route?.validity_end),
          indefinite: !route?.validity_end,
        });
        infraLinksMap.set(
          route.route_id,
          route.infrastructure_links_along_route.map((link) => ({
            infrastructureLinkId: link.infrastructure_link_id,
            isTraversalForwards: link.is_traversal_forwards,
            shape: link.infrastructure_link.shape,
          })),
        );
      });

      mapEditorDispatch({ type: 'reset' });
      mapEditorDispatch({
        type: 'setState',
        payload: {
          displayedRouteIds: routeIds,
          stopIdsWithinRoute: uniq(stopIds),
          routeDetails: routeDetailsMap,
          infraLinksAlongRoute: infraLinksMap,
        },
      });

      modalMapDispatch({ type: 'open' });
    });
  };

  return { showRoutesOnModal };
};
