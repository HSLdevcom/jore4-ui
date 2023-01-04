import { v4 as uuid } from 'uuid';
import { VehicleServiceBlockInsertInput } from '../../types';
import { seedVehicleServices } from './vehicleServices';

const buildVehicleServiceBlock = ({
  blockId = uuid(),
  vehicleServiceId,
}: {
  blockId?: UUID;
  vehicleServiceId: UUID;
}): VehicleServiceBlockInsertInput => ({
  vehicle_service_id: vehicleServiceId,
  block_id: blockId,
});

const seedDefaultVehicleServiceBlocks: VehicleServiceBlockInsertInput[] = [
  // basic schedule frame, vehicle 1, Mon-Fri
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[0].vehicle_service_id,
  }),
  // basic schedule frame, vehicle 1, Sat
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[1].vehicle_service_id,
  }),
  // basic schedule frame, vehicle 1, Sun
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[2].vehicle_service_id,
  }),
  // basic schedule frame, vehicle 2, Mon-Fri
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[3].vehicle_service_id,
  }),
  // basic schedule frame, vehicle 2, Sat
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[4].vehicle_service_id,
  }),
  // basic schedule frame, vehicle 2, Sun
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[5].vehicle_service_id,
  }),
];

export const seedImportedVehicleServiceBlocks: VehicleServiceBlockInsertInput[] =
  [
    // imported schedule frame, vehicle 1, Mon-Fri
    buildVehicleServiceBlock({
      blockId: 'b779bc4e-d18c-4829-82bc-869fbea8f0ea',
      vehicleServiceId: seedVehicleServices[6].vehicle_service_id,
    }),
    // imported schedule frame, vehicle 1, Sat
    buildVehicleServiceBlock({
      blockId: '925e7499-1a67-48b3-a9e2-6db1ebd3a215',
      vehicleServiceId: seedVehicleServices[7].vehicle_service_id,
    }),
    // imported schedule frame, vehicle 1, Sun
    buildVehicleServiceBlock({
      blockId: 'ce59990c-1609-43d4-91ac-fa932aee391c',
      vehicleServiceId: seedVehicleServices[8].vehicle_service_id,
    }),
  ];

export const seedVehicleServiceBlocks: VehicleServiceBlockInsertInput[] = [
  ...seedDefaultVehicleServiceBlocks,
  ...seedImportedVehicleServiceBlocks,
];
