import { MapRef } from 'react-map-gl';
// TODO: Can we import these somewhere?
export type MaplibreGLMap = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Geometry = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const removeLayer = (map: MaplibreGLMap, id: string) => {
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
};

export const createGeometryLineBetweenPoints = (
  first: GeoJSON.Position,
  second: GeoJSON.Position,
): GeoJSON.LineString => {
  return {
    type: 'LineString',
    coordinates: [first, second],
  };
};

export const loadMapAssets = (mapRef: React.RefObject<MapRef>) => {
  const map = mapRef.current?.getMap();

  map?.loadImage('/img/arrow-right.png', (error: unknown, image: unknown) => {
    if (error) throw error;

    // Enable sdf to make enable icon coloring.
    // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/
    if (!map.hasImage('arrow')) map.addImage('arrow', image, { sdf: true });
  });
};
