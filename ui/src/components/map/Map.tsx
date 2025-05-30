import React, {
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Layer, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import {
  useAppDispatch,
  useAppSelector,
  useGetRoutesDisplayedInMap,
} from '../../hooks';
import { Column, Visible } from '../../layoutComponents';
import {
  MapEntityEditorViewState,
  Mode,
  isPlacingOrMoving,
  selectHasDraftLocation,
  selectHasDraftRouteGeometry,
  selectMapFilter,
  selectMapRouteEditor,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectSelectedRouteId,
  setSelectedRouteIdAction,
} from '../../redux';
import { CustomOverlay } from './CustomOverlay';
import { DrawRouteLayer } from './DrawRouteLayer';
import { ItemTypeFiltersOverlay } from './filters/ItemTypeFiltersOverlay';
import { MapFilterPanel } from './MapFilterPanel';
import { Maplibre } from './Maplibre';
import { InfraLinksVectorLayer } from './network';
import { ObservationDateOverlay } from './ObservationDateOverlay';
import {
  EditorLayerRef,
  RouteEditorRef,
  StopAreasRef,
  StopsRef,
} from './refTypes';
import {
  DraftRouteGeometryLayer,
  EditRouteMetadataLayer,
  RouteEditor,
  isRouteGeometryLayer,
  mapLayerIdToRouteId,
} from './routes';
import { ExistingRouteGeometryLayer } from './routes/ExistingRouteGeometryLayer';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopAreas } from './stop-areas';
import { Stops } from './stops';

type MapProps = {
  readonly className?: string;
  readonly width?: string;
  readonly height?: string;
};

export const MapComponent: ForwardRefRenderFunction<
  RouteEditorRef,
  MapProps
> = ({ className = '', width = '100vw', height = '100vh' }, externalRef) => {
  const routeEditorRef = useRef<RouteEditorRef>(null);
  const editorLayerRef = useRef<EditorLayerRef>(null);
  const stopsRef = useRef<StopsRef>(null);
  const stopAreasRef = useRef<StopAreasRef>(null);

  const { drawingMode } = useAppSelector(selectMapRouteEditor);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const hasDraftStopLocation = useAppSelector(selectHasDraftLocation);
  const { showMapEntityTypeFilterOverlay } = useAppSelector(selectMapFilter);

  const dispatch = useAppDispatch();
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const { displayedRouteIds } = useGetRoutesDisplayedInMap();

  const routeDisplayed = !!displayedRouteIds?.length;

  const [showInfraLinks, setShowInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(true);

  const mapStopViewState = useAppSelector(selectMapStopViewState);
  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);

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

  const onCreateStopArea = (e: MapLayerMouseEvent) => {
    if (stopAreasRef.current && drawingMode === undefined) {
      stopAreasRef.current.onCreateStopArea(e);
    }
  };

  const onMoveStop = (e: MapLayerMouseEvent) => {
    if (!drawingMode) {
      stopsRef.current?.onMoveStop(e);
    }
  };

  const onMoveStopArea = (e: MapLayerMouseEvent) => {
    stopAreasRef.current?.onMoveStopArea(e);
  };

  const onClick = (e: MapLayerMouseEvent): void => {
    if (mapStopViewState === MapEntityEditorViewState.PLACE) {
      return onCreateStop(e);
    }

    if (mapStopViewState === MapEntityEditorViewState.MOVE) {
      return onMoveStop(e);
    }

    if (mapStopAreaViewState === MapEntityEditorViewState.PLACE) {
      return onCreateStopArea(e);
    }

    if (mapStopAreaViewState === MapEntityEditorViewState.MOVE) {
      return onMoveStopArea(e);
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

        return undefined;
      }
    }

    // If clicked away, unselect route (if any)
    if (selectedRouteId) {
      dispatch(setSelectedRouteIdAction(undefined));
    }

    return undefined;
  };

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onClick}
      className={className}
    >
      <Stops ref={stopsRef} />
      <StopAreas ref={stopAreasRef} />
      <CustomOverlay position="top-left">
        <Column className="items-start overflow-hidden p-2">
          <MapFilterPanel
            routeDisplayed={routeDisplayed}
            showInfraLinks={showInfraLinks}
            showRoute={showRoute}
            setShowInfraLinks={setShowInfraLinks}
            setShowRoute={setShowRoute}
          />
          {(!!selectedRouteId || hasDraftRouteGeometry) && (
            <RouteStopsOverlay className="mt-2 max-h-[60vh] overflow-hidden" />
          )}
        </Column>
      </CustomOverlay>
      <CustomOverlay position="bottom-right">
        <Column className="items-end p-2">
          {showMapEntityTypeFilterOverlay && (
            <ItemTypeFiltersOverlay className="mb-2" />
          )}
          <ObservationDateOverlay />
        </Column>
      </CustomOverlay>
      <EditRouteMetadataLayer />
      <InfraLinksVectorLayer
        enableInfraLinkLayer={
          showInfraLinks ||
          isPlacingOrMoving(mapStopViewState) ||
          hasDraftStopLocation
        }
        showInfraLinks={showInfraLinks}
      />
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
      {showRoute &&
        routeDisplayed &&
        displayedRouteIds?.map((item) => (
          <ExistingRouteGeometryLayer
            key={item}
            routeId={item}
            isSelected={selectedRouteId === item && !hasDraftRouteGeometry}
          />
        ))}
      <DraftRouteGeometryLayer />
      <RouteEditor
        onDeleteDrawnRoute={() => editorLayerRef.current?.onDelete()}
        ref={routeEditorRef}
      />
      <Visible visible={drawingMode === Mode.Draw || drawingMode === Mode.Edit}>
        <DrawRouteLayer editorLayerRef={editorLayerRef} />
      </Visible>
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
