import { FC, useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';
import { useAppSelector } from '../../../hooks';
import { selectMapRouteEditor } from '../../../redux';
import { ArrowLayout, ArrowPaint, ArrowRenderLayer } from './ArrowRenderLayer';
import { ACTIVE_LINE_STROKE_ID } from './editorStyles';
import { LinePaint, LineRenderLayer } from './LineRenderLayer';
import {
  NEW_ROUTE_ARROWS_ID,
  NEW_ROUTE_LINE_ID,
  mapRouteIdToArrowLayerId,
  mapRouteIdToLineLayerId,
} from './utils';

const { colors } = theme;

type RouteGeometryLayerProps = {
  readonly routeId?: UUID;
  readonly geometry: GeoJSON.LineString;
  readonly defaultColor?: string;
  readonly isHighlighted: boolean;
};

// This layer renders route on map
export const RouteGeometryLayer: FC<RouteGeometryLayerProps> = ({
  routeId,
  geometry,
  defaultColor = colors.routes.bus,
  isHighlighted,
}) => {
  const { current: map } = useMap();
  const { drawingMode } = useAppSelector(selectMapRouteEditor);
  const hasActiveLineStrokeLayer = !!map?.getLayer(ACTIVE_LINE_STROKE_ID);
  const beforeId =
    isHighlighted && hasActiveLineStrokeLayer
      ? ACTIVE_LINE_STROKE_ID
      : 'route_base';

  const color = isHighlighted ? colors.selectedMapItem : defaultColor;

  // Offset line to right side of the infra link
  const lineOffset = 6;

  const linePaint: LinePaint = {
    'line-color': color,
    'line-width': isHighlighted ? 9 : 8,
    'line-offset': lineOffset,
  };

  const arrowLayout: Partial<ArrowLayout> = {
    'icon-offset': [0, lineOffset],
  };

  const arrowPaint: ArrowPaint = {
    'icon-color': color,
  };

  const lineRenderLayerId = routeId
    ? mapRouteIdToLineLayerId(routeId)
    : NEW_ROUTE_LINE_ID;
  const arrowRenderLayerId = routeId
    ? mapRouteIdToArrowLayerId(routeId)
    : NEW_ROUTE_ARROWS_ID;

  // Cursor handling for route geometry layer
  useEffect(() => {
    const mapInstance = map?.getMap();
    if (!mapInstance || drawingMode !== undefined) {
      return undefined;
    }

    const setPointerCursor = () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    };
    const resetCursor = () => {
      mapInstance.getCanvas().style.cursor = 'auto';
    };

    mapInstance.on('mouseenter', lineRenderLayerId, setPointerCursor);
    mapInstance.on('mouseleave', lineRenderLayerId, resetCursor);
    mapInstance.on('mouseenter', arrowRenderLayerId, setPointerCursor);
    mapInstance.on('mouseleave', arrowRenderLayerId, resetCursor);

    return () => {
      mapInstance.off('mouseenter', lineRenderLayerId, setPointerCursor);
      mapInstance.off('mouseleave', lineRenderLayerId, resetCursor);
      mapInstance.off('mouseenter', arrowRenderLayerId, setPointerCursor);
      mapInstance.off('mouseleave', arrowRenderLayerId, resetCursor);
      resetCursor();
    };
  }, [arrowRenderLayerId, drawingMode, lineRenderLayerId, map]);

  return (
    <>
      <LineRenderLayer
        layerId={lineRenderLayerId}
        geometry={geometry}
        paint={linePaint}
        beforeId={beforeId}
      />
      <ArrowRenderLayer
        layerId={arrowRenderLayerId}
        geometry={geometry}
        layout={arrowLayout}
        paint={arrowPaint}
        beforeId={lineRenderLayerId}
        minzoom={12}
      />
    </>
  );
};
