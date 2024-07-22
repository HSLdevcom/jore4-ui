import along from '@turf/along';
import length from '@turf/length';
import { Feature, LineString } from 'geojson';
import flow from 'lodash/flow';
import { Point } from '../types';

export const mapPointToGeoJSON = ({
  longitude,
  latitude,
  elevation = 0,
}: Point) => {
  const geoJsonPoint: GeoJSON.Point = {
    type: 'Point',
    coordinates: [longitude, latitude, elevation],
  };
  return geoJsonPoint;
};

export const mapLngLatToPoint = (lngLat: ReadonlyArray<number>): Point => {
  if (lngLat.length < 2 || lngLat.length > 3) {
    throw new Error(
      `Expected lngLat to be like [number, number] or [number, number, number] but got ${lngLat}`,
    );
  }
  return {
    longitude: lngLat[0],
    latitude: lngLat[1],
    elevation: lngLat[2] ?? 0,
  };
};

export const mapLngLatToGeoJSON = flow(mapLngLatToPoint, mapPointToGeoJSON);

export function mapGeoJSONtoFeature<T extends GeoJSON.Geometry>(geoJson: T) {
  const feature: GeoJSON.Feature<T> = {
    type: 'Feature',
    geometry: geoJson,
    properties: {},
  };
  return feature;
}

/**
 * Takes a LineString and returns a Point at a specified relative distance along the line.
 * @param feature input feature
 * @param percentage relative distance along the line
 * @returns Point `percentage`% along the line
 */
export const relativeAlong = (
  feature: Feature<LineString>,
  percentage: number,
) => {
  const featureLength = length(feature);

  return along(feature, featureLength * percentage);
};

export function isGeoJSONPoint(
  geometry: GeoJSON.Geometry,
): geometry is GeoJSON.Point {
  return geometry.type === 'Point';
}

export function getGeometryPoint(geometry: null | undefined): null;
export function getGeometryPoint(geometry: GeoJSON.Geometry): Point | null;
export function getGeometryPoint(
  geometry: GeoJSON.Geometry | null | undefined,
): Point | null;
export function getGeometryPoint(
  geometry: GeoJSON.Geometry | null | undefined,
): Point | null {
  if (geometry && isGeoJSONPoint(geometry)) {
    return mapLngLatToPoint(geometry.coordinates);
  }

  return null;
}

export function getPointPosition(geometry: null | undefined): null;
export function getPointPosition(
  geometry: GeoJSON.Geometry,
): GeoJSON.Position | null;
export function getPointPosition(
  geometry: GeoJSON.Geometry | null | undefined,
): GeoJSON.Position | null;
export function getPointPosition(
  geometry: GeoJSON.Geometry | null | undefined,
): GeoJSON.Position | null {
  if (geometry && isGeoJSONPoint(geometry)) {
    return geometry.coordinates;
  }

  return null;
}
