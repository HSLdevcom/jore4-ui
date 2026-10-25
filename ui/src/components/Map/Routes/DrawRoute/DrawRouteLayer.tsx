import isEmpty from 'lodash/isEmpty';
import { FC, useCallback, useEffect, useRef } from 'react';
import { MapRef, useMap } from 'react-map-gl/maplibre';
import { useGetRouteDetailsByIdQuery } from '../../../../generated/graphql';
import {
  Mode,
  Operation,
  selectEditedRouteData,
  selectMapRouteEditor,
  stopExistingRouteRedrawAction,
  stopRouteEditingAction,
  useAppDispatch,
  useAppSelector,
  useLoader,
} from '../../../../redux';
import { LoadingState } from '../../../../types';
import {
  ACTIVE_LINE_STROKE_ID,
  DRAW_VERTEX_LAYER_IDS,
  NEW_ROUTE_ARROWS_ID,
  NEW_ROUTE_LINE_ID,
  SNAPPING_LINE_LAYER_ID,
  removeRoute,
} from '../Utils';
import { DrawControl } from './DrawControl';
import { LineStringFeature } from './types';
import {
  mapInfraLinksToFeature,
  mapRouteToInfraLinksAlongRoute,
  useSnappingLine,
} from './Utils';

type DrawEvent = { features: ReadonlyArray<object> };

function setCursor(map: MapRef | undefined, drawingMode: Mode | undefined) {
  if (!map) {
    return;
  }
  const canvas = map.getCanvas();
  switch (drawingMode) {
    case Mode.Draw:
      canvas.style.cursor = 'crosshair';
      break;
    case Mode.Edit:
      canvas.style.cursor = 'auto';
      break;
    default:
      canvas.style.cursor = 'auto';
  }
}

