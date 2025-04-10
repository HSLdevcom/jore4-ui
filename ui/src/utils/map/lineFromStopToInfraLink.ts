import flatten from '@turf/flatten';
import { point } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import pointToLineDistance from '@turf/point-to-line-distance';
import { Feature, LineString, Point } from 'geojson';
import { MapInstance } from 'react-map-gl';
import { Coords } from '../../types';
import {
  Geometry,
  createGeometryLineBetweenPoints,
  removeLayer,
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
  map: MapInstance,
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

// Turn any possible MultiLineStrings in the feature into LineStrings
const getLineStringFromFeature = (feature: Feature<Geometry>) => {
  const flattened = flatten(feature);
  if (flattened.features.length > 0) {
    return flattened.features;
  }
  return [feature.geometry];
};

const distanceToNearestPointOnFeature = (
  cursorLocation: Feature<Point>,
  feature: Feature<LineString>,
) => {
  return getLineStringFromFeature(feature)
    .map((line) =>
      pointToLineDistance(cursorLocation, line, {
        units: 'meters',
      }),
    )
    .reduce((previousValue, currentValue) =>
      Math.min(previousValue, currentValue),
    );
};

export const removeLineFromStopToInfraLink = (map: MapInstance | undefined) => {
  if (map) {
    removeLayer(map, INFRA_CONNECTION_NAME);
  }
};

export const addLineFromStopToInfraLink = (
  map: MapInstance | undefined,
  geometry: Geometry,
) => {
  if (!map) {
    return;
  }

  const source = map.getSource(INFRA_CONNECTION_NAME);
  const sourceData = { type: 'Feature', properties: {}, geometry };

  if (!source) {
    map.addSource(INFRA_CONNECTION_NAME, {
      type: 'geojson',
      data: sourceData,
    });
  } else {
    source.setData(sourceData);
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

export const drawLineToClosestRoad = (
  map: MapInstance | undefined,
  coords: Coords,
) => {
  if (!map) {
    return;
  }

  const features: Feature<LineString>[] = findFeaturesForLayerWithRadius(
    map,
    ROAD_LAYER_ID,
    coords,
    SEARCH_RADIUS_IN_PIXELS,
  );

  if (features && features.length > 0) {
    // convert cursor location from pixel coordinates to lat/lng
    const cursorLocation = point(map.unproject(coords).toArray());

    // pair each network connection with the distance from the coordinates
    const linesWithDistance: FeatureAndDistance[] = features.map((line) => ({
      feature: line,
      distance: distanceToNearestPointOnFeature(cursorLocation, line),
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
