import { gql } from '@apollo/client';
import type { LineString } from 'geojson';
import merge from 'lodash/merge';
import {
  LineTableRowFragment,
  RouteMapParamsFragment,
} from '../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../hooks';
import {
  FilterType,
  resetMapState,
  setSelectedRouteIdAction,
  setTimeAndPriorityFilterAction,
  useAppDispatch,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { isDateInRange } from '../../../utils/time';
import {
  DisplayedRouteParams,
  OpenMapViewPortParams,
  defaultDisplayedRouteParams,
} from '../../Map/Types';
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
  readonly validityStart: Temporal.PlainDate;
  readonly validityEnd: Temporal.PlainDate | null | undefined;
  readonly priorities?: ReadonlyArray<Priority>;
  readonly showSelectedDaySituation?: boolean;
};

export function useShowRoutesOnMap() {
  const dispatch = useAppDispatch();
  const navigateToMap = useNavigateToMap();

  const { observationDate: listViewObservationDate } =
    useObservationDateQueryParam({ initialize: false });

  const setFilters = (
    priorities: ReadonlyArray<Priority>,
    showSelectedDaySituation: boolean,
  ) => {
    const filters: ReadonlyArray<[FilterType, boolean]> = [
      [FilterType.ShowHighestPriorityCurrent, showSelectedDaySituation],
      [FilterType.ShowCurrent, true],
      [FilterType.ShowFuture, false],
      [FilterType.ShowPast, false],
      [FilterType.ShowStandard, priorities.includes(Priority.Standard)],
      [FilterType.ShowTemporary, priorities.includes(Priority.Temporary)],
      [FilterType.ShowDraft, priorities.includes(Priority.Draft)],
    ];

    filters.forEach(([filterType, isActive]) => {
      dispatch(setTimeAndPriorityFilterAction({ filterType, isActive }));
    });
  };

  const showRoutesOnMap = ({
    viewPort,
    displayedRoute,
    validityStart,
    validityEnd,
    priorities = [Priority.Standard, Priority.Temporary],
    showSelectedDaySituation = true,
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
    setFilters(priorities, showSelectedDaySituation);
    navigateToMap({
      viewPort,
      displayedRoute: merge({}, defaultDisplayedRouteParams, displayedRoute),
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

    // Draft routes are filtered out by the "show situation on the selected
    // date" mode, so it has to be turned off for draft lines.
    const isDraft = line.priority === Priority.Draft;

    showRoutesOnMap({
      displayedRoute: {
        lineLabel: line.label,
      },
      priorities: isDraft
        ? [Priority.Draft]
        : [Priority.Standard, Priority.Temporary],
      showSelectedDaySituation: !isDraft,
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
      },
      priorities: [Priority.Standard, Priority.Temporary, Priority.Draft],
      showSelectedDaySituation: false,
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
