import {
  flatten,
  nearestPointOnLine,
  point,
  pointToLineDistance,
} from '@turf/turf';
import type { Feature, Geometry, LineString, Point } from 'geojson';
import minBy from 'lodash/minBy';
import {
  GeoJSONSource,
  MapGeoJSONFeature,
  Point as MapLibrePoint,
} from 'maplibre-gl';
import { MapInstance } from 'react-map-gl/maplibre';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { Point as JorePoint } from '../../types';
import { notNullish } from '../misc';
import { createGeometryLineBetweenPoints, removeLayer } from './mapUtils';

type LineAndDistance = {
  readonly line: LineString;
  readonly distance: number;
};

const INFRA_CONNECTION_NAME = 'infraConnection';

const BUS_LAYER_ID = 'digiroad_r_links_bus';
const TRAM_LAYER_ID = 'mml_links_tram';

function getLayerIdForVehicleMode(
  vehicleMode: ReusableComponentsVehicleModeEnum | null | undefined,
): string {
  // Only tram and bus have their own tile sources. All other vehicle modes fall back to the bus (digiroad) layer.
  return vehicleMode === ReusableComponentsVehicleModeEnum.Tram
    ? TRAM_LAYER_ID
    : BUS_LAYER_ID;
}

const SEARCH_RADIUS_IN_PIXELS = 100;

function findFeaturesForLayerWithRadius(
  map: MapInstance,
  layerId: string,
  coords: MapLibrePoint,
  radius: number,
) {
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
}

// Turn any possible MultiLineStrings in the feature into LineStrings
function getLineStringFromFeature({ geometry }: MapGeoJSONFeature) {
  if (geometry.type === 'LineString') {
    return [geometry];
  }

  if (geometry.type === 'MultiLineString') {
    const flattened = flatten(geometry);
    return flattened.features.map((feature) => feature.geometry);
  }

  return [];
}

function distanceToNearestPointOnLineFeature(
  cursorLocation: Point,
  feature: MapGeoJSONFeature,
): LineAndDistance | null {
  const pairs = getLineStringFromFeature(feature).map(
    (line): LineAndDistance => ({
      line,
      distance: pointToLineDistance(cursorLocation, line, {
        units: 'meters',
      }),
    }),
  );

  return minBy(pairs, (pair) => pair.distance) ?? null;
}

function findNearestPointOnLineFeatures(
  cursorLocation: Point,
  features: ReadonlyArray<MapGeoJSONFeature>,
): Point | null {
  const lineDistancePairs = features
    .map((feature) =>
      distanceToNearestPointOnLineFeature(cursorLocation, feature),
    )
    .filter(notNullish);

  const nearestLine = minBy(lineDistancePairs, (it) => it.distance);

  if (!nearestLine) {
    return null;
  }

  // find the nearest point on the nearest network connection
  return nearestPointOnLine(nearestLine.line, cursorLocation).geometry;
}

export function removeLineFromStopToInfraLink(map: MapInstance | undefined) {
  if (map) {
    removeLayer(map, INFRA_CONNECTION_NAME);
  }
}

export function addLineFromStopToInfraLink(
  map: MapInstance | undefined,
  geometry: Geometry,
) {
  if (!map) {
    return;
  }

  const source = map.getSource(INFRA_CONNECTION_NAME);
  const sourceData: Feature = { type: 'Feature', properties: {}, geometry };

  if (!source) {
    map.addSource(INFRA_CONNECTION_NAME, {
      type: 'geojson',
      data: sourceData,
    });
  } else if (source instanceof GeoJSONSource) {
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
}

export function findNearestPointOnARoad(
  map: MapInstance | undefined,
  to: JorePoint,
  vehicleMode?: ReusableComponentsVehicleModeEnum | null,
): Point | null {
  if (!map) {
    return null;
  }

  const toCoordinates: [number, number] = [to.longitude, to.latitude];

  const features: ReadonlyArray<MapGeoJSONFeature> =
    findFeaturesForLayerWithRadius(
      map,
      getLayerIdForVehicleMode(vehicleMode),
      map.project(toCoordinates),
      SEARCH_RADIUS_IN_PIXELS,
    );

  return findNearestPointOnLineFeatures(
    {
      type: 'Point',
      coordinates: toCoordinates,
    },
    features,
  );
}

export function drawLineToClosestRoad(
  map: MapInstance | undefined,
  coords: MapLibrePoint,
  vehicleMode?: ReusableComponentsVehicleModeEnum | null,
) {
  if (!map) {
    return;
  }

  const features: ReadonlyArray<MapGeoJSONFeature> =
    findFeaturesForLayerWithRadius(
      map,
      getLayerIdForVehicleMode(vehicleMode),
      coords,
      SEARCH_RADIUS_IN_PIXELS,
    );

  // convert cursor location from pixel coordinates to lat/lng
  const cursorLocation = point(map.unproject(coords).toArray()).geometry;
  const nearestPointOnFeatures = findNearestPointOnLineFeatures(
    cursorLocation,
    features,
  );

  if (nearestPointOnFeatures) {
    const lineToNetworkConnection = createGeometryLineBetweenPoints(
      nearestPointOnFeatures.coordinates,
      cursorLocation.coordinates,
    );
    addLineFromStopToInfraLink(map, lineToNetworkConnection);
  }

  if (!features.length) {
    removeLineFromStopToInfraLink(map);
  }
}
