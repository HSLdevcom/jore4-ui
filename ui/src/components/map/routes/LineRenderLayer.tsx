import { FC } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';
import { mapGeoJSONtoFeature } from '../../../utils';

export type LinePaint = {
  readonly 'line-color': string;
  readonly 'line-dasharray'?: number[];
  readonly 'line-offset': number;
  readonly 'line-opacity'?: number;
  readonly 'line-width': number;
};

type LineLayout = {
  readonly 'line-join': 'round' | 'bevel' | 'miter' | undefined;
  readonly 'line-cap': 'round' | 'butt' | 'square' | undefined;
};

type LineRenderLayerProps = {
  readonly layerId: string;
  readonly geometry: GeoJSON.LineString | GeoJSON.MultiLineString;
  readonly beforeId?: string;
  readonly layout?: Partial<LineLayout>;
  readonly paint?: Partial<LinePaint>;
};

const defaultLayout: LineLayout = {
  'line-join': 'round',
  'line-cap': 'round',
};

const defaultPaint = {
  'line-color': theme.colors.routes.bus,
  'line-width': 8,
  'line-offset': 6,
};

// this layer renders a static line
export const LineRenderLayer: FC<LineRenderLayerProps> = ({
  layerId,
  geometry,
  beforeId,
  layout,
  paint,
}) => {
  return (
    <Source type="geojson" data={mapGeoJSONtoFeature(geometry)}>
      <Layer
        id={layerId}
        type="line"
        paint={{ ...defaultPaint, ...paint }}
        layout={{ ...defaultLayout, ...layout }}
        beforeId={beforeId}
      />
    </Source>
  );
};
