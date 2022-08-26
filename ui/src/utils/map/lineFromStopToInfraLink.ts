import { point, Feature, LineString } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import pointToLineDistance from '@turf/point-to-line-distance';
import { Coords } from '../../types';
import {
  removeLayer,
  MaplibreGLMap,
  Geometry,
  createGeometryLineBetweenPoints,
} from './mapUtils';

interface FeatureAndDistance {
  feature: Feature<LineString>;
  distance: number;
}

const INFRA_CONNECTION_NAME = 'infraConnection';

// Name of the road layer in digiroad material
const ROAD_LAYER_ID = 'digiroad_r_links';

const SEARCH_RADIUS_IN_PIXELS = 100;

const findFeaturesForLayerWithRadius = (
  map: MaplibreGLMap,
  layerId: string,
  coords: Coords,
  radius: number,
) => {
  if (map.getLayer(layerId)) {
    return map.queryRenderedFeatures(
      [
        [coords.x - radius, coords.y - radius],
        [coords.x + radius, coords.y + radius],
      ],
      { layers: [layerId] },
    );
  }
  return [];
};

export const removeLineFromStopToInfraLink = (map: MaplibreGLMap) => {
  removeLayer(map, INFRA_CONNECTION_NAME);
};

export const addLineFromStopToInfraLink = (
  map: MaplibreGLMap,
  geometry: Geometry,
) => {
  const source = map.getSource(INFRA_CONNECTION_NAME);
  if (!source) {
    map.addSource(INFRA_CONNECTION_NAME, {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry },
    });
  } else {
    source.setData({
      type: 'Feature',
      properties: {},
      geometry,
    });
  }

  if (!map.getLayer(INFRA_CONNECTION_NAME)) {
    map.addLayer({
      id: INFRA_CONNECTION_NAME,
      type: 'line',
      source: INFRA_CONNECTION_NAME,
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-color': 'darkGrey',
        'line-width': 4,
        'line-opacity': 1,
        'line-offset': 0,
        'line-dasharray': [1, 1.5],
      },
    });
  }
};

export const drawLineToClosestRoad = (map: MaplibreGLMap, coords: Coords) => {
  const features: Feature<LineString>[] = findFeaturesForLayerWithRadius(
    map,
    ROAD_LAYER_ID,
    coords,
    SEARCH_RADIUS_IN_PIXELS,
  );

  if (features) {
    // convert cursor location from pixel coordinates to lat/lng
    const cursorLocation = point(map.unproject(coords).toArray());

    // pair each network connection with the distance from the coordinates
    const linesWithDistance: FeatureAndDistance[] = features.map((line) => ({
      feature: line,
      distance: pointToLineDistance(cursorLocation, line, { units: 'meters' }),
    }));

    // find the nearest network connection
    const nearestLine = linesWithDistance.reduce((prev, next) =>
      prev.distance < next.distance ? prev : next,
    ).feature;

    // find the nearest point on the nearest network connection
    const nearestPoint = nearestPointOnLine(nearestLine, cursorLocation);

    const lineToNetworkConnection = createGeometryLineBetweenPoints(
      nearestPoint.geometry.coordinates,
      cursorLocation.geometry.coordinates,
    );

    addLineFromStopToInfraLink(map, lineToNetworkConnection);
  } else {
    removeLineFromStopToInfraLink(map);
  }
};
