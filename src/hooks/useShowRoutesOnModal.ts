import { ApolloQueryResult } from '@apollo/client';
import { uniq } from 'lodash';
import { useContext } from 'react';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';
import {
  GetRouteDetailsByIdDocument,
  GetRouteDetailsByIdQuery,
  GetRouteDetailsByIdQueryVariables,
} from '../generated/graphql';
import { useAsyncQuery } from './useAsyncQuery';

const parseRouteDetails = (
  response: ApolloQueryResult<GetRouteDetailsByIdQuery>,
) => {
  return response.data.route_route[0];
};

const getRouteStopIds = (route: ReturnType<typeof parseRouteDetails>) => {
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
    const routeDetailPromises = routeIds.map((routeId) => {
      return fetchRouteDetails({ route_id: routeId });
    });

    Promise.all(routeDetailPromises).then((results) => {
      let stopIds: string[] = [];

      results.forEach((result) => {
        const route = parseRouteDetails(result);
        stopIds = [...stopIds, ...getRouteStopIds(route)];
      });

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
