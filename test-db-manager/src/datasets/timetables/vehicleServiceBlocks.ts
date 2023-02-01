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

export const seedVehicleServiceBlocks: VehicleServiceBlockInsertInput[] = [
  // Vehicle 1 Mon-Fri
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[0].vehicle_service_id,
  }),
  // Vehicle 1 Sat
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[1].vehicle_service_id,
  }),
  // Vehicle 1 Sun
  buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServices[2].vehicle_service_id,
  }),
];
