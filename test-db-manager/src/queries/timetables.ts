import { hasuraApi } from '../hasuraApi';
import { GetVehicleTypesResult } from '../types';

export const getVehicleTypes = () =>
  hasuraApi({
    operationName: 'GetTimetablesVehicleTypes',
    query: `query GetTimetablesVehicleTypes {
 
      timetables_vehicle_type_vehicle_type {
        vehicle_type_id
      }
    
  }`,
  }) as Promise<GetVehicleTypesResult>;
