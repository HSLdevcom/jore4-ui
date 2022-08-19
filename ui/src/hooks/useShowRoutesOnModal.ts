import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { Maybe, RouteInformationForMapFragment } from '../generated/graphql';
import {
  initializeMapEditorWithRoutesAction,
  setMapObservationDateAction,
} from '../redux';
import { isDateInRange } from '../time';
import { getRouteShapeFirstCoordinates } from '../utils/routeShape';
import { useAppDispatch } from './redux';
import { useMapQueryParams } from './urlQuery';

const GQL_ROUTE_INFORMATION_FOR_MAP = gql`
  fragment route_information_for_map on route_route {
    route_id
    route_shape
  }
`;

export const useShowRoutesOnModal = () => {
  const dispatch = useAppDispatch();
  const { openMapInPosition } = useMapQueryParams();

  const showRoutesOnModal = (
    routes: RouteInformationForMapFragment[],
    validityStart: DateTime,
    validityEnd: Maybe<DateTime> | undefined,
  ) => {
    const newObservationDate = isDateInRange(
      DateTime.now(),
      validityStart,
      validityEnd,
    )
      ? DateTime.now()
      : validityStart;

    // This is a temporary solution to position the map on opened route
    // After react-map-gl v7 we should have a trivial way of centering the map
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      routes[0]?.route_shape,
    );

    const routeIds = routes.map((route) => route.route_id);

    dispatch(setMapObservationDateAction(newObservationDate));
    dispatch(initializeMapEditorWithRoutesAction(routeIds));
    openMapInPosition(latitude, longitude);
  };

  return { showRoutesOnModal };
};
