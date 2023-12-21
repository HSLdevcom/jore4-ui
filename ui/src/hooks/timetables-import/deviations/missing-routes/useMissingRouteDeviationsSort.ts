import orderBy from 'lodash/orderBy';
import { VehicleScheduleFrameInfo } from '../useCreateVehicleScheduleFrameInfo';

export const useMissingRouteDeviationsSort = () => {
  const sortDeviations = (
    routeDeviations: VehicleScheduleFrameInfo[],
  ): VehicleScheduleFrameInfo[] => {
    return orderBy(
      routeDeviations,
      ['uniqueLabel', 'direction'],
      ['asc', 'desc'],
    );
  };

  return { sortDeviations };
};
