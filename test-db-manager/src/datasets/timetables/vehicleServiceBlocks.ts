import { v4 as uuid } from 'uuid';
import { VehicleServiceBlockInsertInput } from '../../types';
import { seedVehicleServicesByName } from './vehicleServices';

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

export const seedVehicleServiceBlocksByName = {
  // Vehicle 1 Mon-Fri
  v1MonFri: buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServicesByName.v1MonFri.vehicle_service_id,
  }),
  // Vehicle 1 Sat
  v1Sat: buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServicesByName.v1Sat.vehicle_service_id,
  }),
  // Vehicle 1 Sun
  v1Sun: buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServicesByName.v1Sun.vehicle_service_id,
  }),
  // Vehicle 1 Christmas
  v1December23: buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServicesByName.v1Dec2023.vehicle_service_id,
  }),
  // Vehicle 2 Mon-Fri
  v2MonFri: buildVehicleServiceBlock({
    vehicleServiceId: seedVehicleServicesByName.v2MonFri.vehicle_service_id,
  }),
};

export const seedVehicleServiceBlocks: VehicleServiceBlockInsertInput[] =
  Object.values(seedVehicleServiceBlocksByName);
