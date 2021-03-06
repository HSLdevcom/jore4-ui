import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { HTMLOverlay, Layer, MapEvent } from 'react-map-gl';
import {
  useAppDispatch,
  useAppSelector,
  useGetDisplayedRoutes,
} from '../../hooks';
import { Column } from '../../layoutComponents';
import {
  selectHasDraftRouteGeometry,
  selectIsCreateStopModeEnabled,
  selectMapEditor,
  selectMapFilter,
  selectSelectedRouteId,
  setSelectedRouteIdAction,
} from '../../redux';
import { FilterPanel } from '../../uiComponents';
import { Maplibre } from './Maplibre';
import { InfraLinksVectorLayer } from './network';
import { ObservationDateOverlay } from './ObservationDateOverlay';
import {
  DrawRouteLayer,
  EditRouteMetadataLayer,
  isRouteGeometryLayer,
  mapLayerIdToRouteId,
  RouteEditor,
  RouteGeometryLayer,
} from './routes';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopFilterOverlay } from './StopFilterOverlay';
import { Stops } from './stops';

interface Props {
  drawable?: boolean;
  className?: string;
  width?: string;
  height?: string;
}

export const MapComponent = (
  {
    drawable = false,
    className = '',
    width = '100vw',
    height = '100vh',
  }: Props,
  externalRef: Ref<ExplicitAny>,
): JSX.Element => {
  const routeEditorRef = useRef<ExplicitAny>(null);

  const { drawingMode, initiallyDisplayedRouteIds } =
    useAppSelector(selectMapEditor);

  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const { showStopFilterOverlay } = useAppSelector(selectMapFilter);

  const dispatch = useAppDispatch();
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const { displayedRouteIds } = useGetDisplayedRoutes();

  const routeDisplayed = !!initiallyDisplayedRouteIds?.length;

  const [showInfraLinks, setShowInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(routeDisplayed);
  const [showStops, setShowStops] = useState(true);

  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);

  // TODO: avoid any type
  const editorLayerRef = useRef<ExplicitAny>(null);
  const stopsRef = useRef<ExplicitAny>(null);

  useImperativeHandle(externalRef, () => ({
    onDrawRoute: () => {
      routeEditorRef.current?.onDrawRoute();
    },
    onEditRoute: () => {
      routeEditorRef.current?.onEditRoute();
    },
    onDeleteRoute: () => {
      routeEditorRef.current?.onDeleteRoute();
    },
    onCancel: () => {
      routeEditorRef.current?.onCancel();
    },
    onSave: () => {
      routeEditorRef.current?.onSave();
    },
  }));

  const onCreateStop = (e: MapEvent) => {
    if (stopsRef.current && drawingMode === undefined) {
      stopsRef.current.onCreateStop(e);
    }
  };

  const onClick = (e: MapEvent) => {
    if (isCreateStopModeEnabled) {
      onCreateStop(e);
      return;
    }

    // Check if route feature has been clicked
    // If so, extract route id from the layer
    const { features } = e;

    if (features?.length) {
      const routeFeatures = features.filter((feature) =>
        isRouteGeometryLayer(feature.layer.id),
      );

      if (routeFeatures.length) {
        const clickedFeatureId = mapLayerIdToRouteId(routeFeatures[0].layer.id);
        dispatch(setSelectedRouteIdAction(clickedFeatureId));

        return;
      }
    }

    if (selectedRouteId) {
      dispatch(setSelectedRouteIdAction(undefined));
    }
  };

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onClick}
      className={className}
    >
      {showStops && <Stops ref={stopsRef} />}
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
                  ...(routeDisplayed
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
            </Column>
            {(!!selectedRouteId || hasDraftRouteGeometry) && (
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
      <EditRouteMetadataLayer />
      {drawable && <DrawRouteLayer mode={drawingMode} ref={editorLayerRef} />}
      {showInfraLinks && <InfraLinksVectorLayer />}
      {showRoute &&
        routeDisplayed &&
        displayedRouteIds?.map((item) => (
          <RouteGeometryLayer
            key={item}
            routeId={item}
            isSelected={selectedRouteId === item && !hasDraftRouteGeometry}
          />
        ))}
      {/**
       * Empty layer for dynamically ordering route layers
       * https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
       */}
      <Layer
        id="route_base"
        type="background"
        layout={{ visibility: 'none' }}
        paint={{}}
      />
      <RouteEditor
        onDeleteDrawnRoute={() => editorLayerRef.current?.onDeleteRoute()}
        ref={routeEditorRef}
      />
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
