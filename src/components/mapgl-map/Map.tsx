import React, { FunctionComponent, useRef, useState } from 'react';
import MapGL, { HTMLOverlay, MapEvent, NavigationControl } from 'react-map-gl';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { DRLayer } from './DRLayer';
import { ExampleRoute } from './ExampleRoute';
import { MarkerLayer } from './MarkerLayer';
import { PreRenderedRouteLayer } from './PreRenderedRouteLayer';
import { StopLayer } from './StopLayer';

interface Props {
  className?: string;
}

export const Map: FunctionComponent<Props> = ({ className }) => {
  const [viewport, setViewport] = useState({
    latitude: 60.1716,
    longitude: 24.9409,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });

  const [showRoutes, setShowRoutes] = useState(true);
  const [showPreRenderedRoutes, setShowPreRenderedRoutes] = useState(true);
  const [showExampleRoute, setShowExampleRoute] = useState(true);
  const [showStops, setShowStops] = useState(true);

  // TODO: avoid any type
  const markerLayerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const navStyle = {
    bottom: 72,
    right: 0,
    padding: '10px',
  };

  const onCreateMarker = (e: MapEvent) => {
    if (markerLayerRef.current) {
      markerLayerRef.current.onCreateMarker(e);
    }
  };

  return (
    <MapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="https://raw.githubusercontent.com/HSLdevcom/hsl-map-style/master/simple-style.json"
      mapboxApiAccessToken=""
      mapboxApiUrl=""
      onViewportChange={setViewport}
      onClick={onCreateMarker}
      className={className}
    >
      <MarkerLayer ref={markerLayerRef} />
      <HTMLOverlay
        redraw={() => (
          <FilterPanel
            className="ml-8 mt-8 w-48"
            routes={[
              {
                iconClassName: 'icon-bus',
                enabled: showRoutes,
                onToggle: setShowRoutes,
              },
              {
                iconClassName: 'icon-route',
                enabled: showPreRenderedRoutes,
                onToggle: setShowPreRenderedRoutes,
              },
              {
                iconClassName: 'icon-route',
                enabled: showExampleRoute,
                onToggle: setShowExampleRoute,
              },
            ]}
            stops={[
              {
                iconClassName: 'icon-bus',
                enabled: showStops,
                onToggle: setShowStops,
              },
            ]}
          />
        )}
      />
      {showRoutes && <DRLayer />}
      {showStops && <StopLayer />}
      {/* PreRenderedRouteLayer is used when serving pre-rendered route from mbtiles... */}
      {showPreRenderedRoutes && <PreRenderedRouteLayer />}
      {showExampleRoute && <ExampleRoute />}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
