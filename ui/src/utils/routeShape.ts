import type { LineString } from 'geojson';
import { Maybe } from 'graphql/jsutils/Maybe';

const getFirstCoordinatesFromLineString = (routeShape: LineString) => {
  const [firstLineStringCoordinates] = routeShape.coordinates;
  const [longitude, latitude] = firstLineStringCoordinates;

  return { longitude, latitude };
};

/* This is a temporary solution to get the coordinates from route to position the map
 * to opened route
 * After react-map-gl v7 we should have a trivial way of centering the map
 */
export const getRouteShapeFirstCoordinates = (
  routeShape: Maybe<LineString>,
) => {
  // This is a temporary solution to position the map on opened route
  // After react-map-gl v7 we should have a trivial way of centering the map
  if (routeShape?.type === 'LineString') {
    return getFirstCoordinatesFromLineString(routeShape);
  }

  return { longitude: undefined, latitude: undefined };
};
