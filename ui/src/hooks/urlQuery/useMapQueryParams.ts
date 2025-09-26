import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { HELSINKI_CITY_CENTER_COORDINATES } from '../../redux';
import { Priority } from '../../types/enums';
import { makeBackNavigationIsSafeState } from '../useSafeBackNavigation';
import { QueryParameterName, useUrlQuery } from './useUrlQuery';

const DEFAULT_ZOOM = 13 as const;

export type ViewPortParams = {
  readonly latitude?: number;
  readonly longitude?: number;
  readonly zoom?: number;
};

export type DisplayedRouteParams = {
  readonly routeLabels?: ReadonlyArray<string>;
  readonly lineLabel?: string;
  readonly routeId?: UUID;
  readonly showSelectedDaySituation?: boolean;
  readonly priorities?: ReadonlyArray<Priority>;
};

export type OpenMapParams = {
  readonly viewPortParams: ViewPortParams;
  readonly displayedRouteParams: DisplayedRouteParams;
  readonly observationDate: DateTime;
};

export const useMapQueryParams = () => {
  const {
    getStringParamFromUrlQuery,
    getBooleanParamFromUrlQuery,
    getFloatParamFromUrlQuery,
    getPriorityArrayFromUrlQuery,
    deleteMultipleFromUrlQuery,
    setMultipleParametersToUrlQuery,
    getArrayFromUrlQuery,
    setToUrlQuery,
  } = useUrlQuery();

  const navigate = useNavigate();
  const location = useLocation();

  const navigateToMap = () => {
    navigate('/map', { state: makeBackNavigationIsSafeState() });
  };

  /**
   * Open map with provided query parameters. Map position, zoom level,
   * observation date and parameters related to displayed routes are accepted.
   */
  const openMapWithParameters = ({
    viewPortParams: { latitude, longitude, zoom },
    observationDate,
    displayedRouteParams: {
      routeLabels,
      lineLabel,
      routeId,
      showSelectedDaySituation = true,
      priorities,
    },
  }: OpenMapParams) => {
    setMultipleParametersToUrlQuery({
      parameters: [
        {
          paramName: QueryParameterName.Latitude,
          value: latitude ?? HELSINKI_CITY_CENTER_COORDINATES.latitude,
        },
        {
          paramName: QueryParameterName.Longitude,
          value: longitude ?? HELSINKI_CITY_CENTER_COORDINATES.longitude,
        },
        { paramName: QueryParameterName.Zoom, value: zoom ?? DEFAULT_ZOOM },
        {
          paramName: QueryParameterName.ObservationDate,
          value: observationDate,
        },
        {
          paramName: QueryParameterName.RouteLabels,
          value: routeLabels,
        },
        {
          paramName: QueryParameterName.LineLabel,
          value: lineLabel,
        },
        {
          paramName: QueryParameterName.RouteId,
          value: routeId,
        },
        {
          paramName: QueryParameterName.ShowSelectedDaySituation,
          value: showSelectedDaySituation,
        },
        {
          paramName: QueryParameterName.RoutePriorities,
          value: priorities,
        },
      ],
      pathname: '/map',
      state: makeBackNavigationIsSafeState(),
    });
  };

  const deleteMapQueryParameters = () => {
    deleteMultipleFromUrlQuery({
      paramNames: [
        QueryParameterName.Longitude,
        QueryParameterName.Latitude,
        QueryParameterName.Zoom,
        QueryParameterName.RouteLabels,
        QueryParameterName.LineLabel,
        QueryParameterName.RouteId,
        QueryParameterName.ShowSelectedDaySituation,
        QueryParameterName.RoutePriorities,
      ],
    });
  };

  const isMapOpen = location.pathname === '/map';

  const mapPosition = {
    longitude:
      getFloatParamFromUrlQuery(QueryParameterName.Longitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.longitude,
    latitude:
      getFloatParamFromUrlQuery(QueryParameterName.Latitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.latitude,
    zoom: getFloatParamFromUrlQuery(QueryParameterName.Zoom) ?? DEFAULT_ZOOM,
  };

  const routeLabels = getArrayFromUrlQuery(QueryParameterName.RouteLabels);
  const lineLabel = getStringParamFromUrlQuery(QueryParameterName.LineLabel);
  const routeId = getStringParamFromUrlQuery(QueryParameterName.RouteId);
  const showSelectedDaySituation = getBooleanParamFromUrlQuery(
    QueryParameterName.ShowSelectedDaySituation,
  );
  const priorities = getPriorityArrayFromUrlQuery(
    QueryParameterName.RoutePriorities,
  );

  const setRouteId = (id: UUID) => {
    setToUrlQuery({
      paramName: QueryParameterName.RouteId,
      value: id,
      replace: true,
    });
  };

  const setMapPosition = useCallback(
    (latitude: number, longitude: number, zoom: number) => {
      setMultipleParametersToUrlQuery({
        parameters: [
          { paramName: QueryParameterName.Latitude, value: latitude },
          {
            paramName: QueryParameterName.Longitude,
            value: longitude,
          },
          { paramName: QueryParameterName.Zoom, value: zoom },
        ],
        replace: true,
        state: location.state,
      });
    },
    [setMultipleParametersToUrlQuery, location.state],
  );
  return {
    navigateToMap,
    isMapOpen,
    mapPosition,
    routeLabels,
    lineLabel,
    routeId,
    showSelectedDaySituation,
    priorities,
    setRouteId,
    setMapPosition,
    openMapWithParameters,
    deleteMapQueryParameters,
  };
};
