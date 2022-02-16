import { uniq } from 'lodash';
import { useContext } from 'react';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';
import { RouteRoute } from '../generated/graphql';

export const useShowRoutesOnModal = () => {
  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);

  const showRoutesOnModal = (routes: RouteRoute[]) => {
    const ids = routes.map((route) => route.route_id);

    let stopIds: string[] = [];
    routes.forEach((route) => {
      stopIds = [
        ...stopIds,
        ...route.route_journey_patterns[0].scheduled_stop_point_in_journey_patterns.map(
          (point) => point.scheduled_stop_point_id,
        ),
      ];
    });

    mapEditorDispatch({
      type: 'setState',
      payload: {
        displayedRouteIds: ids,
        stopIdsWithinRoute: uniq(stopIds),
      },
    });
    modalMapDispatch({ type: 'open' });
  };

  return { showRoutesOnModal };
};
