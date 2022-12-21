import { ScheduledStopPointWithTimingSettingsFragment } from '../generated/graphql';

/**
 * Checks that the stop has usable timing place.
 * For timing place to be usable as timing point,
 * all scheduled stop point's stop instances must have a timing place and it must be the same for all of them.
 */
export const stopHasUsableTimingPlace = (
  scheduledStopPoint: ScheduledStopPointWithTimingSettingsFragment,
) =>
  scheduledStopPoint.scheduled_stop_points?.every(
    (stop) =>
      stop.timing_place_id &&
      stop.timing_place_id ===
        scheduledStopPoint.scheduled_stop_points[0].timing_place_id,
  );
