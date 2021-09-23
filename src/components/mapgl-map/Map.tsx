import React, { FunctionComponent, useRef, useState } from 'react';
import MapGL, { HTMLOverlay, MapEvent, NavigationControl } from 'react-map-gl';
import { useQuery } from '../../hooks';
import { Column } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { DrawRouteLayer, Mode } from './DrawRouteLayer';
import { DynamicInfraLinksVectorLayer } from './DynamicInfraLinksVectorLayer';
import { DynamicStopVectorLayer } from './DynamicStopVectorLayer';
import { InfraLinksVectorLayer } from './InfraLinksVectorLayer';
import { MarkerLayer } from './MarkerLayer';
import { RouteLayer } from './RouteLayer';
import { StopVectorLayer } from './StopVectorLayer';

interface Props {
  className?: string;
  // width and height are passed as params to `react-map-gl`.
  // It seems to support certain css features, e.g. "100vh" or "100px",
  // but in other hand "100%" doesn't seem to work...
  width?: string;
  height?: string;
}

const helsinkiCityCenterCoordinates = { latitude: 60.1716, longitude: 24.9409 };

export const Map: FunctionComponent<Props> = ({
  className,
  width = '100vw',
  height = '100vh',
}) => {
  const [viewport, setViewport] = useState({
    ...helsinkiCityCenterCoordinates,
    zoom: 13,
    bearing: 0,
    pitch: 0,
  });

  const { routeId } = useQuery();
  const routeSelected = !!routeId;

  const [drawingMode, setDrawingMode] = useState<Mode | undefined>(undefined);
  const [showInfraLinks, setShowInfraLinks] = useState(!routeSelected);
  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(routeSelected);
  const [showStops, setShowStops] = useState(!routeSelected);
  const [showDynamicStops, setShowDynamicStops] = useState(false);

  // TODO: avoid any type
  const editorLayerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const markerLayerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const navStyle = {
    bottom: 72,
    right: 0,
    padding: '10px',
  };

  const onCreateMarker = (e: MapEvent) => {
    if (markerLayerRef.current && drawingMode === undefined) {
      markerLayerRef.current.onCreateMarker(e);
    }
  };

  const onToggleDrawingMode = () =>
    setDrawingMode(drawingMode !== Mode.Draw ? Mode.Draw : undefined);

  const onToggleEditMode = () =>
    setDrawingMode(drawingMode !== Mode.Edit ? Mode.Edit : undefined);

  const onDeleteDrawnRoute = () => {
    if (editorLayerRef.current) {
      editorLayerRef.current.onDeleteSelectedRoute();
    }
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

  return (
    <MapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      width={width}
      height={height}
      mapStyle="https://raw.githubusercontent.com/HSLdevcom/hsl-map-style/master/simple-style.json"
      onViewportChange={setViewport}
      onClick={onCreateMarker}
      className={className}
      getCursor={getCursor}
      transformRequest={(url: string) => {
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
      }}
      doubleClickZoom={false}
    >
      <DrawRouteLayer mode={drawingMode} ref={editorLayerRef} />
      <MarkerLayer ref={markerLayerRef} />
      <HTMLOverlay
        style={{
          width: 'auto',
          height: 'auto',
        }}
        redraw={() => (
          <Column>
            <FilterPanel
              className="ml-8 mt-8"
              routes={[
                {
                  iconClassName: 'icon-bus',
                  enabled: showInfraLinks,
                  onToggle: setShowInfraLinks,
                },
                {
                  iconClassName: 'icon-route',
                  enabled: showDynamicInfraLinks,
                  onToggle: setShowDynamicInfraLinks,
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
                {
                  iconClassName: 'icon-bus',
                  enabled: showDynamicStops,
                  onToggle: setShowDynamicStops,
                },
              ]}
            />
            <SimpleButton
              className="ml-8 mt-2"
              onClick={onToggleDrawingMode}
              inverted={drawingMode !== Mode.Draw}
            >
              Draw route
            </SimpleButton>
            <SimpleButton
              className="ml-8 mt-2"
              onClick={onToggleEditMode}
              inverted={drawingMode !== Mode.Edit}
            >
              Edit route
            </SimpleButton>
            <SimpleButton
              className="ml-8 mt-2"
              onClick={onDeleteDrawnRoute}
              inverted
            >
              Delete selected route
            </SimpleButton>
          </Column>
        )}
      />
      {showInfraLinks && <InfraLinksVectorLayer />}
      {showStops && <StopVectorLayer />}
      {showDynamicStops && <DynamicStopVectorLayer />}
      {showDynamicInfraLinks && <DynamicInfraLinksVectorLayer />}
      {showRoute && routeSelected && <RouteLayer routeId={routeId as string} />}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
