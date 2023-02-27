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

interface VehicleJourneyGroup {
  priority: TimetablePriority;
  dayType: DayTypeAllFieldsFragment;
  vehicleJourneys: VehicleJourneyWithServiceFragment[];
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
        const foundGroup = groups.find(
          (group) =>
            group.dayType === item.block.vehicle_service.day_type &&
            group.priority ===
              item.block.vehicle_service.vehicle_schedule_frame.priority,
        );
        if (foundGroup) {
          foundGroup.vehicleJourneys.push(item);
          return groups;
        }
        return [
          ...groups,
          {
            dayType: item.block.vehicle_service.day_type,
            priority:
              item.block.vehicle_service.vehicle_schedule_frame.priority,
            vehicleJourneys: [item],
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
    (startTimes) => findEarliestTime(startTimes as DateTime[]),
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
    (endTimes) => findLatestTime(endTimes as DateTime[]),
    (endTime) => (endTime.isValid ? endTime : undefined),
  );
  return { validityStart, validityEnd };
};

export interface TimetableWithMetadata {
  timetable: Timetables;
  validity: Validity;
  vehicleJourneyGroups: VehicleJourneyGroup[];
  journeyPatternId: UUID;
}

export const useGetTimetables = (journeyPatternId: UUID) => {
  const [getTimetablesForOperationDay] =
    useGetTimetablesForOperationDayAsyncQuery();

  const { observationDate } = useObservationDateQueryParam();

  const [timetables, setTimetables] = useState<TimetableWithMetadata>();

  const getTimetablesForRoute = useCallback(async () => {
    const res = await getTimetablesForOperationDay({
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
  }, [journeyPatternId, observationDate, getTimetablesForOperationDay]);

  useEffect(() => {
    getTimetablesForRoute();
  }, [getTimetablesForRoute, observationDate]);

  return { timetables };
};
