import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { HTMLOverlay, MapEvent } from 'react-map-gl';
import { useQuery } from '../../hooks';
import { Column } from '../../layoutComponents';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { DrawRouteLayer, Mode } from './DrawRouteLayer';
import { DynamicInfraLinksVectorLayer } from './DynamicInfraLinksVectorLayer';
import { DynamicStopVectorLayer } from './DynamicStopVectorLayer';
import { InfraLinksVectorLayer } from './InfraLinksVectorLayer';
import { Maplibre } from './Maplibre';
import { MarkerLayer } from './MarkerLayer';
import { RouteLayer } from './RouteLayer';
import { StopVectorLayer } from './StopVectorLayer';

interface Props {
  drawable?: boolean;
  drawingMode?: Mode;
  className?: string;
  width?: string;
  height?: string;
}

export const MapComponent = (
  {
    drawable,
    drawingMode,
    className,
    width = '100vw',
    height = '100vh',
  }: Props,
  externalRef: Ref<ExplicitAny>,
): JSX.Element => {
  const { routeId } = useQuery();
  const routeSelected = !!routeId;

  const [showInfraLinks, setShowInfraLinks] = useState(!routeSelected);
  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(routeSelected);
  const [showStops, setShowStops] = useState(!routeSelected);
  const [showDynamicStops, setShowDynamicStops] = useState(false);

  // TODO: avoid any type
  const editorLayerRef = useRef<ExplicitAny>(null);
  const markerLayerRef = useRef<ExplicitAny>(null);

  useImperativeHandle(externalRef, () => ({
    onDeleteDrawnRoute: () => {
      if (editorLayerRef.current) {
        editorLayerRef.current.onDeleteRoute();
      }
    },
  }));

  const onCreateMarker = (e: MapEvent) => {
    if (markerLayerRef.current && drawingMode === undefined) {
      markerLayerRef.current.onCreateMarker(e);
    }
  };

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onCreateMarker}
      className={className}
    >
      {drawable && <DrawRouteLayer mode={drawingMode} ref={editorLayerRef} />}
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
          </Column>
        )}
      />
      {showInfraLinks && <InfraLinksVectorLayer />}
      {showStops && <StopVectorLayer />}
      {showDynamicStops && <DynamicStopVectorLayer />}
      {showDynamicInfraLinks && <DynamicInfraLinksVectorLayer />}
      {showRoute && routeSelected && <RouteLayer routeId={routeId as string} />}
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
