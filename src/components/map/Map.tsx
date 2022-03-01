import React, {
  Ref,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { HTMLOverlay, MapEvent } from 'react-map-gl';
import { MapEditorContext } from '../../context/MapEditorContext';
import { useGetRoutesWithInfrastructureLinksQuery } from '../../generated/graphql';
import { mapRoutesDetailsResult } from '../../graphql';
import { Column } from '../../layoutComponents';
import { FilterPanel } from '../../uiComponents/FilterPanel';
import { mapToVariables } from '../../utils';
import { DrawRouteLayer } from './DrawRouteLayer';
import { DynamicInfraLinksVectorLayer } from './DynamicInfraLinksVectorLayer';
import { InfraLinksVectorLayer } from './InfraLinksVectorLayer';
import { Maplibre } from './Maplibre';
import { RouteLayer } from './RouteLayer';
import { Routes } from './Routes';
import { Stops } from './Stops';
import { StopsModal } from './StopsModal';

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
    state: {
      displayedRouteIds,
      editedRouteData,
      creatingNewRoute,
      drawingMode,
      hasRoute,
    },
  } = useContext(MapEditorContext);

  const routeSelected = !!(displayedRouteIds && displayedRouteIds.length > 0);

  const [showInfraLinks, setShowInfraLinks] = useState(!routeSelected);
  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(routeSelected);
  const [showStops, setShowStops] = useState(!routeSelected);
  const [showDynamicStops, setShowDynamicStops] = useState(false);

  // TODO: avoid any type
  const editorLayerRef = useRef<ExplicitAny>(null);
  const stopsRef = useRef<ExplicitAny>(null);

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds || [] }),
  );

  const routes = mapRoutesDetailsResult(routesResult);

  const editedRouteMetadata = creatingNewRoute
    ? editedRouteData.metaData
    : routes?.[0];

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
          <>
            <Column className="items-start">
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
            {hasRoute && (
              <Column>
                <StopsModal
                  className="ml-8 mt-4"
                  stopIds={editedRouteData.stopIds}
                  route={editedRouteMetadata}
                />
              </Column>
            )}
          </>
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
