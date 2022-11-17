import along from '@turf/along';
import { Feature, LineString } from '@turf/helpers';
import length from '@turf/length';
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

export const mapLngLatToPoint = (lngLat: number[]) => {
  if (lngLat.length < 2 || lngLat.length > 3) {
    throw new Error(
      `Expected lngLat to be like [number, number] or [number, number, number] but got ${lngLat}`,
    );
  }
  const point: Point = {
    longitude: lngLat[0],
    latitude: lngLat[1],
    elevation: lngLat[2] || 0,
  };
  return point;
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
