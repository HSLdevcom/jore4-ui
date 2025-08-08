import { Point } from 'geojson';
import { FilterableStopInfo } from '../../../types';

export type MapStop = FilterableStopInfo & {
  readonly location: Point;
  readonly netex_id: string;
  readonly stop_place_netex_id: string;
  readonly functional_area: number | null;
};
