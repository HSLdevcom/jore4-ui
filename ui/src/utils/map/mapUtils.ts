import { Geometry } from 'geojson';
import compact from 'lodash/compact';
import { LayerSpecification } from 'maplibre-gl';
import { MapInstance, MapRef } from 'react-map-gl/maplibre';
import { isRouteGeometryLayer } from '../../components/map/routes/utils';
import { theme } from '../../generated/theme';

export const removeLayer = (map: MapInstance, id: string) => {
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
};

export const createGeometryLineBetweenPoints = (
  first: GeoJSON.Position,
  second: GeoJSON.Position,
): GeoJSON.LineString => {
  return {
    type: 'LineString',
    coordinates: [first, second],
  };
};

export const loadMapAssets = (mapRef: React.RefObject<MapRef>) => {
  const map = mapRef.current?.getMap();
  if (!map) {
    return;
  }

  const imageAssets: { name: string; fileUrl: string }[] = [
    { name: 'arrow', fileUrl: '/img/arrow-right.png' },
  ];

  imageAssets.forEach(async (asset) => {
    if (map.hasImage(asset.name)) {
      return;
    }

    const response = await map.loadImage(asset.fileUrl);
    // Even though we have already checked if the map has the image,
    // we need to check it again here because this code is inside event callback
    // which could be called multiple times before the map actually has the image
    if (!map.hasImage(asset.name)) {
      // Enable Signed Distance Fields (sdf) to make enable icon coloring.
      // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/
      map.addImage(asset.name, response.data, { sdf: true });
    }
  });
};

// Construct an array of interactive (e.g. hoverable) layer ids
export const getInteractiveLayerIds = (mapRef: React.RefObject<MapRef>) => {
  // Get all rendered layer ids
  const layers = mapRef.current
    ?.getMap()
    ?.getStyle()
    ?.layers?.map((layer: LayerSpecification) => layer.id);

  // Filter only layer ids that are route geometry layers
  const tmp = layers?.filter(isRouteGeometryLayer) ?? [];
  return compact(tmp);
};

export const removeRoute = (map: MapInstance | undefined, id: string) => {
  if (!map) {
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
};

export const addRoute = (map: MapInstance, id: string, geometry: Geometry) => {
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
};
