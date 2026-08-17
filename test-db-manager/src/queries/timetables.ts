import { hasuraApi } from '../hasuraApi';
import { GetVehicleTypesResult } from '../types';

export function getVehicleTypes() {
  return hasuraApi({
    operationName: 'GetTimetablesVehicleTypes',
    query: `query GetTimetablesVehicleTypes {
    timetables {
      timetables_vehicle_type_vehicle_type {
        vehicle_type_id
      }
    }
  }`,
  }) as Promise<GetVehicleTypesResult>;
}
