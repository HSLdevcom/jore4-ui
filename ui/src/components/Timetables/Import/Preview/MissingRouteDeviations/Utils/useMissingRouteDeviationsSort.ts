import orderBy from 'lodash/orderBy';
import { VehicleScheduleFrameInfo } from './useCreateVehicleScheduleFrameInfo';

export function useMissingRouteDeviationsSort() {
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
}
