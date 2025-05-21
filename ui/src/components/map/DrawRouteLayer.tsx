import isEmpty from 'lodash/isEmpty';
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { MapRef, useMap } from 'react-map-gl/maplibre';
import { useGetRouteDetailsByIdQuery } from '../../generated/graphql';
import { mapRouteToInfraLinksAlongRoute } from '../../graphql';
import {
  LineStringFeature,
  mapInfraLinksToFeature,
  useAppDispatch,
  useAppSelector,
} from '../../hooks';
import { useSnappingLine } from '../../hooks/map/useSnappingLine';
import {
  Mode,
  selectEditedRouteData,
  selectMapRouteEditor,
  stopRouteEditingAction,
} from '../../redux';
import { DrawControl } from './DrawControl';
import { EditorLayerRef } from './refTypes';
import { NEW_ROUTE_ARROWS_ID, NEW_ROUTE_LINE_ID } from './routes';
import { ACTIVE_LINE_STROKE_ID } from './routes/editorStyles';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

interface Props {
  editorLayerRef: Ref<EditorLayerRef>;
}

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

export const DrawRouteLayer = ({ editorLayerRef }: Props) => {
  const drawRef = useRef<MapboxDraw | null>(null);
  const { current: mapboxDraw } = drawRef;
  const { current: map } = useMap();
  const dispatch = useAppDispatch();

  const editedRouteData = useAppSelector(selectEditedRouteData);
  const { drawingMode } = useAppSelector(selectMapRouteEditor);
  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);
  setCursor(map, drawingMode);

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

  const {
    debouncedOnAddRoute,
    removeSnappingLine,
    snappingLine,
    setSnappingLine,
  } = useSnappingLine(map);

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

  const keyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      drawRef.current?.trash();
    }
  }, []);

  useImperativeHandle(editorLayerRef, () => ({
    onDelete: removeSnappingLine,
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
    // Disables all other modes when editing
    if (drawingMode === Mode.Edit) {
      mapboxDraw?.changeMode('direct_select', {
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
