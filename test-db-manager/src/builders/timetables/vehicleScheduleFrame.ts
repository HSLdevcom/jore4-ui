import omit from 'lodash/omit';
import { v4 as uuid } from 'uuid';
import {
  mergeTimetablesResources,
  TimetablesResources,
} from '../../db-helpers';
import {
  VehicleScheduleFrameInsertInput,
  VehicleScheduleFrameInsertInputDeep,
} from '../../types';
import { buildLocalizedString } from '../entities';
import {
  buildVehicleServiceSequencesByDayType,
  flattenVehicleService,
  VehicleServiceSequenceByDayTypeBuilder,
} from './vehicleService';

export type VehicleScheduleFrameInstanceBuilder = RequiredKeys<
  VehicleScheduleFrameInsertInput,
  'validity_start' | 'validity_end' | 'priority' | 'label'
>;

export const buildVehicleScheduleFrameInstance = (
  vsfBase: VehicleScheduleFrameInstanceBuilder,
): VehicleScheduleFrameInsertInput => ({
  vehicle_schedule_frame_id: uuid(),
  ...vsfBase,
  name_i18n: buildLocalizedString(vsfBase.label),
});

export type VehicleScheduleFrameDeepBuilder = {
  vsfBase: VehicleScheduleFrameInstanceBuilder;
  vsByDay: VehicleServiceSequenceByDayTypeBuilder;
};

export const buildVehicleScheduleFrameDeep = ({
  vsfBase,
  vsByDay,
}: VehicleScheduleFrameDeepBuilder): VehicleScheduleFrameInsertInputDeep => {
  const vehicleScheduleFrame = buildVehicleScheduleFrameInstance(vsfBase);
  const vehicleServices = buildVehicleServiceSequencesByDayType(
    vehicleScheduleFrame.vehicle_schedule_frame_id,
    vsByDay,
  );
  return {
    ...vehicleScheduleFrame,
    vehicle_services: { data: vehicleServices },
  };
};

export const flattenVehicleScheduleFrame = (
  vsf: VehicleScheduleFrameInsertInputDeep,
): TimetablesResources => {
  const vehicleScheduleFrameResources: TimetablesResources = {
    vehicleScheduleFrames: [
      // strip children references as they are inserted separately
      omit(vsf, 'vehicle_services'),
    ],
  };
  const vehicleServiceResources: TimetablesResources[] =
    vsf.vehicle_services.data.map(flattenVehicleService);
  return mergeTimetablesResources([
    vehicleScheduleFrameResources,
    ...vehicleServiceResources,
  ]);
};
