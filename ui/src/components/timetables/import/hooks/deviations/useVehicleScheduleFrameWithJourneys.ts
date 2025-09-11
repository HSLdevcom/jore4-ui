import { gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetVehicleScheduleFrameWithJourneyInfoQuery,
  useGetVehicleScheduleFrameWithJourneyInfoLazyQuery,
} from '../../../../../generated/graphql';

const GQL_VEHICLE_JOURNEY_WITH_PATTERN_AND_ROUTE_FRAGMENT = gql`
  fragment vehicle_journey_with_pattern_and_route_fragment on timetables_vehicle_journey_vehicle_journey {
    vehicle_journey_id
    start_time
    contract_number

    journey_pattern_ref {
      journey_pattern_ref_id
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
`;

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_JOURNEY_INFO = gql`
  query GetVehicleScheduleFrameWithJourneyInfo(
    $vehicle_schedule_frame_ids: [uuid!]!
  ) {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: {
          vehicle_schedule_frame_id: { _in: $vehicle_schedule_frame_ids }
        }
      ) {
        vehicle_schedule_frame_id
        validity_start
        validity_end
        vehicle_services {
          vehicle_service_id

          day_type {
            day_type_id
            label
            name_i18n
          }

          blocks {
            block_id
            vehicle_journeys {
              ...vehicle_journey_with_pattern_and_route_fragment
            }
          }
        }
      }
    }
  }
`;

export type VehicleScheduleVehicleScheduleFrameWithJourneys = NonNullable<
  GetVehicleScheduleFrameWithJourneyInfoQuery['timetables']
>['timetables_vehicle_schedule_vehicle_schedule_frame'][0];

export const useVehicleScheduleFrameWithJourneys = () => {
  const [getVehicleScheduleFramesQuery] =
    useGetVehicleScheduleFrameWithJourneyInfoLazyQuery();

  const fetchVehicleFramesWithJourneys = useCallback(
    async (ids: ReadonlyArray<UUID>) => {
      const result = await getVehicleScheduleFramesQuery({
        variables: {
          vehicle_schedule_frame_ids: ids,
        },
      });
      const vehicleScheduleFrames: ReadonlyArray<VehicleScheduleVehicleScheduleFrameWithJourneys> =
        result.data?.timetables
          ?.timetables_vehicle_schedule_vehicle_schedule_frame ?? [];
      return vehicleScheduleFrames;
    },
    [getVehicleScheduleFramesQuery],
  );

  return { fetchVehicleFramesWithJourneys };
};
