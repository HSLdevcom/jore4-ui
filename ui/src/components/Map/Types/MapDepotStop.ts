import type { Point } from 'geojson';

export type MapDepotStop = {
  readonly id: string;
  readonly label: string;
  readonly location: Point;
};
