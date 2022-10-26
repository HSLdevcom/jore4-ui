import { MapRef } from 'react-map-gl';

export const loadMapAssets = (mapRef: React.RefObject<MapRef>) => {
  const map = mapRef.current?.getMap();

  map?.loadImage('/img/arrow-right.png', (error: unknown, image: unknown) => {
    if (error) throw error;

    // Enable sdf to make enable icon coloring.
    // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/
    if (!map.hasImage('arrow')) map.addImage('arrow', image, { sdf: true });
  });
};
