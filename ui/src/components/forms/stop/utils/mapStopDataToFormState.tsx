import { ServicePatternScheduledStopPoint } from '../../../../generated/graphql';
import { mapToISODate } from '../../../../time';
import { RequiredKeys } from '../../../../types';
import { mapLngLatToPoint } from '../../../../utils';
import { StopFormState } from '../types';

export function mapStopDataToFormState(
  stop: RequiredKeys<
    Partial<ServicePatternScheduledStopPoint>,
    'measured_location'
  >,
): Partial<StopFormState> {
  const { latitude, longitude } = mapLngLatToPoint(
    stop.measured_location.coordinates,
    8,
  );

  return {
    stopId: stop.scheduled_stop_point_id,
    label: stop.label ?? '',
    latitude,
    longitude,
    priority: stop.priority,
    validityStart: mapToISODate(stop.validity_start),
    validityEnd: mapToISODate(stop.validity_end),
    indefinite: !stop.validity_end,
    timingPlaceId: stop.timing_place_id,
    stopArea: null,
  };
}
