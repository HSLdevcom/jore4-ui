import { LayerProps, MapRef } from 'react-map-gl';
import { isRouteGeometryLayer } from '../../components/map/routes';

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

  const imageAssets: { name: string; fileUrl: string }[] = [
    { name: 'arrow', fileUrl: '/img/arrow-right.png' },
  ];

  imageAssets.forEach((asset) => {
    if (map?.hasImage(asset.name)) {
      return;
    }

    map?.loadImage(asset.fileUrl, (error: unknown, image: unknown) => {
      if (error) {
        throw error;
      }

      // Enable sdf to make enable icon coloring.
      // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/
      if (!map.hasImage(asset.name)) {
        map.addImage(asset.name, image, { sdf: true });
      }
    });
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
