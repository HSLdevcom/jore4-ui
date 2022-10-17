import { gql } from '@apollo/client';
import { pipe } from 'remeda';
import {
  DayTypeAllFieldsFragment,
  useGetTimetablesForOperationDayQuery,
  VehicleServiceWithJourneysFragment,
} from '../../generated/graphql';
import { TimetablePriority } from '../../types/Priority';

const GQL_DAY_TYPE_FRAGMENT = gql`
  fragment day_type_all_fields on timetables_service_calendar_day_type {
    day_type_id
    label
    name_i18n
  }
`;

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

// TODO: we should query timetables based on line_id/journey_pattern_id,
// but now we only have only mock seed data available and no UI for selecting
// line so this query just fetches all available data
const GQL_GET_TIMETABLES_FOR_OPERATION_DAY = gql`
  query GetTimetablesForOperationDay {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        order_by: { priority: desc }
        where: {
          vehicle_services: {
            blocks: {
              vehicle_journeys: {
                journey_pattern_ref: { journey_pattern_id: {} }
              }
            }
          }
        }
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

interface VehicleServiceGroup {
  priority: TimetablePriority;
  dayType: DayTypeAllFieldsFragment;
  vehicleServices: VehicleServiceWithJourneysFragment[];
}

export const useGetTimetables = () => {
  const timetablesResponse = useGetTimetablesForOperationDayQuery();
  const timetables = timetablesResponse.data?.timetables;

  const vehicleScheduleFrames = timetables
    ?.timetables_vehicle_schedule_vehicle_schedule_frame.length
    ? timetables?.timetables_vehicle_schedule_vehicle_schedule_frame
    : [];

  // Vehicle services parsed & groupd from timetables response so that
  // they can be shown in UI more easily.
  const vehicleServices = pipe(
    vehicleScheduleFrames,
    (scheduleFrames) => scheduleFrames.flatMap((item) => item.vehicle_services),
    (services) =>
      services.reduce<VehicleServiceGroup[]>((groups, item) => {
        const foundGroup = groups.find(
          (group) =>
            group.dayType === item.day_type &&
            group.priority === item.vehicle_schedule_frame.priority,
        );
        if (foundGroup) {
          foundGroup.vehicleServices.push(item);
          return groups;
        }
        return [
          ...groups,
          {
            dayType: item.day_type,
            priority: item.vehicle_schedule_frame.priority,
            vehicleServices: [item],
          },
        ];
      }, []),
  );

  return {
    timetables,
    vehicleServices,
  };
};
