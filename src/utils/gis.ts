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

export const mapGeoJSONtoFeature = (geoJson: GeoJSON.Geometry) => {
  const feature: GeoJSON.Feature = {
    type: 'Feature',
    geometry: geoJson,
    properties: {},
  };
  return feature;
};
