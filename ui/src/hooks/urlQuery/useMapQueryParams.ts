import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { HELSINKI_CITY_CENTER_COORDINATES } from '../../redux';
import { useUrlQuery } from './useUrlQuery';

const queryParameterNameMapOpen = 'mapOpen' as const;
const queryParameterNameLongitude = 'lng' as const;
const queryParameterNameLatitude = 'lat' as const;
const queryParameterNameZoom = 'z' as const;
const queryParameterNameObservationDate = 'observationDate' as const;
const queryParameterNameRouteLabel = 'routeLabel' as const;
const queryParameterNameLineLabel = 'lineLabel' as const;
const DEFAULT_ZOOM = 13 as const;

export const useMapQueryParams = () => {
  const {
    setBooleanToUrlQuery,
    getStringParamFromUrlQuery,
    getBooleanParamFromUrlQuery,
    getFloatParamFromUrlQuery,
    deleteMultipleFromUrlQuery,
    setMultipleParametersToUrlQuery,
  } = useUrlQuery();

  const addMapOpenQueryParameter = () => {
    setBooleanToUrlQuery({ paramName: queryParameterNameMapOpen, value: true });
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
  }: {
    latitude?: number;
    longitude?: number;
    zoom?: number;
    observationDate: DateTime;
    routeLabel?: string;
    lineLabel?: string;
  }) => {
    setMultipleParametersToUrlQuery({
      parameters: [
        {
          paramName: queryParameterNameLatitude,
          value: latitude || HELSINKI_CITY_CENTER_COORDINATES.latitude,
        },
        {
          paramName: queryParameterNameLongitude,
          value: longitude || HELSINKI_CITY_CENTER_COORDINATES.longitude,
        },
        { paramName: queryParameterNameZoom, value: zoom || DEFAULT_ZOOM },
        { paramName: queryParameterNameMapOpen, value: true },
        {
          paramName: queryParameterNameObservationDate,
          value: observationDate,
        },
        {
          paramName: queryParameterNameRouteLabel,
          value: routeLabel,
        },
        {
          paramName: queryParameterNameLineLabel,
          value: lineLabel,
        },
      ],
    });
  };

  const deleteMapQueryParameters = () => {
    deleteMultipleFromUrlQuery({
      paramNames: [
        queryParameterNameMapOpen,
        queryParameterNameLongitude,
        queryParameterNameLatitude,
        queryParameterNameZoom,
        queryParameterNameRouteLabel,
        queryParameterNameLineLabel,
      ],
    });
  };

  const isMapOpen = getBooleanParamFromUrlQuery(queryParameterNameMapOpen);

  const mapPosition = {
    longitude:
      getFloatParamFromUrlQuery(queryParameterNameLongitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.longitude,
    latitude:
      getFloatParamFromUrlQuery(queryParameterNameLatitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.latitude,
    zoom: getFloatParamFromUrlQuery(queryParameterNameZoom) ?? DEFAULT_ZOOM,
  };

  const routeLabel = getStringParamFromUrlQuery(queryParameterNameRouteLabel);
  const lineLabel = getStringParamFromUrlQuery(queryParameterNameLineLabel);

  const setMapPosition = useCallback(
    (latitude: number, longitude: number, zoom: number) => {
      setMultipleParametersToUrlQuery({
        parameters: [
          { paramName: queryParameterNameLatitude, value: latitude },
          {
            paramName: queryParameterNameLongitude,
            value: longitude,
          },
          { paramName: queryParameterNameZoom, value: zoom },
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
    setMapPosition,
    openMapInPosition,
    deleteMapQueryParameters,
  };
};
