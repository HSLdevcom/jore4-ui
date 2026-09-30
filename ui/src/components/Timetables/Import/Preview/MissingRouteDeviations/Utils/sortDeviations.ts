import orderBy from 'lodash/orderBy';
import { VehicleScheduleFrameInfo } from './useCreateVehicleScheduleFrameInfo';

export function sortDeviations(
  routeDeviations: ReadonlyArray<VehicleScheduleFrameInfo>,
): VehicleScheduleFrameInfo[] {
  return orderBy(
    routeDeviations,
    ['uniqueLabel', 'direction'],
    ['asc', 'desc'],
  );
}
