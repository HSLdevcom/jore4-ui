import { Position } from '@turf/helpers';
import flow from 'lodash/flow';
import { LngLat } from 'react-map-gl';
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

export const mapPositionToPoint = (position: Position) => {
  if (position.length < 2 || position.length > 3) {
    throw new Error(
      `Expected position to be like [number, number] or [number, number, number] but got ${position}`,
    );
  }
  const point: Point = {
    longitude: position[0],
    latitude: position[1],
    elevation: position[2] || 0,
  };
  return point;
};

export const mapLngLatToPoint = (lngLat: LngLat) => {
  const point: Point = {
    longitude: lngLat.lng,
    latitude: lngLat.lat,
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
