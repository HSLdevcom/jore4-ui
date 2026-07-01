import isEmpty from 'lodash/isEmpty';
import { FC, useCallback, useEffect, useRef } from 'react';
import { MapRef, useMap } from 'react-map-gl/maplibre';
import { useGetRouteDetailsByIdQuery } from '../../../generated/graphql';
import { mapRouteToInfraLinksAlongRoute } from '../../../graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  LoadingState,
  Mode,
  Operation,
  selectEditedRouteData,
  selectMapRouteEditor,
  stopRouteEditingAction,
} from '../../../redux';
import { removeRoute } from '../../../utils/map';
import { useLoader } from '../../common/hooks/useLoader';
import { DrawControl } from '../DrawControl';
import { ACTIVE_LINE_STROKE_ID } from './editorStyles';
import {
  LineStringFeature,
  mapInfraLinksToFeature,
  useSnappingLine,
} from './hooks';
import {
  DRAW_VERTEX_LAYER_IDS,
  NEW_ROUTE_ARROWS_ID,
  NEW_ROUTE_LINE_ID,
  SNAPPING_LINE_LAYER_ID,
} from './utils';

const setCursor = (map: MapRef | undefined, drawingMode: Mode | undefined) => {
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
};

export const DrawRouteLayer: FC = () => {
  const drawRef = useRef<MapboxDraw | null>(null);
  const { current: map } = useMap();
  const dispatch = useAppDispatch();
  const { setLoadingState: setRouteDrawLoadingState } = useLoader(
    Operation.PrepareRouteDraw,
  );

  const editedRouteData = useAppSelector(selectEditedRouteData);
  const { drawingMode } = useAppSelector(selectMapRouteEditor);
  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);
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

  const { debouncedOnAddRoute, snappingLine, setSnappingLine } =
    useSnappingLine(map);

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

    // If creating new route (without a template) or snapping line already exists,
    // no need to initialize snapping line
    if (!snappingLine) {
      if (
        creatingNewRoute &&
        !templateRouteId &&
        editedRouteData.infraLinks &&
        !isEmpty(editedRouteData.infraLinks)
      ) {
        const infraSnappingLine = mapInfraLinksToFeature(
          editedRouteData.infraLinks,
        );
        setSnappingLine(infraSnappingLine);
        addSnappingLineToMap(infraSnappingLine);
      }

      if (drawingMode === Mode.Edit && baseRoute) {
        // Starting to edit a route, generate snapping line from infra links
        const infraLinks = mapRouteToInfraLinksAlongRoute(baseRoute);
        const infraSnappingLine = mapInfraLinksToFeature(infraLinks);
        setSnappingLine(infraSnappingLine);
        debouncedOnAddRoute(infraSnappingLine);
        addSnappingLineToMap(infraSnappingLine);
      }
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

    if (isDrawReady()) {
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

  // If we don't have metadata, we should not render <DrawControl>
  // useControl hook inside <DrawControl> do not rerender correctly and have an incorrect state
  if (!editedRouteData.metaData) {
    return null;
  }

  const stopRouteEditing = () => {
    dispatch(stopRouteEditingAction());
    setCursor(map, Mode.Edit);
  };

  const updateLineOnMap = (e: { features: ReadonlyArray<object> }) => {
    const snappingLineFeature = e.features[0] as LineStringFeature;
    setSnappingLine(snappingLineFeature);
    debouncedOnAddRoute(snappingLineFeature);
  };

  const onCreate = (e: { features: ReadonlyArray<object> }) => {
    updateLineOnMap(e);
    stopRouteEditing();
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
      onUpdate={updateLineOnMap}
    />
  );
};
