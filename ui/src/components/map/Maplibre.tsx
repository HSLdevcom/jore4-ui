import distance from '@turf/distance';
import { point, Units } from '@turf/helpers';
import debounce from 'lodash/debounce';
import { FunctionComponent, useMemo, useRef, useState } from 'react';
import MapGL, {
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
} from 'react-map-gl';
import { useAppDispatch } from '../../hooks';
import {
  HELSINKI_CITY_CENTER_COORDINATES,
  setViewPortAction,
} from '../../redux';
import hslSimpleStyle from './hslSimpleStyle.json';
import rasterMapStyle from './rasterMapStyle.json';

interface Props {
  // width and height are passed as params to `react-map-gl`.
  // It seems to support certain css features, e.g. "100vh" or "100px",
  // but in other hand "100%" doesn't seem to work...(Update: not sure
  // about this with current react-map-gl v7)
  width?: string;
  height?: string;
  onClick?: (e: MapLayerMouseEvent) => void;
  useVectorTilesAsBaseMap?: boolean;
}

interface MaplibreViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const Maplibre: FunctionComponent<Props> = ({
  onClick,
  width = '100vw',
  height = '100vh',
  useVectorTilesAsBaseMap = true,
  children,
}) => {
  const mapRef = useRef<MapRef>(null);

  // TODO: viewState seems to be saved here and to Redux state. Both could be combined at some point...
  const [viewState, setViewState] = useState<MaplibreViewport>({
    ...HELSINKI_CITY_CENTER_COORDINATES,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });

  const dispatch = useAppDispatch();

  const updateViewportDebounced = useMemo(
    () =>
      debounce(
        (latitude, longitude, radius) =>
          dispatch(
            setViewPortAction({
              latitude,
              longitude,
              radius,
            }),
          ),
        500,
      ),
    [dispatch],
  );

  const onViewStateChange = (newViewport: MaplibreViewport) => {
    setViewState(newViewport);

    if (mapRef.current) {
      const mapGL = mapRef.current.getMap();

      const bounds = mapGL.getBounds();

      const from = point([newViewport.longitude, newViewport.latitude]);
      const to = point([bounds.getSouthWest().lng, bounds.getSouthWest().lat]);
      const options = { units: 'meters' as Units };

      const radius = distance(from, to, options);

      updateViewportDebounced(
        newViewport.latitude,
        newViewport.longitude,
        radius,
      );
    }
  };

  const transformRequest = (url: string) => {
    if (url.startsWith('/')) {
      // mapbox gl js doesn't handle relative url's. As a workaround
      // we can make those url's non-relative by prepending those with
      // window.location.origin
      // https://github.com/mapbox/mapbox-gl-js/issues/10407
      const newUrl = window.location.origin + url;
      return {
        url: newUrl,
      };
    }
    return { url };
  };

  const mapStyle = useVectorTilesAsBaseMap ? hslSimpleStyle : rasterMapStyle;

  return (
    <MapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewState}
      style={{
        width,
        height,
      }}
      onMove={(event) => onViewStateChange(event.viewState)}
      onClick={onClick}
      // TODO: something is wrong with typings of mapStyle, thus casting to any.
      // Anyway, it seems to work so probably not worth investigating further.
      mapStyle={mapStyle as ExplicitAny}
      // TODO: cursor handling with `cursor` prop? https://visgl.github.io/react-map-gl/docs/upgrade-guide#map
      transformRequest={transformRequest}
      doubleClickZoom={false}
      ref={mapRef}
    >
      {children}
      <NavigationControl
        showCompass={false}
        position="bottom-right"
        style={{
          marginLeft: '10px',
          marginRight: '10px',
          bottom: 105,
          right: 0,
          position: 'fixed',
        }}
      />
    </MapGL>
  );
};
