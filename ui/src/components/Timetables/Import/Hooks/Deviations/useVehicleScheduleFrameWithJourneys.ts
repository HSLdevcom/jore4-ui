import { gql, useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import {
  GetVehicleScheduleFrameWithJourneyInfoDocument,
  GetVehicleScheduleFrameWithJourneyInfoQuery,
  GetVehicleScheduleFrameWithJourneyInfoQueryVariables,
  VehicleScheduleFrameWithJourneyInfoFragment,
} from '../../../../../generated/graphql';

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_JOURNEY_INFO = gql`
  query GetVehicleScheduleFrameWithJourneyInfo(
    $vehicle_schedule_frame_ids: [uuid!]!
  ) {
    timetables {
      frames: timetables_vehicle_schedule_vehicle_schedule_frame(
        where: {
          vehicle_schedule_frame_id: { _in: $vehicle_schedule_frame_ids }
        }
      ) {
        ...VehicleScheduleFrameWithJourneyInfo
      }
    }
  }

  fragment VehicleScheduleFrameWithJourneyInfo on timetables_vehicle_schedule_vehicle_schedule_frame {
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
          ...VehicleJourneyWithPatternAndRoute
        }
      }
    }
  }

  fragment VehicleJourneyWithPatternAndRoute on timetables_vehicle_journey_vehicle_journey {
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

export type VehicleScheduleVehicleScheduleFrameWithJourneys =
  VehicleScheduleFrameWithJourneyInfoFragment;

export function useVehicleScheduleFrameWithJourneys() {
  const apollo = useApolloClient();

  const fetchVehicleFramesWithJourneys = useCallback(
    async (ids: ReadonlyArray<UUID>) => {
      const { data } = await apollo.query<
        GetVehicleScheduleFrameWithJourneyInfoQuery,
        GetVehicleScheduleFrameWithJourneyInfoQueryVariables
      >({
        query: GetVehicleScheduleFrameWithJourneyInfoDocument,
        variables: { vehicle_schedule_frame_ids: ids },
      });

      return data.timetables?.frames ?? [];
    },
    [apollo],
  );

  return { fetchVehicleFramesWithJourneys };
}
