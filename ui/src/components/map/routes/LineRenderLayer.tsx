import { Layer, Source } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';
import { mapGeoJSONtoFeature } from '../../../utils';

export interface LinePaint {
  'line-color': string;
  'line-width': number;
  'line-offset': number;
}

interface LineLayout {
  'line-join': 'round' | 'bevel' | 'miter' | undefined;
  'line-cap': 'round' | 'butt' | 'square' | undefined;
}
interface Props {
  layerId: string;
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString;
  beforeId?: string;
  layout?: Partial<LineLayout>;
  paint?: Partial<LinePaint>;
}

// this layer renders a static line
export const LineRenderLayer = ({
  layerId,
  geometry,
  beforeId,
  layout,
  paint,
}: Props) => {
  const defaultLayout: LineLayout = {
    'line-join': 'round',
    'line-cap': 'round',
  };

  const defaultPaint = {
    'line-color': theme.colors.routes.bus,
    'line-width': 8,
    'line-offset': 6,
  };

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
