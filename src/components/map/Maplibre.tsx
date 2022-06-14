import distance from '@turf/distance';
import { point, Units } from '@turf/helpers';
import debounce from 'lodash/debounce';
import React, { FunctionComponent, useMemo, useRef, useState } from 'react';
import MapGL, { MapEvent, MapRef, NavigationControl } from 'react-map-gl';
import { theme } from '../../generated/theme';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  HELSINKI_CITY_CENTER_COORDINATES,
  selectIsCreateStopModeEnabled,
  setViewPortAction,
} from '../../redux';
import { getSvgComponentDataUrl } from '../../utils';
import hslSimpleStyle from './hslSimpleStyle.json';
import { Circle } from './markers';
import rasterMapStyle from './rasterMapStyle.json';

const { colors } = theme;
interface Props {
  className?: string;
  // width and height are passed as params to `react-map-gl`.
  // It seems to support certain css features, e.g. "100vh" or "100px",
  // but in other hand "100%" doesn't seem to work...
  width?: string;
  height?: string;
  onClick?: (e: MapEvent) => void;
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
  className,
  onClick,
  width = '100vw',
  height = '100vh',
  useVectorTilesAsBaseMap = true,
  children,
}) => {
  const mapRef = useRef<MapRef>(null);

  const [viewport, setViewport] = useState<MaplibreViewport>({
    ...HELSINKI_CITY_CENTER_COORDINATES,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });

  const dispatch = useAppDispatch();

  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);

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

  const onViewportChange = (newViewport: MaplibreViewport) => {
    setViewport(newViewport);

    if (mapRef.current) {
      const mapGL = mapRef.current.getMap();

      const bounds = mapGL.getBounds();

      const from = point([newViewport.longitude, newViewport.latitude]);
      // eslint-disable-next-line no-underscore-dangle
      const to = point([bounds._sw.lng, bounds._sw.lat]);
      const options = { units: 'meters' as Units };

      const radius = distance(from, to, options);

      updateViewportDebounced(
        newViewport.latitude,
        newViewport.longitude,
        radius,
      );
    }
  };

  const navStyle = {
    bottom: 72,
    right: 0,
    padding: '10px',
  };

  const getCursor = ({
    isHovering,
    isDragging,
  }: {
    isLoaded: boolean;
    isDragging: boolean;
    isHovering: boolean;
  }) => {
    if (isDragging) {
      return 'grabbing';
    }
    if (isCreateStopModeEnabled) {
      // the '#' character cannot be used here as this is going to be a url
      const borderColor = colors.hslRed.replace('#', '%23');
      const stopMarkerDataUrl = getSvgComponentDataUrl(
        <Circle centerDot borderColor={borderColor} />,
      );
      const cursorCss = `url('${stopMarkerDataUrl}'), crosshair`;
      return cursorCss;
    }
    // TODO: seems like we never actually receive isHovering as true
    return isHovering ? 'pointer' : 'default';
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
    return undefined;
  };

  const mapStyle = useVectorTilesAsBaseMap ? hslSimpleStyle : rasterMapStyle;

  return (
    <MapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      width={width}
      height={height}
      onViewportChange={onViewportChange}
      onClick={onClick}
      className={className}
      mapStyle={mapStyle}
      getCursor={getCursor}
      transformRequest={transformRequest}
      doubleClickZoom={false}
      ref={mapRef}
    >
      {children}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
