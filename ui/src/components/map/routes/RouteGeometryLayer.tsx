import { FC } from 'react';
import { theme } from '../../../generated/theme';
import { ArrowLayout, ArrowPaint, ArrowRenderLayer } from './ArrowRenderLayer';
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
  const beforeId = isHighlighted ? undefined : 'route_base';

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
