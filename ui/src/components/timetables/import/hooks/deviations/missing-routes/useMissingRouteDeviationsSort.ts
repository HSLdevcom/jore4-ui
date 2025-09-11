import orderBy from 'lodash/orderBy';
import { VehicleScheduleFrameInfo } from '../useCreateVehicleScheduleFrameInfo';

export const useMissingRouteDeviationsSort = () => {
  const sortDeviations = (
    routeDeviations: ReadonlyArray<VehicleScheduleFrameInfo>,
  ): VehicleScheduleFrameInfo[] => {
    return orderBy(
      routeDeviations,
      ['uniqueLabel', 'direction'],
      ['asc', 'desc'],
    );
  };

  return { sortDeviations };
};
