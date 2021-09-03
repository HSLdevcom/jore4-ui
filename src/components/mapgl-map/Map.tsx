import React, { FunctionComponent, useRef, useState } from 'react';
import MapGL, { HTMLOverlay, MapEvent, NavigationControl } from 'react-map-gl';
import { useQuery } from '../../hooks';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { DynamicInfraLinksVectorLayer } from './DynamicInfraLinksVectorLayer';
import { InfraLinksVectorLayer } from './InfraLinksVectorLayer';
import { MarkerLayer } from './MarkerLayer';
import { RouteLayer } from './RouteLayer';
import { StopVectorLayer } from './StopVectorLayer';

interface Props {
  className?: string;
}

const helsinkiCityCenterCoordinates = { latitude: 60.1716, longitude: 24.9409 };

export const Map: FunctionComponent<Props> = ({ className }) => {
  const [viewport, setViewport] = useState({
    ...helsinkiCityCenterCoordinates,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });

  const { routeId } = useQuery();
  const routeSelected = !!routeId;

  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(
    !routeSelected,
  );
  const [showInfraLinks, setShowInfraLinks] = useState(!routeSelected);
  const [showRoute, setShowRoute] = useState(routeSelected);
  const [showStops, setShowStops] = useState(!routeSelected);

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
            className="ml-8 mt-8"
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
              ...(routeSelected
                ? [
                    {
                      iconClassName: 'icon-route',
                      enabled: showRoute,
                      onToggle: setShowRoute,
                    },
                  ]
                : []),
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
      {showRoute && routeSelected && <RouteLayer routeId={routeId as string} />}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
