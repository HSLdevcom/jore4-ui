import { FC } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import { mapGeoJSONtoFeature } from '../../../utils';

export type ArrowLayout = {
  readonly 'symbol-placement': 'line' | 'point' | 'line-center' | undefined;
  readonly 'symbol-spacing': number;
  readonly 'icon-allow-overlap': boolean;
  readonly 'icon-image': string;
  readonly 'icon-offset': [number, number];
};
export type ArrowPaint = {
  readonly 'icon-color': string;
};
type ArrowRenderLayerProps = {
  readonly layerId: string;
  readonly geometry: GeoJSON.LineString;
  readonly beforeId?: string;
  readonly layout?: Partial<ArrowLayout>;
  readonly paint?: ArrowPaint;
  readonly minzoom?: number;
};

// this layer renders a static arrows
export const ArrowRenderLayer: FC<ArrowRenderLayerProps> = ({
  layerId,
  geometry,
  beforeId,
  layout,
  paint,
  minzoom,
}) => {
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
