import along from '@turf/along';
import { Feature, LineString } from '@turf/helpers';
import length from '@turf/length';
import flow from 'lodash/flow';
import {
  Scalars,
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
  coordinates: Scalars['stop_registry_Coordinates'];
  type: StopRegistryGeoJsonType;
};

export const mapPointToStopRegistryGeoJSON = ({
  longitude,
  latitude,
}: Point): StopRegistryGeoJsonDefined => {
  const coordinates: Scalars['stop_registry_Coordinates'] = [
    longitude,
    latitude,
    /* Tiamat does not support altitude, and currently breaks quite badly if one attempts to persist it. */
  ];
  const geoJsonPoint = {
    coordinates,
    type: StopRegistryGeoJsonType.Point,
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

type ValidGeoJsonPoint = Required<
  NonNullableKeys<StopRegistryGeoJson, 'coordinates'>
> & { type: StopRegistryGeoJsonType.Point };

export function isValidGeoJSONPoint(
  geometry: GeoJSON.Geometry | StopRegistryGeoJson | null | undefined,
): geometry is ValidGeoJsonPoint {
  return (
    !!geometry && geometry.type === 'Point' && !!geometry.coordinates?.length
  );
}

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
