import { Layer, Source } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';
import { mapGeoJSONtoFeature } from '../../../utils';

interface Props {
  layerId: string;
  geometry: GeoJSON.LineString;
  beforeId?: string;
  layout?: any;
  paint?: any;
}

// this layer renders a static line
export const LineRenderLayer = ({
  layerId,
  geometry,
  beforeId,
  layout,
  paint,
}: Props) => {
  const defaultLayout = {
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
