import type { Geometry } from 'geojson';
import { MapInstance } from 'react-map-gl/maplibre';
import { theme } from '../../../../generated/theme';
import {
  interactiveLayerMetadata,
  isMapStyleReady,
} from '../../Utils/mapUtils';
import {
  ROUTE_ID_FROM_LAYER_ID_REGEX,
  ROUTE_LAYER_ID_PREFIX,
} from './layerIds';

// Utilities to allow finding the original route's id based on the layer's id
export function isRouteGeometryLayer(layerId: string) {
  return layerId.startsWith(ROUTE_LAYER_ID_PREFIX);
}

export function mapLayerIdToRouteId(layerId: string) {
  const matches = layerId.match(ROUTE_ID_FROM_LAYER_ID_REGEX);

  return matches?.length ? (matches[0] as UUID) : undefined;
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
    metadata: interactiveLayerMetadata(),
  });
}
