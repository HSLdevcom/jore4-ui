import { uniq } from 'lodash';
import { useContext } from 'react';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';
import {
  GetRouteDetailsByIdDocument,
  GetRouteDetailsByIdQuery,
  GetRouteDetailsByIdQueryVariables,
  RouteRoute,
} from '../generated/graphql';
import { mapRoutesDetailsResult } from '../graphql';
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
    GetRouteDetailsByIdQuery,
    GetRouteDetailsByIdQueryVariables
  >(GetRouteDetailsByIdDocument);

  const showRoutesOnModal = (routeIds: UUID[]) => {
    fetchRouteDetails({ route_ids: routeIds }).then((results) => {
      const stopIds = mapRoutesDetailsResult(results).flatMap((route) =>
        getRouteStopIds(route),
      );

      mapEditorDispatch({
        type: 'setState',
        payload: {
          displayedRouteIds: routeIds,
          stopIdsWithinRoute: uniq(stopIds),
        },
      });
      modalMapDispatch({ type: 'open' });
    });
  };

  return { showRoutesOnModal };
};
