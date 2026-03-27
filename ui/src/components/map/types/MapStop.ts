import type { Point } from 'geojson';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { FilterableStopInfo } from '../../../types';
import { StopPlaceState } from '../../../types/stop-registry';

export type MapStop = FilterableStopInfo & {
  readonly location: Point;
  readonly netex_id: string;
  readonly stop_place_netex_id: string;
  readonly functional_area: number | null;
  readonly vehicle_mode?: ReusableComponentsVehicleModeEnum;
  readonly stop_state: StopPlaceState;
};
