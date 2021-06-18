import { LatLng } from 'leaflet';

const mapLatLngToGeoJson = (latlng: LatLng) => ({
  type: 'Point',
  coordinates: [latlng.lat, latlng.lng],
});

const mapDataToMutation = <T>(data: T) => ({ variables: data });

export const mapToInsertablePoint = (latlng: LatLng) =>
  mapDataToMutation({
    geojson: mapLatLngToGeoJson(latlng),
  });

// eslint-disable-next-line camelcase
export const mapLatLngToPointMutation = (point_id: string, latlng: LatLng) =>
  mapDataToMutation({
    point_id,
    geojson: mapLatLngToGeoJson(latlng),
  });

// eslint-disable-next-line camelcase
export const mapToDeletePoint = (point_id: string) =>
  mapDataToMutation({
    point_id,
  });
