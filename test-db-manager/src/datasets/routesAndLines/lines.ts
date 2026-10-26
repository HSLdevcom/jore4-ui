import { buildLine } from '../../builders';
import {
  ReusableComponentsVehicleModeEnum,
  RouteLineInsertInput,
} from '../../generated/graphql';
import { Priority } from '../../types';

export const lines: RouteLineInsertInput[] = [
  {
    ...buildLine({ label: '1' }),
    line_id: '0b0bd5dc-09ed-4f85-8d8f-de862145c5a0',
    priority: Priority.Standard,
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
    validity_start: Temporal.PlainDate.from('2044-05-02'),
    validity_end: null,
  },
  {
    ...buildLine({ label: '2' }),
    line_id: '33677499-a521-4b30-8bcf-8e6ad1c88691',
    priority: Priority.Standard,
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
    validity_start: Temporal.PlainDate.from('2044-05-01'),
    validity_end: Temporal.PlainDate.from('2045-05-01'),
  },
];
