import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../useVehicleScheduleFrameWithJourneys';
import { useCreateVehicleJourneyInfo } from './useCreateVehicleJourneyInfo';
import { useFindDuplicateJourneys } from './useFindDuplicateJourneys';

export const useDuplicateJourneyDeviations = (
  stagingAndTargetFramesForCombine: {
    stagingFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
    targetFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
  }[],
) => {
  const { createVehicleJourneyInfo } = useCreateVehicleJourneyInfo();
  const { findDuplicateJourneys } = useFindDuplicateJourneys();

  const duplicateJourneys = stagingAndTargetFramesForCombine.flatMap(
    ({ stagingFrame, targetFrame }) => {
      return findDuplicateJourneys({
        stagingFrameJourneys: createVehicleJourneyInfo(stagingFrame),
        targetFrameJourneys: createVehicleJourneyInfo(targetFrame),
      });
    },
  );

  return { duplicateJourneys };
};
