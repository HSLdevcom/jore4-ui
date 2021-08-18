import React, { FunctionComponent, useRef, useState } from 'react';
import MapGL, { HTMLOverlay, MapEvent, NavigationControl } from 'react-map-gl';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { DynamicInfraLinksVectorLayer } from './DynamicInfraLinksVectorLayer';
import { InfraLinksVectorLayer } from './InfraLinksVectorLayer';
import { MarkerLayer } from './MarkerLayer';
import { StopVectorLayer } from './StopVectorLayer';

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

  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(true);
  const [showInfraLinks, setShowInfraLinks] = useState(true);
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
            className="ml-8 mt-8 w-32"
            routes={[
              {
                iconClassName: 'icon-bus',
                enabled: showDynamicInfraLinks,
                onToggle: setShowDynamicInfraLinks,
              },
              {
                iconClassName: 'icon-route',
                enabled: showInfraLinks,
                onToggle: setShowInfraLinks,
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
      {showDynamicInfraLinks && <DynamicInfraLinksVectorLayer />}
      {showStops && <StopVectorLayer />}
      {showInfraLinks && <InfraLinksVectorLayer />}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
