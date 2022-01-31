import React, {
  Ref,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { HTMLOverlay, MapEvent } from 'react-map-gl';
import { MapEditorContext } from '../../context/MapEditorContext';
import { Column } from '../../layoutComponents';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { DrawRouteLayer } from './DrawRouteLayer';
import { DynamicInfraLinksVectorLayer } from './DynamicInfraLinksVectorLayer';
import { InfraLinksVectorLayer } from './InfraLinksVectorLayer';
import { Maplibre } from './Maplibre';
import { RouteLayer } from './RouteLayer';
import { Routes } from './Routes';
import { Stops } from './Stops';

interface Props {
  drawable?: boolean;
  canAddStops?: boolean;
  className?: string;
  width?: string;
  height?: string;
}

export const MapComponent = (
  {
    drawable = false,
    canAddStops = false,
    className,
    width = '100vw',
    height = '100vh',
  }: Props,
  externalRef: Ref<ExplicitAny>,
): JSX.Element => {
  const {
    state: { displayedRouteIds },
  } = useContext(MapEditorContext);
  const routeSelected = !!(displayedRouteIds && displayedRouteIds.length > 0);

  const [showInfraLinks, setShowInfraLinks] = useState(!routeSelected);
  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(routeSelected);
  const [showStops, setShowStops] = useState(!routeSelected);
  const [showDynamicStops, setShowDynamicStops] = useState(false);
  const {
    state: { drawingMode },
  } = useContext(MapEditorContext);

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
      {showStops && <Stops ref={stopsRef} />}
      <Routes />
      {drawable && <DrawRouteLayer mode={drawingMode} ref={editorLayerRef} />}
      {showInfraLinks && <InfraLinksVectorLayer />}
      {showDynamicInfraLinks && <DynamicInfraLinksVectorLayer />}
      {showRoute &&
        routeSelected &&
        displayedRouteIds.map((item) => (
          <RouteLayer key={item} routeId={item} />
        ))}
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
