import { LayerSpecification } from 'maplibre-gl';
import { RefObject } from 'react';
import { MapInstance, MapRef } from 'react-map-gl/maplibre';

/*
 * Checks if the map style exists and that it has finished loading. This is needed before performing operations on the map, such as adding/manipulating layers or sources.
 */
export function isMapStyleReady(map: MapInstance) {
  return !!map?.style && map.isStyleLoaded() === true;
}

const isInteractive = Symbol('jore.map.layer.isInteractive');

export function interactiveLayerMetadata(
  metadata: Readonly<Record<string | symbol, unknown>> = {},
) {
  return { [isInteractive]: true, ...metadata };
}

export function isLayerInteractive({ metadata }: LayerSpecification) {
  return (
    !!metadata &&
    typeof metadata === 'object' &&
    isInteractive in metadata &&
    metadata[isInteractive] === true
  );
}

// Construct an array of interactive (e.g. hoverable) layer ids
export function getInteractiveLayerIds(mapRef: RefObject<MapRef>) {
  // Get all rendered layer ids
  const layers = mapRef.current
    ?.getMap()
    .getStyle()
    .layers.filter(isLayerInteractive)
    .map((layer: LayerSpecification) => layer.id);

  return layers ?? [];
}
