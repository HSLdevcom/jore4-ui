import { Layer, Source } from 'react-map-gl';
import { mapGeoJSONtoFeature } from '../../../utils';

interface Props {
  layerId: string;
  geometry: GeoJSON.LineString;
  beforeId?: string;
  layout?: Partial<mapboxgl.SymbolLayout>;
  paint?: Partial<mapboxgl.SymbolPaint>;
}

// this layer renders a static arrows on line
export const LineArrowLayer = ({
  layerId,
  geometry,
  beforeId,
  layout,
  paint,
}: Props) => {
  const defaultLayout: mapboxgl.SymbolLayout = {
    'symbol-placement': 'line',
    'symbol-spacing': 100,
    'icon-allow-overlap': true,
    'icon-image': 'arrow',
  };

  return (
    <Source type="geojson" data={mapGeoJSONtoFeature(geometry)}>
      <Layer
        id={layerId}
        type="symbol"
        paint={{ ...paint }}
        layout={{ ...defaultLayout, ...layout }}
        beforeId={beforeId}
        minzoom={12}
      />
    </Source>
  );
};
