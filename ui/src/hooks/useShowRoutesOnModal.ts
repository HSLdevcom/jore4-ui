import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { Maybe, RouteInformationForMapFragment } from '../generated/graphql';
import { initializeMapEditorWithRoutesAction } from '../redux';
import { isDateInRange } from '../time';
import { getRouteShapeFirstCoordinates } from '../utils/routeShape';
import { useAppDispatch } from './redux';
import { useMapQueryParams, useObservationDateQueryParam } from './urlQuery';

const GQL_ROUTE_INFORMATION_FOR_MAP = gql`
  fragment route_information_for_map on route_route {
    route_id
    route_shape
  }
`;

export const useShowRoutesOnModal = () => {
  const dispatch = useAppDispatch();
  const { openMapInPosition } = useMapQueryParams();
  const { observationDate: listViewObservationDate } =
    useObservationDateQueryParam();

  const showRoutesOnModal = (
    routes: RouteInformationForMapFragment[],
    validityStart: DateTime,
    validityEnd: Maybe<DateTime> | undefined,
  ) => {
    // Use observation date from list view by default. If observation date
    // is outside validity, make observation validity start date, so map is not empty.

    const newObservationDate = isDateInRange(
      listViewObservationDate,
      validityStart,
      validityEnd,
    )
      ? listViewObservationDate
      : validityStart;

    // This is a temporary solution to position the map on opened route
    // After react-map-gl v7 we should have a trivial way of centering the map
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      routes[0]?.route_shape,
    );

    const routeIds = routes.map((route) => route.route_id);

    dispatch(initializeMapEditorWithRoutesAction(routeIds));
    openMapInPosition({
      latitude,
      longitude,
      observationDate: newObservationDate,
    });
  };

  return { showRoutesOnModal };
};
