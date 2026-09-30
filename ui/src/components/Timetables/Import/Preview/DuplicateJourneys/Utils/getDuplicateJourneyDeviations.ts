import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../../../Common/Utils';
import { createVehicleJourneyInfo } from './createVehicleJourneyInfo';
import { findDuplicateJourneys } from './findDuplicateJourneys';

export function getDuplicateJourneyDeviations(
  stagingAndTargetFramesForCombine: ReadonlyArray<{
    stagingFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
    targetFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
  }>,
) {
  return stagingAndTargetFramesForCombine.flatMap(
    ({ stagingFrame, targetFrame }) => {
      return findDuplicateJourneys({
        stagingFrameJourneys: createVehicleJourneyInfo(stagingFrame),
        targetFrameJourneys: createVehicleJourneyInfo(targetFrame),
      });
    },
  );
}
