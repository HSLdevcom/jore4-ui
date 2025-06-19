import { gql } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import { DateTime } from 'luxon/src/datetime';
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
  journeys: ReadonlyArray<VehicleJourneyWithStartTimeInfoFragment>,
) => {
  return journeys.reduce((acc: JourneysGroupedByLabelAndDirection, item) => {
    const updatedAcc = { ...acc };
    const route =
      item.journey_pattern_ref.journey_pattern_instance?.journey_pattern_route;

    if (!route) {
      return updatedAcc;
    }
    const { direction, unique_label: label, name_i18n: nameI18n } = route;

    if (!updatedAcc[label]) {
      updatedAcc[label] = {};
    }
    if (!updatedAcc[label][direction]) {
      updatedAcc[label][direction] = {
        journeys: [],
        nameI18n: nameI18n ?? {},
      };
    }
    updatedAcc[label][direction]?.journeys.push(item);

    return updatedAcc;
  }, {});
};

const createTimetableRowInfo = (
  allJourneys: ReadonlyArray<VehicleJourneyWithStartTimeInfoFragment>,
  priority: TimetablePriority,
  vehicleScheduleFrameId: UUID,
  validityStart: DateTime,
  validityEnd: DateTime,
) => {
  const timetableRowInfo: RouteTimetableRowInfo[] = [];

  const journeysGroupedByLabelAndDirection =
    groupJourneysByLabelAndDirection(allJourneys);

  Object.keys(journeysGroupedByLabelAndDirection).forEach((routeLabel) => {
    Object.keys(journeysGroupedByLabelAndDirection[routeLabel]).forEach(
      (directionKey) => {
        const direction = directionKey as RouteDirectionEnum;
        const { journeys, nameI18n } =
          journeysGroupedByLabelAndDirection[routeLabel][direction];

        const groupedStartTimes = groupBy(
          journeys
            .map((journey) => journey.start_time)
            .sort(
              (time1, time2) =>
                time1.as('millisecond') - time2.as('millisecond'),
            ),
          (item) => item.hours,
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

  const vehicleScheduleFrame =
    vsfResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame_by_pk;
  if (!vehicleScheduleFrame) {
    return {
      timetableRowInfo: [],
      dayType: undefined,
      createdAt: undefined,
      validityStart: undefined,
      validityEnd: undefined,
    };
  }

  // One vsf can have only one day type, so we can use any of the vehicle services day type
  const dayType = vehicleScheduleFrame.vehicle_services[0].day_type;
  const {
    priority,
    created_at: createdAt,
    validity_start: validityStart,
    validity_end: validityEnd,
  } = vehicleScheduleFrame;

  const allJourneys = vehicleScheduleFrame.vehicle_services.flatMap((vs) =>
    vs.blocks.flatMap((block) =>
      block.vehicle_journeys.map((journey) => journey),
    ),
  );

  const timetableRowInfo = createTimetableRowInfo(
    allJourneys,
    priority,
    vehicleScheduleFrameId,
    validityStart,
    validityEnd,
  );
  return { timetableRowInfo, dayType, createdAt, validityStart, validityEnd };
};
