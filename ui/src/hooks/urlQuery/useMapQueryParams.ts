import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { HELSINKI_CITY_CENTER_COORDINATES } from '../../redux';
import { Priority } from '../../types/Priority';
import { parseAndValidatePriorities } from '../search';
import { useUrlQuery } from './useUrlQuery';

export enum QueryParameterName {
  MapOpen = 'mapOpen',
  Longitude = 'lng',
  Latitude = 'lat',
  Zoom = 'z',
  ObservationDate = 'observationDate',
  RouteLabel = 'routeLabel',
  LineLabel = 'lineLabel',
  RouteId = 'routeId',
  ShowSelectedDaySituation = 'showSelectedDaySituation',
  Priorities = 'routePriorities',
}

const DEFAULT_ZOOM = 13 as const;

export const useMapQueryParams = () => {
  const {
    setBooleanToUrlQuery,
    getStringParamFromUrlQuery,
    getBooleanParamFromUrlQuery,
    getFloatParamFromUrlQuery,
    deleteMultipleFromUrlQuery,
    setMultipleParametersToUrlQuery,
    setToUrlQuery,
  } = useUrlQuery();

  const addMapOpenQueryParameter = () => {
    setBooleanToUrlQuery({
      paramName: QueryParameterName.MapOpen,
      value: true,
    });
  };

  /** Sets latitude, longitude, zoom and mapOpen queryparameters which will
   * open the map and set the map to desired position. This function might change
   * after react-map-gl v7 is updated.
   */
  const openMapInPosition = ({
    latitude,
    longitude,
    zoom,
    observationDate,
    routeLabel,
    lineLabel,
    routeId,
    showSelectedDaySituation = true,
    priorities,
  }: {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    observationDate: DateTime;
    routeLabel?: string;
    lineLabel?: string;
    routeId?: UUID;
    showSelectedDaySituation?: boolean;
    priorities: Priority[];
  }) => {
    setMultipleParametersToUrlQuery({
      parameters: [
        {
          paramName: QueryParameterName.Latitude,
          value: latitude || HELSINKI_CITY_CENTER_COORDINATES.latitude,
        },
        {
          paramName: QueryParameterName.Longitude,
          value: longitude || HELSINKI_CITY_CENTER_COORDINATES.longitude,
        },
        { paramName: QueryParameterName.Zoom, value: zoom || DEFAULT_ZOOM },
        { paramName: QueryParameterName.MapOpen, value: true },
        {
          paramName: QueryParameterName.ObservationDate,
          value: observationDate,
        },
        {
          paramName: QueryParameterName.RouteLabel,
          value: routeLabel,
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
          paramName: QueryParameterName.Priorities,
          value: priorities,
        },
      ],
    });
  };

  const deleteMapQueryParameters = () => {
    deleteMultipleFromUrlQuery({
      paramNames: [
        QueryParameterName.MapOpen,
        QueryParameterName.Longitude,
        QueryParameterName.Latitude,
        QueryParameterName.Zoom,
        QueryParameterName.RouteLabel,
        QueryParameterName.LineLabel,
        QueryParameterName.RouteId,
        QueryParameterName.ShowSelectedDaySituation,
        QueryParameterName.Priorities,
      ],
    });
  };

  const isMapOpen = getBooleanParamFromUrlQuery(QueryParameterName.MapOpen);

  const mapPosition = {
    longitude:
      getFloatParamFromUrlQuery(QueryParameterName.Longitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.longitude,
    latitude:
      getFloatParamFromUrlQuery(QueryParameterName.Latitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.latitude,
    zoom: getFloatParamFromUrlQuery(QueryParameterName.Zoom) ?? DEFAULT_ZOOM,
  };

  const routeLabel = getStringParamFromUrlQuery(QueryParameterName.RouteLabel);
  const lineLabel = getStringParamFromUrlQuery(QueryParameterName.LineLabel);
  const routeId = getStringParamFromUrlQuery(QueryParameterName.RouteId);
  const showSelectedDaySituation = getBooleanParamFromUrlQuery(
    QueryParameterName.ShowSelectedDaySituation,
  );
  const priorities = parseAndValidatePriorities(
    getStringParamFromUrlQuery(QueryParameterName.Priorities) || '',
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
      });
    },
    [setMultipleParametersToUrlQuery],
  );

  return {
    addMapOpenQueryParameter,
    isMapOpen,
    mapPosition,
    routeLabel,
    lineLabel,
    routeId,
    showSelectedDaySituation,
    priorities,
    setRouteId,
    setMapPosition,
    openMapInPosition,
    deleteMapQueryParameters,
  };
};
