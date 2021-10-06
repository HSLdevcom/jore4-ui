import React, { FunctionComponent, useRef, useState } from 'react';
import { HTMLOverlay, MapEvent } from 'react-map-gl';
import { useQuery } from '../../hooks';
import { Column } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';
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
  className?: string;
  width?: string;
  height?: string;
}

export const Map: FunctionComponent<Props> = ({
  className,
  width = '100vw',
  height = '100vh',
}) => {
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
      editorLayerRef.current.onDeleteRoute();
    }
  };

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onCreateMarker}
      className={className}
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
              Delete route
            </SimpleButton>
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
