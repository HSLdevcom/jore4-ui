import { DateTime } from 'luxon';
import {
  InfrastructureNetworkDirectionEnum,
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPointInsertInput,
  ServicePatternVehicleModeOnScheduledStopPointInsertInput,
} from '../../generated/graphql';
import { Priority } from '../../types';
import { expectValue } from '../../utils';
import { infrastructureLinks } from './infrastructureLinks';

export const scheduledStopPoints: ServicePatternScheduledStopPointInsertInput[] =
  [
    {
      scheduled_stop_point_id: '3f604abf-06a9-42c6-90fc-649bf7d8c5eb',
      located_on_infrastructure_link_id: expectValue(
        infrastructureLinks[0].infrastructure_link_id,
      ),
      direction: InfrastructureNetworkDirectionEnum.Forward,
      measured_location: {
        type: 'Point',
        coordinates: [12.1, 11.2, 0],
      },
      label: 'stop1',
      priority: Priority.Standard,
      validity_start: DateTime.fromISO('2005-01-01 12:34:56'),
      validity_end: DateTime.fromISO('2065-02-01 12:34:56'),
    },
  ];

export const vehicleModeOnScheduledStopPoint: ServicePatternVehicleModeOnScheduledStopPointInsertInput[] =
  [
    {
      scheduled_stop_point_id: scheduledStopPoints[0].scheduled_stop_point_id,
      vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
    },
  ];
