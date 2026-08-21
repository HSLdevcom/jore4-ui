import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetVehicleScheduleFrameWithRouteAndLineInfoDocument,
  GetVehicleScheduleFrameWithRouteAndLineInfoQuery,
  GetVehicleScheduleFrameWithRouteAndLineInfoQueryVariables,
  VehicleScheduleFrameWithRouteAndLineInfoFragment,
} from '../../../../../../generated/graphql';

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_ROUTE_AND_LINE_INFO = gql`
  query GetVehicleScheduleFrameWithRouteAndLineInfo(
    $vehicle_schedule_frame_ids: [uuid!]!
  ) {
    timetables {
      frames: timetables_vehicle_schedule_vehicle_schedule_frame(
        where: {
          vehicle_schedule_frame_id: { _in: $vehicle_schedule_frame_ids }
        }
      ) {
        ...VehicleScheduleFrameWithRouteAndLineInfo
      }
    }
  }

  fragment VehicleScheduleFrameWithRouteAndLineInfo on timetables_vehicle_schedule_vehicle_schedule_frame {
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
`;

export type VehicleScheduleVehicleScheduleFrameWithRoutes =
  VehicleScheduleFrameWithRouteAndLineInfoFragment;

export function useVehicleScheduleFrameWithRouteLabelAndLineId() {
  const apollo = useApolloClient();

  const fetchVehicleFrames = useCallback(
    async (ids: ReadonlyArray<UUID>) => {
      const { data } = await apollo.query<
        GetVehicleScheduleFrameWithRouteAndLineInfoQuery,
        GetVehicleScheduleFrameWithRouteAndLineInfoQueryVariables
      >({
        query: GetVehicleScheduleFrameWithRouteAndLineInfoDocument,
        variables: { vehicle_schedule_frame_ids: ids },
      });

      return data.timetables?.frames ?? [];
    },
    [apollo],
  );

  return { fetchVehicleFrames };
}
