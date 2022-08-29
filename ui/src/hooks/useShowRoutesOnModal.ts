import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  LineInformationForMapFragment,
  Maybe,
  RouteInformationForMapFragment,
} from '../generated/graphql';
import { resetMapEditorStateAction } from '../redux';
import { isDateInRange } from '../time';
import { Priority } from '../types/Priority';
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
    routeId,
    validityStart,
    validityEnd,
    latitude,
    longitude,
    showSelectedDaySituation = true,
    priorities = [Priority.Standard, Priority.Temporary],
  }: {
    routeLabel?: string;
    lineLabel?: string;
    routeId?: UUID;
    validityStart: DateTime;
    validityEnd: Maybe<DateTime> | undefined;
    latitude?: number;
    longitude?: number;
    showSelectedDaySituation?: boolean;
    priorities?: Priority[];
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
      routeId,
      latitude,
      longitude,
      observationDate: newObservationDate,
      showSelectedDaySituation,
      priorities,
    });
  };

  const showRouteOnMapByLabel = (route: RouteInformationForMapFragment) => {
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

  const showRouteOnMapById = (route: RouteInformationForMapFragment) => {
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      route.route_shape,
    );

    showRoutesOnModal({
      routeId: route.route_id,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: route.validity_start!,
      validityEnd: route.validity_end,
      latitude,
      longitude,
      showSelectedDaySituation: false,
      priorities: [Priority.Standard, Priority.Temporary, Priority.Draft],
    });
  };

  return {
    showRouteOnMapByLabel,
    showRouteOnMapByLineLabel,
    showRouteOnMapById,
  };
};
