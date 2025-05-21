import { gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetVehicleScheduleFrameWithRouteAndLineInfoQuery,
  useGetVehicleScheduleFrameWithRouteAndLineInfoLazyQuery,
} from '../../../generated/graphql';

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_ROUTE_AND_LINE_INFO = gql`
  query GetVehicleScheduleFrameWithRouteAndLineInfo(
    $vehicle_schedule_frame_ids: [uuid!]!
  ) {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: {
          vehicle_schedule_frame_id: { _in: $vehicle_schedule_frame_ids }
        }
      ) {
        vehicle_schedule_frame_id
        vehicle_services {
          vehicle_service_id
          journey_patterns_in_vehicle_service {
            journey_pattern_id
            journey_pattern_instance {
              journey_pattern_id
              journey_pattern_route {
                route_id
                unique_label
                direction
                variant
                name_i18n
                route_line {
                  line_id
                }
              }
            }
          }
        }
      }
    }
  }
`;
export type VehicleScheduleVehicleScheduleFrameWithRoutes = NonNullable<
  GetVehicleScheduleFrameWithRouteAndLineInfoQuery['timetables']
>['timetables_vehicle_schedule_vehicle_schedule_frame'][0];

export const useVehicleScheduleFrameWithRouteLabelAndLineId = () => {
  const [getVehicleScheduleFramesQuery] =
    useGetVehicleScheduleFrameWithRouteAndLineInfoLazyQuery();

  const fetchVehicleFrames = useCallback(
    async (ids: ReadonlyArray<UUID>) => {
      const result = await getVehicleScheduleFramesQuery({
        variables: {
          vehicle_schedule_frame_ids: ids as Array<string>,
        },
      });
      const vehicleScheduleFrames: VehicleScheduleVehicleScheduleFrameWithRoutes[] =
        result.data?.timetables
          ?.timetables_vehicle_schedule_vehicle_schedule_frame ?? [];
      return vehicleScheduleFrames;
    },
    [getVehicleScheduleFramesQuery],
  );

  return { fetchVehicleFrames };
};
