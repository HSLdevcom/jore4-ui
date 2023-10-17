import orderBy from 'lodash/orderBy';
import { VehicleScheduleFrameInfo } from '../vehicle-schedule-frame/useVehicleScheduleFramesToVehicleScheduleFrameInfo';

export const useDeviationSort = () => {
  const sortDeviations = (
    routeDeviations: VehicleScheduleFrameInfo[],
  ): VehicleScheduleFrameInfo[] => {
    return orderBy(
      routeDeviations,
      ['label', 'direction', (deviation) => deviation.variant || -1],
      ['asc', 'desc', 'asc'],
    );
  };

  return { sortDeviations };
};
