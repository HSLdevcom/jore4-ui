import {
  ForwardRefRenderFunction,
  ForwardedRef,
  MutableRefObject,
  RefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  MapEntityEditorViewState,
  MapEntityType,
  isPlacingOrMoving,
  selectHasDraftLocation,
  selectMapFilter,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectMapTerminalViewState,
  selectSelectedRouteId,
  selectShowMapEntityTypes,
  setSelectedRouteIdAction,
} from '../../redux';
import { CustomOverlay } from './CustomOverlay';
import { ItemTypeFiltersOverlay } from './filters/ItemTypeFiltersOverlay';
import { MapFilterPanel } from './MapFilterPanel';
import { Maplibre } from './Maplibre';
import { InfraLinksVectorLayer } from './network';
import { useGetMapData } from './queries';
import {
  RouteEditorRef,
  StopAreasRef,
  StopsRef,
  TerminalsRef,
} from './refTypes';
import { Routes, isRouteGeometryLayer, mapLayerIdToRouteId } from './routes';
import { RouteStopsOverlay } from './routes/RouteStopsOverlay';
import { FunctionalAreaVisualization, StopAreas } from './stop-areas';
import { MemberStopLines, Stops } from './stops';
import { Terminals } from './terminals';

type MapViewState = {
  readonly mapStopViewState: MapEntityEditorViewState;
  readonly mapStopAreaViewState: MapEntityEditorViewState;
  readonly mapTerminalViewState: MapEntityEditorViewState;
};

type EditorRefs = {
  readonly routeEditorRef: MutableRefObject<RouteEditorRef | null>;
  readonly stopsRef: MutableRefObject<StopsRef | null>;
  readonly stopAreasRef: MutableRefObject<StopAreasRef | null>;
  readonly terminalsRef: MutableRefObject<TerminalsRef | null>;
};

function useEditorRefs(): EditorRefs {
  return {
    routeEditorRef: useRef(null),
    stopsRef: useRef(null),
    stopAreasRef: useRef(null),
    terminalsRef: useRef(null),
  };
}

function useRouteEditorImperativeHandle(
  ref: ForwardedRef<RouteEditorRef>,
  routeEditorRef: RefObject<RouteEditorRef>,
) {
  useImperativeHandle(ref, () => ({
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
}

function useMapViewState(): MapViewState {
  return {
    mapStopViewState: useAppSelector(selectMapStopViewState),
    mapStopAreaViewState: useAppSelector(selectMapStopAreaViewState),
    mapTerminalViewState: useAppSelector(selectMapTerminalViewState),
  };
}

function useHandleMapRouteClick() {
  const dispatch = useAppDispatch();
  const routeIsSelected = !!useAppSelector(selectSelectedRouteId);

  return (e: MapLayerMouseEvent) => {
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
      }

      return;
    }

    // If clicked away, unselect route (if any)
    if (routeIsSelected) {
      dispatch(setSelectedRouteIdAction(undefined));
    }
  };
}

function useOnClickMap(
  { stopsRef, stopAreasRef, terminalsRef }: EditorRefs,
  {
    mapStopViewState,
    mapStopAreaViewState,
    mapTerminalViewState,
  }: MapViewState,
) {
  const handleMapRouteClick = useHandleMapRouteClick();

  return async (e: MapLayerMouseEvent): Promise<void> => {
    if (mapStopViewState === MapEntityEditorViewState.PLACE) {
      return stopsRef.current?.onCreateStop(e);
    }

    if (mapStopViewState === MapEntityEditorViewState.MOVE) {
      return stopsRef.current?.onMoveStop(e);
    }

    if (mapStopAreaViewState === MapEntityEditorViewState.PLACE) {
      return stopAreasRef.current?.onCreateStopArea(e);
    }

    if (mapStopAreaViewState === MapEntityEditorViewState.MOVE) {
      return stopAreasRef.current?.onMoveStopArea(e);
    }

    if (mapTerminalViewState === MapEntityEditorViewState.PLACE) {
      return terminalsRef.current?.onCreateTerminal(e);
    }

    if (mapTerminalViewState === MapEntityEditorViewState.MOVE) {
      return terminalsRef.current?.onMoveTerminal(e);
    }

    return handleMapRouteClick(e);
  };
}

type MapProps = {
  readonly className?: string;
  readonly width?: string;
  readonly height?: string;
};

export const MapComponent: ForwardRefRenderFunction<
  RouteEditorRef,
  MapProps
> = ({ className = '', width = '100vw', height = '100vh' }, externalRef) => {
  const [showRoute, setShowRoute] = useState(true);

  const editorRefs = useEditorRefs();
  const mapViewState = useMapViewState();

  useRouteEditorImperativeHandle(externalRef, editorRefs.routeEditorRef);
  const onClick = useOnClickMap(editorRefs, mapViewState);

  const hasDraftStopLocation = useAppSelector(selectHasDraftLocation);
  const { showMapEntityTypeFilterOverlay } = useAppSelector(selectMapFilter);
  const showMapEntityTypes = useAppSelector(selectShowMapEntityTypes);
  const showInfraLinks = showMapEntityTypes[MapEntityType.Network];

  const { areas, displayedRouteIds, stops, terminals } = useGetMapData();

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onClick}
      className={className}
    >
      <Stops
        areas={areas}
        stops={stops}
        terminals={terminals}
        displayedRouteIds={displayedRouteIds}
        ref={editorRefs.stopsRef}
      />
      <StopAreas areas={areas} ref={editorRefs.stopAreasRef} />
      <Terminals terminals={terminals} ref={editorRefs.terminalsRef} />

      <MemberStopLines areas={areas} stops={stops} terminals={terminals} />

      <CustomOverlay
        className="col-span-2 justify-self-start"
        position="top-left"
      >
        <MapFilterPanel
          routeDisplayed={!!displayedRouteIds.length}
          showRoute={showRoute}
          setShowRoute={setShowRoute}
          className="pointer-events-auto shadow-md"
        />
      </CustomOverlay>

      {showMapEntityTypeFilterOverlay && (
        <CustomOverlay order={2} position="top-left">
          <ItemTypeFiltersOverlay className="pointer-events-auto mb-2" />
        </CustomOverlay>
      )}

      <RouteStopsOverlay className="pointer-events-auto mt-2 max-h-[60vh] overflow-hidden" />

      <InfraLinksVectorLayer
        enableInfraLinkLayer={
          showInfraLinks ||
          isPlacingOrMoving(mapViewState.mapStopViewState) ||
          hasDraftStopLocation
        }
        showInfraLinks={showInfraLinks}
      />

      <Routes
        displayedRouteIds={displayedRouteIds}
        showRoute={showRoute}
        ref={editorRefs.routeEditorRef}
      />

      <FunctionalAreaVisualization stops={stops} />
    </Maplibre>
  );
};

export const Map = forwardRef(MapComponent);
