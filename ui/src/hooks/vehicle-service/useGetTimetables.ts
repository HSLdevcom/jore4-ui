import { gql } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { pipe } from 'remeda';
import {
  DayTypeAllFieldsFragment,
  GetTimetablesForOperationDayQuery,
  useGetTimetablesForOperationDayAsyncQuery,
  VehicleServiceWithJourneysFragment,
} from '../../generated/graphql';
import { TimetablePriority } from '../../types/Priority';
import { useGetLineDetails } from '../line-details';

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

const GQL_GET_TIMETABLES_FOR_OPERATION_DAY = gql`
  query GetTimetablesForOperationDay($journey_pattern_id: uuid!) {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        order_by: { priority: desc }
        where: {
          vehicle_services: {
            blocks: {
              vehicle_journeys: {
                journey_pattern_ref: {
                  journey_pattern_id: { _eq: $journey_pattern_id }
                }
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
  const { line } = useGetLineDetails();
  const [getTimetablesForOperationDay] =
    useGetTimetablesForOperationDayAsyncQuery();
  const [timetables, setTimetables] =
    useState<GetTimetablesForOperationDayQuery['timetables']>();
  const [vehicleServices, setVehicleServices] =
    useState<VehicleServiceGroup[]>();

  // TODO: Lines may have multiple routes and those may have multiple journey patterns.
  // We are just selecting first route and first journey pattern here, but
  // does that make sense..?
  const journeyPatternId =
    line?.line_routes[0].route_journey_patterns[0].journey_pattern_id;

  const getTimetables = useCallback(async () => {
    if (!journeyPatternId) {
      return;
    }
    const timetablesResponse = await getTimetablesForOperationDay({
      journey_pattern_id: journeyPatternId,
    });
    const tmpTimetables = timetablesResponse.data?.timetables;
    const vehicleScheduleFrames = tmpTimetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame.length
      ? tmpTimetables?.timetables_vehicle_schedule_vehicle_schedule_frame
      : [];

    // Vehicle services parsed & groupd from timetables response so that
    // they can be shown in UI more easily.
    const groupedVehicleServices = pipe(
      vehicleScheduleFrames,
      (scheduleFrames) =>
        scheduleFrames.flatMap((item) => item.vehicle_services),
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
    setTimetables(tmpTimetables);
    setVehicleServices(groupedVehicleServices);
  }, [getTimetablesForOperationDay, journeyPatternId]);

  useEffect(() => {
    getTimetables();
  }, [getTimetables]);

  return { timetables, vehicleServices };
};