export const DrawRouteLayer: FC = () => {
  const drawRef = useRef<MapboxDraw | null>(null);
  // Tracks the latest delete version already processed in this mounted layer,
  // so the same delete event is handled once while still allowing repeated
  // delete confirmations to trigger cleanup.
  const handledDeleteVersionRef = useRef(0);
  const { current: map } = useMap();
  const dispatch = useAppDispatch();
  const { setLoadingState: setRouteDrawLoadingState } = useLoader(
    Operation.PrepareRouteDraw,
  );

  const editedRouteData = useAppSelector(selectEditedRouteData);
  const {
    drawingMode,
    creatingNewRoute,
    suppressBaseRouteRehydrate,
    routeGeometryDeleteVersion,
  } = useAppSelector(selectMapRouteEditor);
  const isNewRouteDrawPhase =
    creatingNewRoute && !editedRouteData.geometry && drawingMode !== undefined;

  useEffect(() => {
    setCursor(map, isNewRouteDrawPhase ? Mode.Draw : drawingMode);

    // DrawRouteLayer unmounts when drawingMode becomes undefined.
    // Reset cursor explicitly on unmount so stale crosshair does not persist.
    return () => {
      setCursor(map, undefined);
    };
  }, [drawingMode, isNewRouteDrawPhase, map]);

  const { templateRouteId } = editedRouteData;
  // Fetch existing route's stops and geometry in case editing existing route
  // or creating a new route based on a template route

  const baseRouteId = editedRouteData.id ?? templateRouteId;

  const baseRouteResult = useGetRouteDetailsByIdQuery({
    skip: !baseRouteId,
    // If baseRouteId is undefined, this query is skipped
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { routeId: baseRouteId! },
  });

  const baseRoute = baseRouteResult.data?.route_route_by_pk ?? undefined;

  const clearDrawControlFeatures = useCallback(() => {
    drawRef.current?.deleteAll();
  }, []);

  const { debouncedOnAddRoute, snappingLine, setSnappingLine } =
    useSnappingLine(map, clearDrawControlFeatures);

  const clearDrawnRouteGeometry = useCallback(() => {
    drawRef.current?.deleteAll();
    setSnappingLine(null);
    removeRoute(map?.getMap(), SNAPPING_LINE_LAYER_ID);
  }, [map, setSnappingLine]);

  const hasPendingGeometryDeleteEvent =
    routeGeometryDeleteVersion !== handledDeleteVersionRef.current;
  const shouldHandleGeometryDeleteEvent =
    hasPendingGeometryDeleteEvent &&
    suppressBaseRouteRehydrate &&
    !creatingNewRoute &&
    drawingMode === Mode.Edit;

  useEffect(() => {
    if (!shouldHandleGeometryDeleteEvent) {
      return;
    }

    // Consume this delete event version so it is not re-applied on rerender.
    handledDeleteVersionRef.current = routeGeometryDeleteVersion;

    // Prevent delayed geometry updates from re-adding the deleted snapping line.
    debouncedOnAddRoute.cancel();

    // Remove route geometry from DrawControl internals as well as map layers.
    clearDrawnRouteGeometry();
  }, [
    clearDrawnRouteGeometry,
    debouncedOnAddRoute,
    routeGeometryDeleteVersion,
    shouldHandleGeometryDeleteEvent,
  ]);

  const addSnappingLineToMap = (infraSnappingLine: LineStringFeature) => {
    drawRef.current?.add({
      id: SNAPPING_LINE_LAYER_ID,
      ...infraSnappingLine,
    });
    drawRef.current?.changeMode('direct_select', {
      featureId: SNAPPING_LINE_LAYER_ID,
    });
  };

  const moveLayers = useCallback(
    (layerIds: ReadonlyArray<string>) => {
      if (map?.getLayer(`${ACTIVE_LINE_STROKE_ID}.cold`)) {
        layerIds.forEach((layerId) => {
          if (map?.getLayer(layerId)) {
            map?.moveLayer(layerId, `${ACTIVE_LINE_STROKE_ID}.cold`);
          }
        });
      }
    },
    [map],
  );

  // Initializing snapping line
  useEffect(() => {
    moveLayers([
      SNAPPING_LINE_LAYER_ID,
      NEW_ROUTE_ARROWS_ID,
      NEW_ROUTE_LINE_ID,
    ]);

    const shouldHydrateFromDraftInfraLinks =
      creatingNewRoute &&
      !templateRouteId &&
      editedRouteData.infraLinks &&
      !isEmpty(editedRouteData.infraLinks);
    const shouldHydrateFromBaseRoute =
      drawingMode === Mode.Edit && baseRoute && !suppressBaseRouteRehydrate;

    if (!snappingLine && shouldHydrateFromDraftInfraLinks) {
      const infraSnappingLine = mapInfraLinksToFeature(
        editedRouteData.infraLinks,
      );
      setSnappingLine(infraSnappingLine);
      addSnappingLineToMap(infraSnappingLine);
    }

    if (!snappingLine && shouldHydrateFromBaseRoute) {
      // Starting to edit a route, generate snapping line from infra links
      const infraLinks = mapRouteToInfraLinksAlongRoute(baseRoute);
      const infraSnappingLine = mapInfraLinksToFeature(infraLinks);
      setSnappingLine(infraSnappingLine);
      debouncedOnAddRoute(infraSnappingLine);
      addSnappingLineToMap(infraSnappingLine);
    }

    // Remove snapping line on unmount
    return () => {
      removeRoute(map?.getMap(), SNAPPING_LINE_LAYER_ID);
    };
  }, [
    baseRoute,
    creatingNewRoute,
    debouncedOnAddRoute,
    drawingMode,
    editedRouteData.infraLinks,
    map,
    moveLayers,
    setSnappingLine,
    snappingLine,
    suppressBaseRouteRehydrate,
    templateRouteId,
  ]);

  const keyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      drawRef.current?.trash();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keyDown, false);

    return () => {
      document.removeEventListener('keydown', keyDown, false);
    };
  }, [keyDown]);

  // Check that draw is ready before removing loader in new route draw phase and allowing user to start drawing
  useEffect(() => {
    const mapInstance = map?.getMap();

    // Ensure prepare-draw loader does not leak when user exits draw phase
    // before draw internals finish initializing.
    if (!isNewRouteDrawPhase) {
      setRouteDrawLoadingState(LoadingState.NotLoading);
      return undefined;
    }

    const isDrawReady = (): boolean => {
      const hasDrawRef = !!drawRef.current;
      const hasDrawHotSource = !!mapInstance?.getSource('mapbox-gl-draw-hot');
      const hasDrawColdSource = !!mapInstance?.getSource('mapbox-gl-draw-cold');

      return hasDrawRef && hasDrawHotSource && hasDrawColdSource;
    };

    const handleDrawLoadingState = () => {
      if (isDrawReady()) {
        setRouteDrawLoadingState(LoadingState.NotLoading);
        mapInstance?.off('sourcedata', handleDrawLoadingState);
        mapInstance?.off('idle', handleDrawLoadingState);
      } else {
        setRouteDrawLoadingState(LoadingState.HighPriority);
      }
    };

    // Fast path: draw can already be ready on first run of this effect.
    // Clear loader immediately instead of waiting for sourcedata/idle events
    // that may never fire after readiness has already been reached.
    if (isDrawReady()) {
      setRouteDrawLoadingState(LoadingState.NotLoading);
      return undefined;
    }

    setRouteDrawLoadingState(LoadingState.HighPriority);
    mapInstance?.on('sourcedata', handleDrawLoadingState);
    mapInstance?.on('idle', handleDrawLoadingState);

    return () => {
      mapInstance?.off('sourcedata', handleDrawLoadingState);
      mapInstance?.off('idle', handleDrawLoadingState);
    };
  }, [isNewRouteDrawPhase, map, setRouteDrawLoadingState]);

  // Cursor handling for vertices and midpoints in edit mode
  useEffect(() => {
    const mapInstance = map?.getMap();
    if (!mapInstance || drawingMode !== Mode.Edit) {
      return undefined;
    }

    let isHoveringVertex = false;
    let isDraggingVertex = false;

    const setCursorStyle = (cursor: 'auto' | 'grab' | 'grabbing') => {
      mapInstance.getCanvas().style.cursor = cursor;
    };

    const onVertexMouseEnter = () => {
      isHoveringVertex = true;
      setCursorStyle(isDraggingVertex ? 'grabbing' : 'grab');
    };

    const onVertexMouseLeave = () => {
      isHoveringVertex = false;
      if (!isDraggingVertex) {
        setCursorStyle('auto');
      }
    };

    const onVertexMouseDown = () => {
      isDraggingVertex = true;
      setCursorStyle('grabbing');
    };

    const onMouseUp = () => {
      if (isDraggingVertex) {
        isDraggingVertex = false;
        setCursorStyle(isHoveringVertex ? 'grab' : 'auto');
      }
    };

    DRAW_VERTEX_LAYER_IDS.forEach((layerId) => {
      mapInstance.on('mouseenter', layerId, onVertexMouseEnter);
      mapInstance.on('mouseleave', layerId, onVertexMouseLeave);
      mapInstance.on('mousedown', layerId, onVertexMouseDown);
    });
    mapInstance.on('mouseup', onMouseUp);

    return () => {
      DRAW_VERTEX_LAYER_IDS.forEach((layerId) => {
        mapInstance.off('mouseenter', layerId, onVertexMouseEnter);
        mapInstance.off('mouseleave', layerId, onVertexMouseLeave);
        mapInstance.off('mousedown', layerId, onVertexMouseDown);
      });
      mapInstance.off('mouseup', onMouseUp);
      setCursorStyle('auto');
    };
  }, [drawingMode, map]);

  useEffect(() => {
    if (drawingMode !== Mode.Draw) {
      return;
    }

    // DrawControl can remain mounted when switching Edit -> Draw,
    // so explicitly force line draw mode for redraw/new draw flows.
    drawRef.current?.changeMode('draw_line_string');
  }, [drawingMode]);

  // If we don't have metadata, we should not render <DrawControl>
  // useControl hook inside <DrawControl> do not rerender correctly and have an incorrect state
  if (!editedRouteData.metaData) {
    return null;
  }

  const finishDrawing = () => {
    // In existing-route redraw flow, return to edit mode after drawing is complete.
    if (suppressBaseRouteRehydrate && creatingNewRoute) {
      dispatch(stopExistingRouteRedrawAction());
      setCursor(map, Mode.Edit);
      return;
    }

    // Default behavior for regular draw/create flow.
    dispatch(stopRouteEditingAction());
    setCursor(map, Mode.Edit);
  };

  const queueGeometryUpdateFromDrawEvent = (event: DrawEvent) => {
    const snappingLineFeature = event.features[0] as LineStringFeature;
    const startedInCreationFlowAtDrawTime =
      creatingNewRoute || drawingMode === Mode.Draw;
    setSnappingLine(snappingLineFeature);
    // Capture draw/create state at enqueue time. The debounced handler runs
    // later and editor mode may already have transitioned back to edit.
    debouncedOnAddRoute(snappingLineFeature, startedInCreationFlowAtDrawTime);
  };

  const onCreate = (event: DrawEvent) => {
    queueGeometryUpdateFromDrawEvent(event);
    // A new-route draw unmounts this layer on completion; start the queued
    // geometry update before its unmount cleanup cancels the debounce timer.
    debouncedOnAddRoute.flush();
    finishDrawing();
  };

  const onModeChange = () => {
    const hasSnappingLine = !!drawRef.current?.get(SNAPPING_LINE_LAYER_ID);
    // Disables all other modes when editing
    // Don't allow to change mode if snapping line does not exist because it's required for direct_select
    if (drawingMode === Mode.Edit && hasSnappingLine) {
      drawRef.current?.changeMode('direct_select', {
        featureId: SNAPPING_LINE_LAYER_ID,
      });
    }
  };

  return (
    <DrawControl
      ref={drawRef}
      defaultMode="draw_line_string"
      onCreate={onCreate}
      onModeChange={onModeChange}
      onUpdate={queueGeometryUpdateFromDrawEvent}
    />
  );
};
