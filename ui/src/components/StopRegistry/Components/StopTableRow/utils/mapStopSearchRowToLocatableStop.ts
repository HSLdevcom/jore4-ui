import { getGeometryPoint } from '../../../../../utils';
import { LocatableStop } from '../../../Types';
import { StopSearchRow } from '../types';

export function mapStopSearchRowToLocatableStop(
  stop: StopSearchRow,
): LocatableStop {
  return {
    label: stop.publicCode,
    netexId: stop.netexId,
    location: getGeometryPoint(stop.location),
    priority: stop.priority,
    transportMode: stop.transportMode,
  };
}
