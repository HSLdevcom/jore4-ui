import { ApolloQueryResult, gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { pipe } from 'remeda';
import {
  DayTypeAllFieldsFragment,
  GetTimetablesForOperationDayQuery,
  Maybe,
  TimetablesVehicleScheduleVehicleScheduleFrame,
  useGetTimetablesForOperationDayAsyncQuery,
  VehicleServiceWithJourneysFragment,
} from '../../generated/graphql';
import { TimetablePriority } from '../../types/Priority';
import { useGetLineDetails } from '../line-details';
import { useObservationDateQueryParam } from '../urlQuery';

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
  query GetTimetablesForOperationDay(
    $journey_pattern_id: uuid!
    $observation_date: date!
  ) {
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
      timetables_vehicle_service_get_vehicle_services_for_date(
        args: { observation_date: $observation_date }
      ) {
        vehicle_service_id
      }
    }
  }
`;

interface VehicleServiceGroup {
  priority: TimetablePriority;
  dayType: DayTypeAllFieldsFragment;
  vehicleServices: VehicleServiceWithJourneysFragment[];
}

type TimetablesResponse = ApolloQueryResult<GetTimetablesForOperationDayQuery>;

const getVehicleScheduleFrames = (timetablesResponse: TimetablesResponse) => {
  const timetables = timetablesResponse.data?.timetables;
  return timetables?.timetables_vehicle_schedule_vehicle_schedule_frame.length
    ? timetables?.timetables_vehicle_schedule_vehicle_schedule_frame
    : [];
};

const getTimetableValidity = (timetablesResponse: TimetablesResponse) => {
  const timetables = timetablesResponse.data?.timetables;
  const vehicleScheduleFrames = timetables
    ?.timetables_vehicle_schedule_vehicle_schedule_frame.length
    ? timetables?.timetables_vehicle_schedule_vehicle_schedule_frame
    : [];

  const validityStart = vehicleScheduleFrames[0]?.validity_start;
  const validityEnd = vehicleScheduleFrames[0]?.validity_end;

  return { validityStart, validityEnd };
};

const getVehicleServiceIdsOnObservationDate = (
  timetablesResponse: TimetablesResponse,
) => {
  const timetables = timetablesResponse.data?.timetables;
  const vehicleServiceIdsOnObservationDate =
    timetables?.timetables_vehicle_service_get_vehicle_services_for_date.map(
      (item) => item.vehicle_service_id,
    );
  return vehicleServiceIdsOnObservationDate;
};

const groupVehicleServices = (
  vehicleScheduleFrames: TimetablesVehicleScheduleVehicleScheduleFrame[],
  vehicleServiceIdsOnObservationDate: UUID[],
) => {
  // Vehicle services parsed & groupd from timetables response so that
  // they can be shown in UI more easily.
  return pipe(
    vehicleScheduleFrames,
    (scheduleFrames) => scheduleFrames.flatMap((item) => item.vehicle_services),
    (services) =>
      // filter out services that are not active on selected observation date
      services.filter((item) =>
        vehicleServiceIdsOnObservationDate?.includes(item.vehicle_service_id),
      ),
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
};

const getGroupedVehicleServices = (timetablesResponse: TimetablesResponse) => {
  const vehicleServiceIds =
    getVehicleServiceIdsOnObservationDate(timetablesResponse);
  const scheduleFrames = getVehicleScheduleFrames(timetablesResponse);
  // @ts-expect-error generated graphql types won't match even though
  // these types should be compatible
  return groupVehicleServices(scheduleFrames, vehicleServiceIds);
};

type Validity = {
  validityStart?: Maybe<DateTime>;
  validityEnd?: Maybe<DateTime>;
};
export interface TimetableWithMetadata {
  timetable: TimetablesResponse;
  validity: Validity;
  vehicleServices: VehicleServiceGroup[];
  journeyPatternId: UUID;
}

export const useGetTimetables = () => {
  const { line } = useGetLineDetails();
  const [getTimetablesForOperationDay] =
    useGetTimetablesForOperationDayAsyncQuery();

  const { observationDate } = useObservationDateQueryParam();

  const [timetables, setTimetables] = useState<TimetableWithMetadata[]>([]);

  const getTimetables = useCallback(async () => {
    const journeyPatternIds = line?.line_routes?.map(
      (route) => route.route_journey_patterns[0].journey_pattern_id,
    );

    const res = await Promise.all(
      (journeyPatternIds || []).map((journeyPatternId) =>
        getTimetablesForOperationDay({
          journey_pattern_id: journeyPatternId,
          observation_date: observationDate,
        }).then((response) => ({
          response,
          journeyPatternId,
        })),
      ),
    );
    const timetablesWithMetadata = res.map((item) => ({
      timetable: item.response,
      validity: getTimetableValidity(item.response),
      vehicleServices: getGroupedVehicleServices(item.response),
      journeyPatternId: item.journeyPatternId,
    }));

    setTimetables(timetablesWithMetadata);
  }, [line, getTimetablesForOperationDay, observationDate]);

  useEffect(() => {
    getTimetables();
  }, [getTimetables, observationDate]);

  return { timetables };
};
