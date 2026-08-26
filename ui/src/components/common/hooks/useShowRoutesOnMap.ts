import { gql } from '@apollo/client';
import type { LineString } from 'geojson';
import merge from 'lodash/merge';
import { DateTime } from 'luxon';
import {
  LineTableRowFragment,
  RouteMapParamsFragment,
} from '../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../hooks';
import {
  resetMapState,
  setSelectedRouteIdAction,
  useAppDispatch,
} from '../../../redux';
import { isDateInRange } from '../../../time';
import { Priority } from '../../../types/enums';
import {
  DisplayedRouteParams,
  OpenMapViewPortParams,
  defaultDisplayedRouteParams,
} from '../../map/Types';
import { useNavigateToMap } from './useNavigateToMap';

const GQL_ROUTE_MAP_PARAMS = gql`
  fragment RouteMapParams on route_route {
    route_id
    label
    route_shape
    validity_start
    validity_end
    priority
  }
`;

const GQL_LINE_MAP_PARAMS = gql`
  fragment LineMapParams on route_line {
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

function getFirstCoordinatesFromLineString(routeShape: LineString) {
  const [firstLineStringCoordinates] = routeShape.coordinates;
  const [longitude, latitude] = firstLineStringCoordinates;

  return { longitude, latitude };
}

/* This is a temporary solution to get the coordinates from route to position the map
 * to opened route
 * After react-map-gl v7 we should have a trivial way of centering the map
 */
function getRouteShapeFirstCoordinates(
  route: RouteMapParamsFragment | undefined | null,
) {
  const routeShape = route?.route_shape;

  if (routeShape?.type === 'LineString') {
    return getFirstCoordinatesFromLineString(routeShape);
  }

  return { longitude: undefined, latitude: undefined };
}

type ShowRoutesOnMapParams = {
  readonly viewPort: OpenMapViewPortParams | undefined;
  readonly displayedRoute: Partial<DisplayedRouteParams>;
  readonly validityStart: DateTime;
  readonly validityEnd: DateTime | null | undefined;
};

export function useShowRoutesOnMap() {
  const dispatch = useAppDispatch();
  const navigateToMap = useNavigateToMap();

  const { observationDate: listViewObservationDate } =
    useObservationDateQueryParam({ initialize: false });

  const showRoutesOnMap = ({
    viewPort,
    displayedRoute,
    validityStart,
    validityEnd,
  }: ShowRoutesOnMapParams) => {
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
    navigateToMap({
      viewPort,
      displayedRoute: merge({}, defaultDisplayedRouteParams, {
        showSelectedDaySituation: true,
        routePriorities: [Priority.Standard, Priority.Temporary],
        ...displayedRoute,
      }),
      filters: {
        observationDate: newObservationDate,
      },
    });
  };

  const showRoutesOnMapByLabel = (route: RouteMapParamsFragment) => {
    const { latitude, longitude } = getRouteShapeFirstCoordinates(route);

    showRoutesOnMap({
      displayedRoute: { routeLabels: [route.label] },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: route.validity_start!,
      validityEnd: route.validity_end,
      viewPort: latitude && longitude ? { latitude, longitude } : undefined,
    });

    // Automatically select the route on map
    // to highlight it and its stops and to view route info in overlay
    // without user having to click route geometry first.
    dispatch(setSelectedRouteIdAction(route.route_id));
  };

  const showRoutesOnMapByLineLabel = (line: LineTableRowFragment) => {
    const { latitude, longitude } = getRouteShapeFirstCoordinates(
      line.line_routes.at(0),
    );

    showRoutesOnMap({
      displayedRoute: {
        lineLabel: line.label,
        routePriorities:
          line.priority === Priority.Draft ? [Priority.Draft] : undefined,
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: line.validity_start!,
      validityEnd: line.validity_end,
      viewPort: latitude && longitude ? { latitude, longitude } : undefined,
    });
  };

  const showRouteOnMapById = (route: RouteMapParamsFragment) => {
    const { latitude, longitude } = getRouteShapeFirstCoordinates(route);

    showRoutesOnMap({
      displayedRoute: {
        routeId: route.route_id,
        showSelectedDaySituation: false,
        routePriorities: [
          Priority.Standard,
          Priority.Temporary,
          Priority.Draft,
        ],
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: route.validity_start!,
      validityEnd: route.validity_end,
      viewPort: latitude && longitude ? { latitude, longitude } : undefined,
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
  const showRouteOnMap = (route: RouteMapParamsFragment) => {
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
}
