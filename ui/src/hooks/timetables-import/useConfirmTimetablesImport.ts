import { gql } from '@apollo/client';
import {
  useChangeStagingVehicleScheduleFramePriorityMutation,
  useGetStagingVehicleScheduleFramesQuery,
} from '../../generated/graphql';
import { TimetablePriority } from '../../types/enums';
import { mapToVariables } from '../../utils';

const GQL_VEHICLE_JOURNEY_WITH_ROUTE_INFO_FRAGMENT = gql`
  fragment vehicle_journey_with_route_info on timetables_vehicle_journey_vehicle_journey {
    start_time
    end_time
    vehicle_journey_id
    journey_pattern_ref {
      journey_pattern_ref_id
      journey_pattern_instance {
        journey_pattern_id
        journey_pattern_route {
          ...route_default_fields
          direction
        }
      }
    }
    block {
      block_id
      vehicle_service {
        vehicle_service_id
        day_type {
          ...day_type_all_fields
        }
      }
    }
  }
`;

const GQL_VEHICLE_SERVICE_WITH_JOURNEYS_FRAGMENT = gql`
  fragment vehicle_service_with_journeys on timetables_vehicle_service_vehicle_service {
    vehicle_service_id
    name_i18n
    vehicle_schedule_frame {
      vehicle_schedule_frame_id
      priority
    }
    day_type {
      ...day_type_all_fields
    }
    blocks {
      block_id
      vehicle_journeys {
        ...vehicle_journey_with_route_info
      }
    }
  }
`;

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_ROUTE_INFO = gql`
  fragment vehicle_schedule_frame_with_route_info on timetables_vehicle_schedule_vehicle_schedule_frame {
    label
    validity_end
    validity_start
    name_i18n
    vehicle_schedule_frame_id
    priority
    vehicle_services {
      ...vehicle_service_with_journeys
    }
  }
`;

const GQL_GET_STAGING_VEHICLE_SCHEDULE_FRAMES = gql`
  query GetStagingVehicleScheduleFrames {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: { priority: { _eq: 40 } }
      ) {
        ...vehicle_schedule_frame_with_route_info
      }
    }
  }
`;

const GQL_CHANGE_STAGING_VEHICLE_SCHEDULE_FRAME_PRIORITY = gql`
  mutation ChangeStagingVehicleScheduleFramePriority($newPriority: Int!) {
    timetables {
      timetables_update_vehicle_schedule_vehicle_schedule_frame(
        where: { priority: { _eq: 40 } }
        _set: { priority: $newPriority }
      ) {
        returning {
          priority
          validity_end
          validity_start
          name_i18n
          vehicle_schedule_frame_id
        }
      }
    }
  }
`;

export const useConfirmTimetablesImport = () => {
  const [changeTimetablesPriority] =
    useChangeStagingVehicleScheduleFramePriorityMutation();

  const importedVehicleScheduleFrames =
    useGetStagingVehicleScheduleFramesQuery();

  const confirmTimetablesImport = async (priority: TimetablePriority) => {
    await changeTimetablesPriority(mapToVariables({ newPriority: priority }));
  };

  const vehicleScheduleFrames =
    importedVehicleScheduleFrames.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame || [];

  const vehicleJourneys =
    vehicleScheduleFrames
      ?.flatMap((frame) => frame.vehicle_services)
      .flatMap((service) => service.blocks)
      .flatMap((block) => block.vehicle_journeys) || [];

  return { confirmTimetablesImport, vehicleJourneys, vehicleScheduleFrames };
};
