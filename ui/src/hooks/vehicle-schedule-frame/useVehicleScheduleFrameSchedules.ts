import { gql } from '@apollo/client';
import { DateTime } from 'luxon/src/datetime';
import { groupBy, pipe } from 'remeda';
import { VehicleServiceRowData } from '../../components/timetables/vehicle-schedule-details/vehicle-service-table/VehicleServiceRow';
import {
  RouteDirectionEnum,
  VehicleJourneyWithStartTimeInfoFragment,
  useGetVehicleScheduleFrameSchedulesQuery,
} from '../../generated/graphql';
import { TimetablePriority } from '../../types/enums';

const GQL_VEHICLE_SCHEDULE_FRAME_SCHEDULES = gql`
  query GetVehicleScheduleFrameSchedules($vehicle_schedule_frame_id: uuid!) {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame_by_pk(
        vehicle_schedule_frame_id: $vehicle_schedule_frame_id
      ) {
        vehicle_schedule_frame_id
        validity_start
        validity_end
        priority
        created_at
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
              ...vehicle_journey_with_start_time_info
            }
          }
        }
      }
    }
  }
`;

const GQL_VEHICLE_JOURNEY_WITH_START_TIME_INFO = gql`
  fragment vehicle_journey_with_start_time_info on timetables_vehicle_journey_vehicle_journey {
    vehicle_journey_id
    start_time
    journey_pattern_ref {
      journey_pattern_ref_id
      journey_pattern_instance {
        journey_pattern_id
        journey_pattern_route {
          route_id
          unique_label
          direction
          name_i18n
        }
      }
    }
  }
`;

export type RouteTimetableRowInfo = {
  direction: RouteDirectionEnum;
  nameI18n: LocalizedString;
  label: string;
  vehicleServiceRowData: VehicleServiceRowData[];
  vehicleJourneys: VehicleJourneyWithStartTimeInfoFragment[];
  priority: TimetablePriority;
  vehicleScheduleFrameId: UUID;
  validity: {
    validityStart: DateTime;
    validityEnd: DateTime;
  };
};

type JourneysGroupedByLabelAndDirection = {
  [key: string]: {
    [key: string]: {
      journeys: VehicleJourneyWithStartTimeInfoFragment[];
      nameI18n: LocalizedString;
    };
  };
};

const groupJourneysByLabelAndDirection = (
  journeys?: VehicleJourneyWithStartTimeInfoFragment[],
) => {
  return journeys?.reduce((acc: JourneysGroupedByLabelAndDirection, item) => {
    const label =
      item.journey_pattern_ref.journey_pattern_instance?.journey_pattern_route
        ?.unique_label;
    const direction =
      item.journey_pattern_ref.journey_pattern_instance?.journey_pattern_route
        ?.direction;
    const nameI18n =
      item.journey_pattern_ref.journey_pattern_instance?.journey_pattern_route
        ?.name_i18n;
    const updatedAcc = { ...acc };

    if (label && direction) {
      if (!updatedAcc[label]) {
        updatedAcc[label] = {};
      }
      if (!updatedAcc[label][direction]) {
        updatedAcc[label][direction] = {
          journeys: [],
          nameI18n: nameI18n || {},
        };
      }
      updatedAcc[label][direction]?.journeys.push(item);
    }
    return updatedAcc;
  }, {});
};

const createTimetableRowInfo = (
  journeysGroupedByLabelAndDirection: JourneysGroupedByLabelAndDirection,
  priority?: TimetablePriority,
  vehicleScheduleFrameId?: UUID,
  validityStart?: DateTime,
  validityEnd?: DateTime,
) => {
  const timetableRowInfo: RouteTimetableRowInfo[] = [];
  if (!priority || !vehicleScheduleFrameId || !validityStart || !validityEnd) {
    return timetableRowInfo;
  }
  Object.keys(journeysGroupedByLabelAndDirection).forEach((routeLabel) => {
    Object.keys(journeysGroupedByLabelAndDirection[routeLabel]).forEach(
      (directionKey) => {
        const direction = directionKey as RouteDirectionEnum;
        const { journeys, nameI18n } =
          journeysGroupedByLabelAndDirection[routeLabel][direction];

        const groupedStartTimes = pipe(
          journeys
            .map((journey) => journey.start_time)
            .sort(
              (time1, time2) =>
                time1.as('millisecond') - time2.as('millisecond'),
            ),
          groupBy((item) => item.hours),
        );

        const vehicleServiceRowData: VehicleServiceRowData[] = Object.entries(
          groupedStartTimes,
        ).map(([key, value]) => ({
          hours: Number(key),
          minutes: value.map((item) => item.minutes),
        }));

        timetableRowInfo.push({
          direction,
          nameI18n,
          label: routeLabel,
          vehicleServiceRowData,
          vehicleJourneys: journeys,
          priority,
          vehicleScheduleFrameId,
          validity: {
            validityStart,
            validityEnd,
          },
        });
      },
    );
  });
  return timetableRowInfo;
};

export const useVehicleScheduleFrameSchedules = (
  vehicleScheduleFrameId: UUID,
) => {
  const vsfResult = useGetVehicleScheduleFrameSchedulesQuery({
    variables: { vehicle_schedule_frame_id: vehicleScheduleFrameId },
  });

  const dayType =
    vsfResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame_by_pk
      ?.vehicle_services[0].day_type; // One vsf can have only one day type, so we can use any of the vehicle services day type
  const createdAt =
    vsfResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame_by_pk?.created_at;
  const priority =
    vsfResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame_by_pk?.priority;
  const validityStart =
    vsfResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame_by_pk
      ?.validity_start;
  const validityEnd =
    vsfResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame_by_pk?.validity_end;

  const allJourneys =
    vsfResult?.data?.timetables?.timetables_vehicle_schedule_vehicle_schedule_frame_by_pk?.vehicle_services.flatMap(
      (vs) =>
        vs.blocks.flatMap((block) =>
          block.vehicle_journeys.map((journey) => journey),
        ),
    );

  const journeysGroupedByLabelAndDirection =
    groupJourneysByLabelAndDirection(allJourneys) || {};

  const timetableRowInfo = createTimetableRowInfo(
    journeysGroupedByLabelAndDirection,
    priority,
    vehicleScheduleFrameId,
    validityStart,
    validityEnd,
  );
  return { timetableRowInfo, dayType, createdAt, validityStart, validityEnd };
};
