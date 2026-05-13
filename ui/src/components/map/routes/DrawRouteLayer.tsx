import isEmpty from 'lodash/isEmpty';
import {
  FC,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { MapRef, useMap } from 'react-map-gl/maplibre';
import { useGetRouteDetailsByIdQuery } from '../../../generated/graphql';
import { mapRouteToInfraLinksAlongRoute } from '../../../graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  Mode,
  Operation,
  resetDraftRouteGeometryAction,
  selectEditedRouteData,
  selectMapRouteEditor,
  stopRouteEditingAction,
} from '../../../redux';
import { removeRoute } from '../../../utils/map';
import { useLoader } from '../../common/hooks';
import { DrawControl } from '../DrawControl';
import { EditorLayerRef } from '../refTypes';
import { ACTIVE_LINE_STROKE_ID } from './editorStyles';
import {
  LineStringFeature,
  mapInfraLinksToFeature,
  useSnappingLine,
} from './hooks';
import {
  NEW_ROUTE_ARROWS_ID,
  NEW_ROUTE_LINE_ID,
  SNAPPING_LINE_LAYER_ID,
} from './utils';

type DrawRouteLayerProps = {
  readonly editorLayerRef: Ref<EditorLayerRef>;
};

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
  }
};

export const DrawRouteLayer: FC<DrawRouteLayerProps> = ({ editorLayerRef }) => {
  const drawRef = useRef<MapboxDraw | null>(null);
  const { current: map } = useMap();

  const { setIsLoading } = useLoader(Operation.FinalizingRoute);

  const dispatch = useAppDispatch();

  const editedRouteData = useAppSelector(selectEditedRouteData);
  const { drawingMode } = useAppSelector(selectMapRouteEditor);
  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);

  const shouldUseDrawingCursor =
    drawingMode === Mode.Edit && creatingNewRoute && !editedRouteData.geometry;
  setCursor(map, shouldUseDrawingCursor ? Mode.Draw : drawingMode);

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
    if (snappingLine) {
      return;
    }
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

  // Cleanup
  useEffect(
    () => () => {
      // Cancel any pending addRoute calls when unmounting.
      // These should have been already handled manually by calls to
      // editorLayerRef.(onCancel|onSave)
      debouncedOnAddRoute.cancel();
      // Remove the snapping line from the map.
      removeRoute(map?.getMap(), SNAPPING_LINE_LAYER_ID);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const keyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      drawRef.current?.trash();
    }
  }, []);

  useImperativeHandle(editorLayerRef, () => ({
    // Cancel any pending route change calls.
    onDrawingCanceled: () => {
      debouncedOnAddRoute.cancel();
      dispatch(resetDraftRouteGeometryAction());
    },
    // Flush any pending  route change calls, to ensure we have "saved"
    // the last interaction with the drawn line.
    onDrawingFinished: async () => {
      setIsLoading(true);
      try {
        await debouncedOnAddRoute.flush();
      } finally {
        setIsLoading(false);
      }

      return true;
    },
  }));

  useEffect(() => {
    document.addEventListener('keydown', keyDown, false);

    return () => {
      document.removeEventListener('keydown', keyDown, false);
    };
  }, [keyDown]);

  // If we don't have metadata, we should not render <DrawControl>
  // useControl hook inside <DrawControl> do not rerender correctly and have an incorrect state
  if (!editedRouteData.metaData) {
    return null;
  }

  const stopRouteEditing = async () => {
    // Make sure to flush in any potentially pending map draw actions.
    await debouncedOnAddRoute.flush();
    dispatch(stopRouteEditingAction());
    setCursor(map, Mode.Edit);
  };

  const updateLineOnMap = (e: { features: ReadonlyArray<object> }) => {
    const snappingLineFeature = e.features[0] as LineStringFeature;
    setSnappingLine(snappingLineFeature);
    debouncedOnAddRoute(snappingLineFeature);
  };

  const onCreate = (e: { features: ReadonlyArray<object> }) => {
    setIsLoading(true);
    updateLineOnMap(e);
    stopRouteEditing().finally(() => setIsLoading(false));
  };

  const onModeChange = () => {
    // Disables all other modes when editing
    if (drawingMode === Mode.Edit) {
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
