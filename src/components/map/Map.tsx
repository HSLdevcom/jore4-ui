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
import { RouteLayer } from './RouteLayer';
import { Stops } from './Stops';
import { StopVectorLayer } from './StopVectorLayer';

interface Props {
  drawable?: boolean;
  canAddStops?: boolean;
  drawingMode?: Mode;
  className?: string;
  width?: string;
  height?: string;
}

export const MapComponent = (
  {
    drawable = false,
    canAddStops = false,
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
  const stopsRef = useRef<ExplicitAny>(null);

  useImperativeHandle(externalRef, () => ({
    onDeleteDrawnRoute: () => {
      if (editorLayerRef.current) {
        editorLayerRef.current.onDeleteRoute();
      }
    },
  }));

  const onCreateStop = (e: MapEvent) => {
    if (stopsRef.current && drawingMode === undefined) {
      stopsRef.current.onCreateStop(e);
    }
  };

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={canAddStops ? onCreateStop : undefined}
      className={className}
    >
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
        captureClick
        captureDoubleClick
        captureDrag
        captureScroll
      />
      <Stops ref={stopsRef} />
      {drawable && <DrawRouteLayer mode={drawingMode} ref={editorLayerRef} />}
      {showInfraLinks && <InfraLinksVectorLayer />}
      {showStops && <StopVectorLayer />}
      {showDynamicStops && <DynamicStopVectorLayer />}
      {showDynamicInfraLinks && <DynamicInfraLinksVectorLayer />}
      {showRoute && routeSelected && <RouteLayer routeId={routeId as string} />}
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
