import uniq from 'lodash/uniq';
import { VehicleScheduleVehicleScheduleFrameWithJourneys } from './deviations';

const getJourneys = (
  frame: VehicleScheduleVehicleScheduleFrameWithJourneys,
) => {
  return frame.vehicle_services.flatMap((service) =>
    service.blocks.flatMap((block) => block.vehicle_journeys),
  );
};

export const useCombiningSameContractTimetables = (
  stagingAndTargetFramesForCombine: {
    stagingFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
    targetFrame: VehicleScheduleVehicleScheduleFrameWithJourneys;
  }[],
) => {
  const combiningSameContractTimetables = stagingAndTargetFramesForCombine.some(
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

  return {
    combiningSameContractTimetables,
  };
};
