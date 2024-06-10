import { Layer, Source } from 'react-map-gl/maplibre';
import { mapGeoJSONtoFeature } from '../../../utils';

interface Props {
  layerId: string;
  geometry: GeoJSON.LineString;
  beforeId?: string;
  layout?: Partial<ArrowLayout>;
  paint?: ArrowPaint;
  minzoom?: number;
}

export interface ArrowLayout {
  'symbol-placement': 'line' | 'point' | 'line-center' | undefined;
  'symbol-spacing': number;
  'icon-allow-overlap': boolean;
  'icon-image': string;
  'icon-offset': [number, number];
}

export interface ArrowPaint {
  'icon-color': string;
}
// this layer renders a static arrows
export const ArrowRenderLayer = ({
  layerId,
  geometry,
  beforeId,
  layout,
  paint,
  minzoom,
}: Props) => {
  const defaultLayout: Partial<ArrowLayout> = {
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
        minzoom={minzoom}
      />
    </Source>
  );
};
