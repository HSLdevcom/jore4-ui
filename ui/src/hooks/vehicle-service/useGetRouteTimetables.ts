import { ApolloQueryResult, gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { pipe } from 'remeda';
import {
  DayTypeAllFieldsFragment,
  GetTimetablesForOperationDayQuery,
  Maybe,
  VehicleJourneyWithServiceFragment,
  useGetTimetablesForOperationDayAsyncQuery,
} from '../../generated/graphql';
import { findEarliestTime, findLatestTime } from '../../time';
import { TimetablePriority } from '../../types/enums';
import { useObservationDateQueryParam } from '../urlQuery';

const GQL_DAY_TYPE_FRAGMENT = gql`
  fragment day_type_all_fields on timetables_service_calendar_day_type {
    day_type_id
    label
    name_i18n
  }
`;

const GQL_VEHICLE_JOURNEY_WITH_SERVICE_FRAGMENT = gql`
  fragment vehicle_journey_with_service on timetables_vehicle_journey_vehicle_journey {
    vehicle_journey_id
    start_time
    end_time
    journey_pattern_ref {
      journey_pattern_ref_id
      journey_pattern_id
    }
    block {
      block_id
      vehicle_service_id
      vehicle_service {
        vehicle_schedule_frame {
          vehicle_schedule_frame_id
          validity_end
          validity_start
          priority
          name_i18n
          created_at
        }
        vehicle_service_id
        day_type_id
        day_type {
          ...day_type_all_fields
        }
      }
    }
    ...vehicle_journey_by_stop
  }
`;

const GQL_GET_TIMETABLES_FOR_OPERATION_DAY = gql`
  query GetTimetablesForOperationDay(
    $journey_pattern_id: uuid!
    $observation_date: date!
  ) {
    timetables {
      timetables_vehicle_journey_vehicle_journey(
        where: {
          journey_pattern_ref: {
            journey_pattern_id: { _eq: $journey_pattern_id }
          }
        }
      ) {
        ...vehicle_journey_with_service
      }
      timetables_vehicle_service_get_vehicle_services_for_date(
        args: { observation_date: $observation_date }
      ) {
        vehicle_service_id
      }
    }
  }
`;

// TODO: we probably should have better type for Timetables response, but
// seems like it is not generated for some reason
type Timetables =
  ApolloQueryResult<GetTimetablesForOperationDayQuery>['data']['timetables'];

const getVehicleJourneys = (timetables: Timetables) => {
  return timetables?.timetables_vehicle_journey_vehicle_journey.length
    ? timetables?.timetables_vehicle_journey_vehicle_journey
    : [];
};

const getVehicleServiceIdsOnObservationDate = (timetables: Timetables) => {
  const vehicleServiceIdsOnObservationDate =
    timetables?.timetables_vehicle_service_get_vehicle_services_for_date.map(
      (item) => item.vehicle_service_id,
    );
  return vehicleServiceIdsOnObservationDate;
};

/**
 * Interface that groups together all vehicle journeys that are valid for
 * a route on a certain day type and validity period with a certain priority.
 *
 * @property priority: Timetable's priority
 * @property dayType: Timetable's day type
 * @property validity: Validity period for timetables
 * @property vehicleJourneys: Array of vehicle journeys
 */
export interface VehicleJourneyGroup {
  priority: TimetablePriority;
  dayType: DayTypeAllFieldsFragment;
  validity: Validity;
  vehicleJourneys: VehicleJourneyWithServiceFragment[];
  createdAt: DateTime;
  vehicleScheduleFrameId: UUID;
}

const groupVehicleJourneys = (
  journeys: VehicleJourneyWithServiceFragment[],
  vehicleServiceIdsOnObservationDate?: UUID[],
) => {
  // Vehicle journeys parsed & groupd from timetables response so that
  // they can be shown in UI more easily.
  return pipe(
    journeys,
    (input) =>
      // filter out journeys that are not active on selected observation date
      input.filter((item) =>
        vehicleServiceIdsOnObservationDate?.includes(
          item.block.vehicle_service.vehicle_service_id,
        ),
      ),
    (vehicleJourneys) =>
      vehicleJourneys.reduce<VehicleJourneyGroup[]>((groups, item) => {
        const { vehicle_service: vehicleService } = item.block;
        const { vehicle_schedule_frame: vehicleScheduleFrame } = vehicleService;

        const foundGroup = groups.find(
          (group) =>
            group.dayType === vehicleService.day_type &&
            group.priority === vehicleScheduleFrame.priority,
        );
        if (foundGroup) {
          foundGroup.vehicleJourneys.push(item);
          return groups;
        }

        return [
          ...groups,
          {
            dayType: vehicleService.day_type,
            priority: vehicleScheduleFrame.priority,
            validity: {
              validityStart: vehicleScheduleFrame.validity_start,
              validityEnd: vehicleScheduleFrame.validity_end,
            },
            createdAt: vehicleScheduleFrame.created_at,
            vehicleJourneys: [item],
            vehicleScheduleFrameId:
              vehicleScheduleFrame.vehicle_schedule_frame_id,
          },
        ];
      }, []),
  );
};

const getGroupedVehicleJourneys = (timetables: Timetables) => {
  const vehicleServiceIds = getVehicleServiceIdsOnObservationDate(timetables);
  const vehicleJourneys = getVehicleJourneys(timetables);

  return groupVehicleJourneys(vehicleJourneys, vehicleServiceIds);
};

type Validity = {
  validityStart?: Maybe<DateTime>;
  validityEnd?: Maybe<DateTime>;
};

const getTimetableValidity = (timetables: Timetables): Validity => {
  const removeNonDateValues = (times?: (DateTime | null | undefined)[]) => {
    // we have to use unsafe `as` casting here as TS doesn't realise that we
    // are filtering out non-date values from the input
    return times ? times.filter((item) => !!item) : ([] as DateTime[]);
  };

  const validityStart = pipe(
    timetables,
    (input) =>
      input?.timetables_vehicle_journey_vehicle_journey.map(
        (item) =>
          item.block.vehicle_service.vehicle_schedule_frame.validity_start,
      ),
    removeNonDateValues,
    (startTimes) => findLatestTime(startTimes as DateTime[]),
    (startTime) => (startTime.isValid ? startTime : undefined),
  );
  const validityEnd = pipe(
    timetables,
    (input) =>
      input?.timetables_vehicle_journey_vehicle_journey.map(
        (item) =>
          item.block.vehicle_service.vehicle_schedule_frame.validity_end,
      ),
    removeNonDateValues,
    (endTimes) => findEarliestTime(endTimes as DateTime[]),
    (endTime) => (endTime.isValid ? endTime : undefined),
  );
  return { validityStart, validityEnd };
};

/**
 * Interface that groups together all vehicle journey groups for a journey pattern
 * that are valid on certain observation date.
 *
 * @property timetable: Raw database query result
 * @property validity: The narrowest validity period during which all the listed vehicle journey groups are valid
 * @property journeyPatternId: Journey pattern id for which the vehicle journey groups belong to
 * @property vehicleJourneyGroups: Array of vehicle journey groups
 */
export interface TimetableWithMetadata {
  timetable: Timetables;
  validity: Validity;
  journeyPatternId: UUID;
  vehicleJourneyGroups: VehicleJourneyGroup[];
}

export const useGetRouteTimetables = (journeyPatternId?: UUID) => {
  const [getRouteTimetablesForOperationDay] =
    useGetTimetablesForOperationDayAsyncQuery();

  const { observationDate } = useObservationDateQueryParam();

  const [timetables, setTimetables] = useState<TimetableWithMetadata>();

  const getTimetablesForRoute = useCallback(async () => {
    if (!journeyPatternId) {
      return;
    }

    const res = await getRouteTimetablesForOperationDay({
      journey_pattern_id: journeyPatternId,
      observation_date: observationDate,
    });

    const rawTimetables = res.data?.timetables;

    const timetableWithMetadata: TimetableWithMetadata = {
      timetable: rawTimetables,
      validity: getTimetableValidity(rawTimetables),
      vehicleJourneyGroups: getGroupedVehicleJourneys(rawTimetables),
      journeyPatternId,
    };
    setTimetables(timetableWithMetadata);
  }, [journeyPatternId, observationDate, getRouteTimetablesForOperationDay]);

  useEffect(() => {
    getTimetablesForRoute();
  }, [getTimetablesForRoute, observationDate]);

  return { timetables };
};
