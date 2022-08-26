import { point, Feature, LineString } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import pointToLineDistance from '@turf/point-to-line-distance';
import {
  removeLayer,
  MaplibreGLMap,
  Geometry,
  geometryLineBetweenPoints,
} from '../mapUtils';

interface FeatureAndDistance {
  feature: Feature<LineString>;
  distance: number;
}

const INFRA_CONNECTION_NAME = 'infraConnection';

const findFeaturesForLayerWithRadius = (
  map: MaplibreGLMap,
  layer: string,
  x: number,
  y: number,
  radius: number,
) => {
  if (map.getLayer(layer)) {
    return map.queryRenderedFeatures(
      [
        [x - radius, y - radius],
        [x + radius, y + radius],
      ],
      { layers: [layer] },
    );
  }
  return [];
};

export const removeStopToInfraConnection = (map: MaplibreGLMap) => {
  removeLayer(map, INFRA_CONNECTION_NAME);
};

export const addStopToInfraConnection = (
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

export const drawConnectionToClosestRoad = (
  map: MaplibreGLMap,
  x: number,
  y: number,
) => {
  const searchRadius = 100;
  const roadLayer = 'digiroad_r_links';
  const features: Feature<LineString>[] = findFeaturesForLayerWithRadius(
    map,
    roadLayer,
    x,
    y,
    searchRadius,
  );

  if (features.length > 0) {
    // convert cursor location from pixel coordinates to lon/lat
    const cursorLocation = point(map.unproject({ x, y }).toArray());

    // pair each network connection with the distance from the coordinates
    const linesWithDistance: FeatureAndDistance[] = features.map((line) => ({
      feature: line,
      distance: pointToLineDistance(cursorLocation, line, { units: 'meters' }),
    }));

    // find the nearest network connection
    const nearestLine = linesWithDistance.reduce((prev, next) => {
      return prev.distance < next.distance ? prev : next;
    }).feature;

    // find the nearest point on the nearest network connection
    const nearestPoint = nearestPointOnLine(nearestLine, cursorLocation);

    const lineToNetworkConnection = geometryLineBetweenPoints(
      nearestPoint.geometry.coordinates,
      cursorLocation.geometry.coordinates,
    );

    addStopToInfraConnection(map, lineToNetworkConnection);
  } else {
    removeStopToInfraConnection(map);
  }
};
