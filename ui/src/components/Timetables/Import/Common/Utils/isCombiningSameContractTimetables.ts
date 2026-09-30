import uniq from 'lodash/uniq';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from './useVehicleScheduleFrameWithJourneys';

function getJourneys(frame: VehicleScheduleVehicleScheduleFrameWithJourneys) {
  return frame.vehicle_services.flatMap((service) =>
    service.blocks.flatMap((block) => block.vehicle_journeys),
  );
}

export function isCombiningSameContractTimetables(
  stagingAndTargetFramesForCombine: ReadonlyArray<{
    stagingFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
    targetFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
  }>,
) {
  return stagingAndTargetFramesForCombine.some(
    ({ stagingFrame, targetFrame }) => {
      const stagingContractNumbers = uniq(
        getJourneys(stagingFrame).map((j) => j.contract_number),
      );
      const targetContractNumbers = uniq(
        getJourneys(targetFrame).map((j) => j.contract_number),
      );

      return stagingContractNumbers.some((stagingContract) =>
        targetContractNumbers.includes(stagingContract),
      );
    },
  );
}
