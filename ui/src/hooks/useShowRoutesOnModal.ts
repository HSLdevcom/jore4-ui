import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  LineInformationForMapFragment,
  Maybe,
  RouteInformationForMapFragment,
} from '../generated/graphql';
import { resetMapEditorStateAction } from '../redux';
import { isDateInRange } from '../time';
import { getRouteShapeFirstCoordinates } from '../utils/routeShape';
import { useAppDispatch } from './redux';
import { useMapQueryParams, useObservationDateQueryParam } from './urlQuery';

const GQL_ROUTE_INFORMATION_FOR_MAP = gql`
  fragment route_information_for_map on route_route {
    route_id
    label
    route_shape
    validity_start
    validity_end
  }
`;

const GQL_LINE_INFORMATION_FOR_MAP = gql`
  fragment line_information_for_map on route_line {
    line_id
    label
    validity_start
    validity_end
    line_routes {
      route_id
      route_shape
    }
  }
`;

export const useShowRoutesOnModal = () => {
  const dispatch = useAppDispatch();
  const { openMapInPosition } = useMapQueryParams();
  const { observationDate: listViewObservationDate } =
    useObservationDateQueryParam();

  const showRoutesOnModal = ({
    routeLabel,
    lineLabel,
    validityStart,
    validityEnd,
    latitude,
    longitude,
  }: {
    routeLabel?: string;
    lineLabel?: string;
    validityStart: DateTime;
    validityEnd: Maybe<DateTime> | undefined;
    latitude?: number;
    longitude?: number;
  }) => {
    // Use observation date from list view by default. If observation date
    // is outside validity, make observation validity start date, so map is not empty.

    const newObservationDate = isDateInRange(
      listViewObservationDate,
      validityStart,
      validityEnd,
    )
      ? listViewObservationDate
      : validityStart;

    dispatch(resetMapEditorStateAction());
    openMapInPosition({
      routeLabel,
      lineLabel,
      latitude,
      longitude,
      observationDate: newObservationDate,
    });
  };

  const showRouteOnMapByLabel = (route: RouteInformationForMapFragment) => {
    // This is a temporary solution to position the map on opened route
    // After react-map-gl v7 we should have a trivial way of centering the map
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      route.route_shape,
    );

    showRoutesOnModal({
      routeLabel: route.label,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: route.validity_start!,
      validityEnd: route.validity_end,
      latitude,
      longitude,
    });
  };

  const showRouteOnMapByLineLabel = (line: LineInformationForMapFragment) => {
    // This is a temporary solution to position the map on opened route
    // After react-map-gl v7 we should have a trivial way of centering the map
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      line.line_routes[0]?.route_shape,
    );

    showRoutesOnModal({
      lineLabel: line.label,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: line.validity_start!,
      validityEnd: line.validity_end,
      latitude,
      longitude,
    });
  };

  return { showRouteOnMapByLabel, showRouteOnMapByLineLabel };
};
