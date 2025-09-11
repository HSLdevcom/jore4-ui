import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  LineTableRowFragment,
  Maybe,
  RouteMapParamsFragment,
  RouteValidityFragment,
} from '../../../generated/graphql';
import {
  DisplayedRouteParams,
  ViewPortParams,
  useAppDispatch,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../hooks';
import { resetMapState, setSelectedRouteIdAction } from '../../../redux';
import { isDateInRange } from '../../../time';
import { Priority } from '../../../types/enums';
import { getRouteShapeFirstCoordinates } from '../../../utils';

const GQL_ROUTE_MAP_PARAMS = gql`
  fragment route_map_params on route_route {
    route_id
    label
    route_shape
    validity_start
    validity_end
  }
`;

const GQL_LINE_MAP_PARAMS = gql`
  fragment line_map_params on route_line {
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
  const { openMapWithParameters } = useMapQueryParams();
  const { observationDate: listViewObservationDate } =
    useObservationDateQueryParam({ initialize: false });

  const showRoutesOnModal = ({
    viewPortParams,
    displayedRouteParams: {
      showSelectedDaySituation = true,
      priorities = [Priority.Standard, Priority.Temporary],
      ...displayedRouteParams
    },
    validityStart,
    validityEnd,
  }: {
    viewPortParams: ViewPortParams;
    displayedRouteParams: DisplayedRouteParams;
    validityStart: DateTime;
    validityEnd: Maybe<DateTime> | undefined;
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

    dispatch(resetMapState());
    openMapWithParameters({
      viewPortParams,
      displayedRouteParams: {
        ...displayedRouteParams,
        showSelectedDaySituation,
        priorities,
      },
      observationDate: newObservationDate,
    });
  };

  const showRoutesOnMapByLabel = (route: RouteMapParamsFragment) => {
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      route.route_shape,
    );

    showRoutesOnModal({
      displayedRouteParams: { routeLabels: [route.label] },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: route.validity_start!,
      validityEnd: route.validity_end,
      viewPortParams: {
        latitude,
        longitude,
      },
    });

    // Automatically select the route on map
    // to highlight it and its stops and to view route info in overlay
    // without user having to click route geometry first.
    dispatch(setSelectedRouteIdAction(route.route_id));
  };

  const showRoutesOnMapByLineLabel = (line: LineTableRowFragment) => {
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      line.line_routes[0]?.route_shape,
    );

    showRoutesOnModal({
      displayedRouteParams: {
        lineLabel: line.label,
        priorities:
          line.priority === Priority.Draft ? [Priority.Draft] : undefined,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: line.validity_start!,
      validityEnd: line.validity_end,
      viewPortParams: { latitude, longitude },
    });
  };

  const showRouteOnMapById = (route: RouteMapParamsFragment) => {
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      route.route_shape,
    );

    showRoutesOnModal({
      displayedRouteParams: {
        routeId: route.route_id,
        showSelectedDaySituation: false,
        priorities: [Priority.Standard, Priority.Temporary, Priority.Draft],
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: route.validity_start!,
      validityEnd: route.validity_end,
      viewPortParams: { latitude, longitude },
    });

    // Automatically select the route on map
    // to highlight it and its stops and to view route info in overlay
    // without user having to click route geometry first.
    dispatch(setSelectedRouteIdAction(route.route_id));
  };

  /**
   * Shows the route on map by id if it is a draft route. Otherwise shows the route
   * by label (both directions).
   */
  const showRouteOnMap = (
    route: RouteMapParamsFragment & RouteValidityFragment,
  ) => {
    if (route.priority === Priority.Draft) {
      showRouteOnMapById(route);
    } else {
      showRoutesOnMapByLabel(route);
    }
  };

  return {
    showRoutesOnMapByLineLabel,
    showRouteOnMap,
  };
};
