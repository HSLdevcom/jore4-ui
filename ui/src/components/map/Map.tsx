import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  MutableRefObject,
  RefObject,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Column } from '../../layoutComponents';
import {
  MapEntityEditorViewState,
  isPlacingOrMoving,
  selectHasDraftLocation,
  selectMapFilter,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectMapTerminalViewState,
  selectSelectedRouteId,
  setSelectedRouteIdAction,
} from '../../redux';
import { CustomOverlay } from './CustomOverlay';
import { ItemTypeFiltersOverlay } from './filters/ItemTypeFiltersOverlay';
import { MapFilterPanel } from './MapFilterPanel';
import { Maplibre } from './Maplibre';
import { InfraLinksVectorLayer } from './network';
import { ObservationDateOverlay } from './ObservationDateOverlay';
import { useGetMapData } from './queries/useGetMapData';
import {
  RouteEditorRef,
  StopAreasRef,
  StopsRef,
  TerminalsRef,
} from './refTypes';
import { Routes, isRouteGeometryLayer, mapLayerIdToRouteId } from './routes';
import { RouteStopsOverlay } from './routes/RouteStopsOverlay';
import { StopAreas } from './stop-areas';
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
  const [showInfraLinks, setShowInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(true);

  const editorRefs = useEditorRefs();
  const mapViewState = useMapViewState();

  useRouteEditorImperativeHandle(externalRef, editorRefs.routeEditorRef);
  const onClick = useOnClickMap(editorRefs, mapViewState);

  const hasDraftStopLocation = useAppSelector(selectHasDraftLocation);
  const { showMapEntityTypeFilterOverlay } = useAppSelector(selectMapFilter);

  const { areas, displayedRouteIds, stops, terminals } = useGetMapData();

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onClick}
      className={className}
    >
      <Stops
        stops={stops}
        terminals={terminals}
        displayedRouteIds={displayedRouteIds}
        ref={editorRefs.stopsRef}
      />
      <StopAreas areas={areas} ref={editorRefs.stopAreasRef} />
      <Terminals terminals={terminals} ref={editorRefs.terminalsRef} />

      <MemberStopLines areas={areas} stops={stops} terminals={terminals} />

      <CustomOverlay position="top-left">
        <Column className="items-start overflow-hidden p-2">
          <MapFilterPanel
            routeDisplayed={!!displayedRouteIds.length}
            showInfraLinks={showInfraLinks}
            showRoute={showRoute}
            setShowInfraLinks={setShowInfraLinks}
            setShowRoute={setShowRoute}
          />
          <RouteStopsOverlay className="mt-2 max-h-[60vh] overflow-hidden" />
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
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
