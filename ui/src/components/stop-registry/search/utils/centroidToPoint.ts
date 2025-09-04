import { Geometry } from 'geojson';
import { Point } from '../../../../types';
import { mapLngLatToPoint } from '../../../../utils';

export function centroidToPoint(
  centroid: Geometry | null | undefined,
): Point | null {
  if (centroid?.type === 'Point') {
    return mapLngLatToPoint(centroid.coordinates);
  }

  return null;
}
