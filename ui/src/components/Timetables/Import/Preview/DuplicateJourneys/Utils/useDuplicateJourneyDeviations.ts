import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../../../Common/Utils';
import { createVehicleJourneyInfo } from './createVehicleJourneyInfo';
import { findDuplicateJourneys } from './findDuplicateJourneys';

export function useDuplicateJourneyDeviations(
  stagingAndTargetFramesForCombine: {
    stagingFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
    targetFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
  }[],
) {
  const duplicateJourneys = stagingAndTargetFramesForCombine.flatMap(
    ({ stagingFrame, targetFrame }) => {
      return findDuplicateJourneys({
        stagingFrameJourneys: createVehicleJourneyInfo(stagingFrame),
        targetFrameJourneys: createVehicleJourneyInfo(targetFrame),
      });
    },
  );

  return { duplicateJourneys };
}
