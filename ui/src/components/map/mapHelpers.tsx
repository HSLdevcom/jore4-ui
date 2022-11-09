import { LayerProps, MapRef } from 'react-map-gl';
import { isRouteGeometryLayer } from './routes';

export const loadMapAssets = (mapRef: React.RefObject<MapRef>) => {
  const map = mapRef.current?.getMap();

  map?.loadImage('/img/arrow-right.png', (error: unknown, image: unknown) => {
    if (error) throw error;

    // Enable sdf to make enable icon coloring.
    // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/
    if (!map.hasImage('arrow')) map.addImage('arrow', image, { sdf: true });
  });
};

export const getCursor = ({
  isHovering,
  isDragging,
}: {
  isLoaded: boolean;
  isDragging: boolean;
  isHovering: boolean;
}) => {
  if (isDragging) {
    return 'grabbing';
  }

  return isHovering ? 'pointer' : 'default';
};

// Construct an array of interactive (e.g. hoverable) layer ids
export const getInteractiveLayerIds = (mapRef: React.RefObject<MapRef>) => {
  // Get all rendered layer ids
  const layers = mapRef.current
    ?.getMap()
    ?.getStyle()
    ?.layers?.map((layer: LayerProps) => layer.id);

  // Filter only layer ids that are route geometry layers
  return layers?.filter(isRouteGeometryLayer) || [];
};
