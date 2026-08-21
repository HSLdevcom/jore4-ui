import { VehicleScheduleVehicleScheduleFrameWithJourneys } from '../../../Common/Utils/useVehicleScheduleFrameWithJourneys';
import { useCreateVehicleJourneyInfo } from './useCreateVehicleJourneyInfo';
import { useFindDuplicateJourneys } from './useFindDuplicateJourneys';

export function useDuplicateJourneyDeviations(
  stagingAndTargetFramesForCombine: {
    stagingFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
    targetFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
  }[],
) {
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
}
