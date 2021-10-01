import React, { FunctionComponent, useState } from 'react';
import MapGL, { MapEvent, NavigationControl } from 'react-map-gl';
import mapStyle from './mapStyle.json';

interface Props {
  className?: string;
  // width and height are passed as params to `react-map-gl`.
  // It seems to support certain css features, e.g. "100vh" or "100px",
  // but in other hand "100%" doesn't seem to work...
  width?: string;
  height?: string;
  onClick?: (e: MapEvent) => void;
}

const helsinkiCityCenterCoordinates = { latitude: 60.1716, longitude: 24.9409 };

export const Maplibre: FunctionComponent<Props> = ({
  className,
  onClick,
  width = '100vw',
  height = '100vh',
  children,
}) => {
  const [viewport, setViewport] = useState({
    ...helsinkiCityCenterCoordinates,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });

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

  return (
    <MapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      width={width}
      height={height}
      onViewportChange={setViewport}
      onClick={onClick}
      className={className}
      mapStyle={mapStyle}
      getCursor={getCursor}
      transformRequest={transformRequest}
      doubleClickZoom={false}
    >
      {children}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
