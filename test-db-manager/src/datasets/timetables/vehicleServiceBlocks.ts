import { VehicleServiceBlockInsertInput } from '../../types';
import { seedVehicleServices } from './vehicleServices';

export const seedVehicleServiceBlocks: VehicleServiceBlockInsertInput[] = [
  // Vehicle 1 Mon-Fri
  {
    vehicle_service_id: seedVehicleServices[0].vehicle_service_id,
    block_id: '3ebce471-1ef2-4951-af34-6a9ff0660cb8',
  },
  // Vehicle 1 Sat
  {
    vehicle_service_id: seedVehicleServices[1].vehicle_service_id,
    block_id: '1ca443fe-d6fe-4124-88a0-ed061077aeb6',
  },
  // Vehicle 1 Sun
  {
    vehicle_service_id: seedVehicleServices[2].vehicle_service_id,
    block_id: 'd51c6443-ec88-497c-9786-114482de05a5',
  },
  // Vehicle 2 Mon-Fri
  {
    vehicle_service_id: seedVehicleServices[0].vehicle_service_id,
    block_id: '1ad90735-7294-475e-bf06-80f5f2163377',
  },
  // Vehicle 2 Sat
  {
    vehicle_service_id: seedVehicleServices[1].vehicle_service_id,
    block_id: '9d37fa3c-c228-41e5-99e9-6e351160a4f5',
  },
  // Vehicle 2 Sun
  {
    vehicle_service_id: seedVehicleServices[2].vehicle_service_id,
    block_id: '19b647c7-a515-4993-bd07-abb0f2948cfe',
  },
];
