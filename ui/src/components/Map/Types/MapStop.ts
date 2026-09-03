import type { Point } from 'geojson';
import { StopRegistryTransportModeType } from '../../../generated/graphql';
import { FilterableStopInfo } from '../../../types';
import { StopPlaceState } from '../../../types/stop-registry';

export type MapStop = FilterableStopInfo & {
  readonly location: Point;
  readonly netex_id: string;
  readonly stop_place_netex_id: string;
  readonly functional_area: number | null;
  readonly stop_state: StopPlaceState;
  readonly transport_modes: ReadonlyArray<StopRegistryTransportModeType>;
  readonly active_transport_modes: ReadonlyArray<StopRegistryTransportModeType>;
  readonly trunk_line_stop: boolean;
  readonly speed_tram_stop: boolean;
};
