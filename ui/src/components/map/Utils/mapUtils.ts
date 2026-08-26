import type { Geometry } from 'geojson';
import compact from 'lodash/compact';
import { LayerSpecification } from 'maplibre-gl';
import { RefObject } from 'react';
import { MapInstance, MapRef } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';
import { isRouteGeometryLayer } from '../Routes/utils';

/*
 * Checks if the map style exists and that it has finished loading. This is needed before performing operations on the map, such as adding/manipulating layers or sources.
 */
export function isMapStyleReady(map: MapInstance) {
  return !!map?.style && map.isStyleLoaded() === true;
}

// Construct an array of interactive (e.g. hoverable) layer ids
export function getInteractiveLayerIds(mapRef: RefObject<MapRef>) {
  // Get all rendered layer ids
  const layers = mapRef.current
    ?.getMap()
    .getStyle()
    .layers.map((layer: LayerSpecification) => layer.id)
    // Filter only layer ids that are route geometry layers
    .filter(isRouteGeometryLayer);

  return compact(layers);
}

export function removeRoute(map: MapInstance | undefined, id: string) {
  if (!map || !isMapStyleReady(map)) {
    return;
  }
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
  // when route is created with map.addLayer, corresponding
  // source seems to be also created and we have to remove
  // also it before we can create new route with same id
  if (map.getSource(id)) {
    map.removeSource(id);
  }
}

export function addRoute(map: MapInstance, id: string, geometry: Geometry) {
  if (!isMapStyleReady(map)) {
    return;
  }

  // remove possible existing layers with same id
  removeRoute(map, id);
  map.addLayer({
    id,
    type: 'line',
    source: {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry,
      },
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': theme.colors.selectedMapItem,
      'line-width': 8,
      'line-opacity': 1,
      'line-offset': 6,
    },
  });
}
