import { along, length } from '@turf/turf';
import type { Feature, LineString } from 'geojson';
import flow from 'lodash/flow';
import {
  StopRegistryGeoJson,
  StopRegistryGeoJsonType,
} from '../generated/graphql';
import { NonNullableKeys, Point } from '../types';

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

export type StopRegistryGeoJsonDefined = {
  coordinates: GeoJSON.Position;
  type: StopRegistryGeoJsonType;
};

export const mapPointToStopRegistryGeoJSON = ({
  longitude,
  latitude,
}: Point): StopRegistryGeoJsonDefined => {
  const coordinates: GeoJSON.Position = [
    longitude,
    latitude,
    /* Tiamat does not support altitude, and currently breaks quite badly if one attempts to persist it. */
  ];
  return {
    coordinates,
    type: StopRegistryGeoJsonType.Point,
  };
};

export const mapLngLatToPoint = (
  lngLat: ReadonlyArray<number>,
  maxPrecision: number = 10,
): Point => {
  if (lngLat.length < 2 || lngLat.length > 3) {
    throw new Error(
      `Expected lngLat to be like [number, number] or [number, number, number] but got ${lngLat}`,
    );
  }

  const [lon, lat, ele = 0] = lngLat;

  return {
    longitude: maxPrecision ? Number(lon.toPrecision(maxPrecision)) : lon,
    latitude: maxPrecision ? Number(lat.toPrecision(maxPrecision)) : lat,
    elevation: maxPrecision ? Number(ele.toPrecision(maxPrecision)) : ele,
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

export type ValidGeoJsonPoint = Required<
  NonNullableKeys<StopRegistryGeoJson, 'coordinates'>
> & { type: StopRegistryGeoJsonType.Point };

export function isValidGeoJSONPoint(
  geometry: GeoJSON.Geometry | StopRegistryGeoJson | null | undefined,
): geometry is ValidGeoJsonPoint {
  return (
    !!geometry && geometry.type === 'Point' && !!geometry.coordinates?.length
  );
}

export function getGeometryPoint(geometry: undefined): null;
export function getGeometryPoint(geometry: null): null;
export function getGeometryPoint(geometry: GeoJSON.Point): Point;
export function getGeometryPoint(
  geometry: GeoJSON.Geometry | StopRegistryGeoJson | null | undefined,
): Point | null;
export function getGeometryPoint(
  geometry: GeoJSON.Geometry | StopRegistryGeoJson | null | undefined,
): Point | null {
  if (isValidGeoJSONPoint(geometry)) {
    return mapLngLatToPoint(geometry.coordinates);
  }

  return null;
}

export function getPointPosition(
  geometry: GeoJSON.Geometry | StopRegistryGeoJson | null | undefined,
): GeoJSON.Position | null {
  if (isValidGeoJSONPoint(geometry)) {
    return geometry.coordinates;
  }

  return null;
}
