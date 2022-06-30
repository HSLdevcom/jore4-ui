import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { Layer, MapLayerMouseEvent } from 'react-map-gl';
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
import { FilterPanel, LoadingOverlay } from '../../uiComponents';
import { CustomOverlay } from './CustomOverlay';
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
  width?: string;
  height?: string;
}

export const MapComponent = (
  { drawable = false, width = '100vw', height = '100vh' }: Props,
  externalRef: Ref<ExplicitAny>,
): JSX.Element => {
  const routeEditorRef = useRef<ExplicitAny>(null);

  const { drawingMode, initiallyDisplayedRouteIds, isLoading } =
    useAppSelector(selectMapEditor);

  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const { showStopFilterOverlay } = useAppSelector(selectMapFilter);

  const dispatch = useAppDispatch();
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const { displayedRouteIds } = useGetDisplayedRoutes();

  const routeDisplayed = !!initiallyDisplayedRouteIds?.length;

  const [showInfraLinks, setShowInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
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

  const onCreateStop = (e: MapLayerMouseEvent) => {
    if (stopsRef.current && drawingMode === undefined) {
      stopsRef.current.onCreateStop(e);
    }
  };

  const onClick = (e: MapLayerMouseEvent) => {
    if (isCreateStopModeEnabled) {
      onCreateStop(e);
      return;
    }

    // Retrieve all rendered features on the map
    const { features } = e;

    // If the clicked feature was a route, select it
    if (features?.length) {
      const routeFeatures = features.filter((feature) =>
        isRouteGeometryLayer(feature.layer.id),
      );

      if (routeFeatures.length) {
        const routeId = mapLayerIdToRouteId(routeFeatures[0].layer.id);

        // set clicked route as selected
        dispatch(setSelectedRouteIdAction(routeId));

        return;
      }
    }

    // If clicked away, unselect route (if any)
    if (selectedRouteId) {
      dispatch(setSelectedRouteIdAction(undefined));
    }
  };

  return (
    <Maplibre width={width} height={height} onClick={onClick}>
      {showStops && <Stops ref={stopsRef} />}
      <CustomOverlay position="top-left">
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
      </CustomOverlay>
      <CustomOverlay position="top-left" className="right-0 bottom-0">
        <Column>
          {showStopFilterOverlay && (
            <StopFilterOverlay className="mr-12 mb-4" />
          )}
          <ObservationDateOverlay className="mr-12 mb-3" />
        </Column>
      </CustomOverlay>
      <EditRouteMetadataLayer />
      {/* TODO: route drawing does not currently work with react-map-gl v7.
      See https://github.com/uber/nebula.gl/issues/769 and https://github.com/visgl/react-map-gl/issues/1892 for more details. The problem seems to be that ModeHandler depends on MapContext that has been removed. */}
      {false && drawable && (
        <DrawRouteLayer mode={drawingMode} ref={editorLayerRef} />
      )}
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
      <LoadingOverlay visible={isLoading} />
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
