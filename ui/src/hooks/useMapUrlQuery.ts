import debounce from 'lodash/debounce';
import { useMemo } from 'react';
import { useHistory } from 'react-router';
import { HELSINKI_CITY_CENTER_COORDINATES } from '../redux';

export const useMapUrlQuery = () => {
  const history = useHistory();
  const queryParameterNameMapOpen = 'mapOpen' as const;
  const queryParameterNameLongitude = 'lng' as const;
  const queryParameterNameLatitude = 'ltd' as const;
  const queryParameterNameZoom = 'z' as const;
  const DEFAULT_ZOOM = 13 as const;

  const queryParamObject = useMemo(
    () => new URLSearchParams(history.location.search),
    [history.location.search],
  );

  const parseFloatFromQueryParam = (value: string) =>
    queryParamObject.has(value)
      ? parseFloat(queryParamObject.get(value) as string)
      : null;

  const mapPosition = {
    longitude:
      parseFloatFromQueryParam(queryParameterNameLongitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.longitude,
    latitude:
      parseFloatFromQueryParam(queryParameterNameLatitude) ??
      HELSINKI_CITY_CENTER_COORDINATES.latitude,
    zoom: parseFloatFromQueryParam(queryParameterNameZoom) ?? DEFAULT_ZOOM,
  };

  const addMapOpenQueryParameter = () => {
    const queryParams = new URLSearchParams(history.location.search);
    queryParams.set(queryParameterNameMapOpen, 'true');
    history.replace({
      search: queryParams.toString(),
    });
  };

  const setMapPositionQueryParametersDebounced = useMemo(
    () =>
      debounce((latitude, longitude, zoom) => {
        queryParamObject.set(queryParameterNameLongitude, longitude.toString());
        queryParamObject.set(queryParameterNameLatitude, latitude.toString());
        queryParamObject.set(queryParameterNameZoom, zoom.toString());

        history.replace({
          search: queryParamObject.toString(),
        });
      }, 500),
    [history, queryParamObject],
  );

  const deleteMapOpenQueryParameter = () => {
    const queryParams = new URLSearchParams(history.location.search);
    if (queryParams.has(queryParameterNameMapOpen)) {
      queryParams.delete(queryParameterNameMapOpen);
      queryParams.delete(queryParameterNameLongitude);
      queryParams.delete(queryParameterNameLatitude);
      queryParams.delete(queryParameterNameZoom);

      history.replace({
        search: queryParams.toString(),
      });
    }
  };

  const isMapOpen = () => {
    const queryParams = new URLSearchParams(history.location.search);
    return (
      queryParams.has(queryParameterNameMapOpen) &&
      queryParams.get(queryParameterNameMapOpen) === 'true'
    );
  };

  return {
    addMapOpenQueryParameter,
    mapPosition,
    setMapPositionQueryParametersDebounced,
    deleteMapOpenQueryParameter,
    isMapOpen,
  };
};
