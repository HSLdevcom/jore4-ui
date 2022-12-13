import { v4 as uuid } from 'uuid';
import { VehicleServiceBlockInsertInput } from '../../types';
import { seedVehicleServices } from './vehicleServices';

export const seedVehicleServiceBlocks: VehicleServiceBlockInsertInput[] = [
  // Vehicle 1 Mon-Fri
  {
    vehicle_service_id: seedVehicleServices[0].vehicle_service_id,
    block_id: uuid(),
  },
  // Vehicle 1 Sat
  {
    vehicle_service_id: seedVehicleServices[1].vehicle_service_id,
    block_id: uuid(),
  },
  // Vehicle 1 Sun
  {
    vehicle_service_id: seedVehicleServices[2].vehicle_service_id,
    block_id: uuid(),
  },
  // Vehicle 2 Mon-Fri
  {
    vehicle_service_id: seedVehicleServices[0].vehicle_service_id,
    block_id: uuid(),
  },
  // Vehicle 2 Sat
  {
    vehicle_service_id: seedVehicleServices[1].vehicle_service_id,
    block_id: uuid(),
  },
  // Vehicle 2 Sun
  {
    vehicle_service_id: seedVehicleServices[2].vehicle_service_id,
    block_id: uuid(),
  },
];
