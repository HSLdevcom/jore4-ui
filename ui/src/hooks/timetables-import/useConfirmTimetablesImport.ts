import { gql } from '@apollo/client';
import { pipe } from 'remeda';
import {
  useChangeStagingVehicleScheduleFramePriorityMutation,
  useGetStagingVehicleScheduleFramesQuery,
} from '../../generated/graphql';
import { TimetablePriority } from '../../types/Priority';
import { mapToVariables } from '../../utils';

const GQL_VEHICLE_SERVICES_FRAGMENT = gql`
  fragment vehicle_service_with_journeys on timetables_vehicle_service_vehicle_service {
    vehicle_service_id
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
        start_time
        vehicle_journey_id
      }
    }
  }
`;

const GQL_GET_STAGING_VEHICLE_SCHEDULE_FRAMES = gql`
  query GetStagingVehicleScheduleFrames {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: { priority: { _eq: 40 } }
      ) {
        validity_end
        validity_start
        name_i18n
        vehicle_schedule_frame_id
        priority
        vehicle_services {
          ...vehicle_service_with_journeys
        }
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

  const importedScheduleFrames = useGetStagingVehicleScheduleFramesQuery();

  const confirmTimetablesImport = async (priority: TimetablePriority) => {
    await changeTimetablesPriority(mapToVariables({ newPriority: priority }));
  };

  const vehicleServiceCount =
    pipe(
      importedScheduleFrames.data?.timetables?.timetables_vehicle_schedule_vehicle_schedule_frame.flatMap(
        (frame) =>
          frame.vehicle_services.flatMap((service) =>
            service.blocks.flatMap((block) => block.vehicle_journeys),
          ),
      ),
      (vehicleServices) => vehicleServices?.length,
    ) || 0;

  return { confirmTimetablesImport, vehicleServiceCount };
};
