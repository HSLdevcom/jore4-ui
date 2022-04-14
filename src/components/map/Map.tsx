import React, {
  Ref,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { HTMLOverlay, MapEvent } from 'react-map-gl';
import { MapEditorContext } from '../../context/MapEditor';
import { MapFilterContext } from '../../context/MapFilter';
import { useAppSelector, useGetDisplayedRoutes } from '../../hooks';
import { Column } from '../../layoutComponents';
import { selectIsCreateStopModeEnabled } from '../../redux';
import { FilterPanel } from '../../uiComponents';
import { Maplibre } from './Maplibre';
import { DynamicInfraLinksVectorLayer, InfraLinksVectorLayer } from './network';
import { ObservationDateOverlay } from './ObservationDateOverlay';
import { DrawRouteLayer, RouteLayer, Routes } from './routes';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopFilterOverlay } from './StopFilterOverlay';
import { Stops } from './stops'; // eslint-disable-line import/no-cycle

interface Props {
  drawable?: boolean;
  className?: string;
  width?: string;
  height?: string;
}

export const MapComponent = (
  { drawable = false, className, width = '100vw', height = '100vh' }: Props,
  externalRef: Ref<ExplicitAny>,
): JSX.Element => {
  const {
    state: { drawingMode, hasRoute, initiallyDisplayedRouteIds },
  } = useContext(MapEditorContext);
  const {
    state: { showStopFilterOverlay },
  } = useContext(MapFilterContext);

  const { displayedRouteIds } = useGetDisplayedRoutes();

  const routeSelected = !!initiallyDisplayedRouteIds?.length;

  const [showInfraLinks, setShowInfraLinks] = useState(!routeSelected);
  const [showDynamicInfraLinks, setShowDynamicInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(routeSelected);
  const [showStops, setShowStops] = useState(true);
  const [showDynamicStops, setShowDynamicStops] = useState(false);

  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);

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
      onClick={isCreateStopModeEnabled ? onCreateStop : undefined}
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
                <RouteStopsOverlay className="ml-8 mt-4" />
              </Column>
            )}
          </>
        )}
        captureClick
        captureDoubleClick
        captureDrag
        captureScroll
      />
      <HTMLOverlay
        style={{
          top: 'auto',
          left: 'auto',
          bottom: 0,
          right: 0,
          width: 'auto',
          height: 'auto',
        }}
        redraw={() => (
          <Column>
            {showStopFilterOverlay && (
              <StopFilterOverlay className="mr-12 mb-4" />
            )}
            <ObservationDateOverlay className="mr-12 mb-8" />
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
        displayedRouteIds?.map((item) => (
          <RouteLayer key={item} routeId={item} />
        ))}
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
