import { Layer, Source } from 'react-map-gl';
import { theme } from '../../../generated/theme';
import { mapGeoJSONtoFeature } from '../../../utils';

interface Props {
  layerId: string;
  geometry: GeoJSON.LineString;
  beforeId?: string;
  layout?: Partial<mapboxgl.LineLayout>;
  paint?: Partial<mapboxgl.LinePaint>;
}

// this layer renders a static line polygon
export const LinePolygonLayer = ({
  layerId,
  geometry,
  beforeId,
  layout,
  paint,
}: Props) => {
  const defaultLayout: mapboxgl.LineLayout = {
    'line-join': 'round',
    'line-cap': 'round',
  };

  const defaultPaint: mapboxgl.LinePaint = {
    'line-color': theme.colors.routes.bus,
    'line-width': 8,
    'line-opacity': 0.75,
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
