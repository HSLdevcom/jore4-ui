import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import {
  DayTypeAllFieldsFragment,
  VehicleJourneyWithServiceFragment,
  VehicleScheduleFragment,
  useGetVehicleSchedulesForDateLazyQuery,
} from '../../../generated/graphql';
import { useAppSelector, useObservationDateQueryParam } from '../../../hooks';
import { Operation, selectChangeTimetableValidityModal } from '../../../redux';
import { findEarliestTime, findLatestTime } from '../../../time';
import { TimetablePriority } from '../../../types/enums';
import { useLoader } from '../../common/hooks';

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

const GQL_VEHICLE_SCHEDULES_FRAGMENT = gql`
  fragment vehicle_schedule on timetables_return_value_vehicle_schedule {
    vehicle_journey {
      ...vehicle_journey_with_service
    }
    day_type {
      ...day_type_all_fields
    }
    priority
    validity_start
    validity_end
    created_at
    vehicle_schedule_frame_id
  }
`;

const GQL_GET_VEHICLE_SCHEDULES_FOR_DATE = gql`
  query GetVehicleSchedulesForDate(
    $journey_pattern_id: uuid!
    $observation_date: date!
  ) {
    timetables {
      timetables_vehicle_journey_get_vehicle_schedules_on_date(
        args: {
          journey_pattern_uuid: $journey_pattern_id
          observation_date: $observation_date
        }
      ) {
        ...vehicle_schedule
      }
      timetables_service_calendar_get_active_day_types_for_date(
        args: { observation_date: $observation_date }
      ) {
        day_type_id
      }
    }
  }
`;

/**
 * Interface that groups together all vehicle journeys that are valid for
 * a route on a certain day type and validity period with a certain priority.
 *
 * @property priority: Timetable's priority
 * @property dayType: Timetable's day type
 * @property validity: Validity period for timetables
 * @property vehicleJourneys: Array of vehicle journeys
 */
export type VehicleJourneyGroup = {
  readonly dayType: DayTypeAllFieldsFragment;
  readonly vehicleJourneys: ReadonlyArray<VehicleJourneyWithServiceFragment> | null;
  readonly priority: TimetablePriority;
  readonly validity: Validity;
  readonly vehicleScheduleFrameId?: UUID | null;
  readonly createdAt?: DateTime | null | undefined;
  readonly inEffect?: boolean;
};

type Validity = {
  validityStart: DateTime;
  validityEnd: DateTime;
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
export type TimetableWithMetadata = {
  readonly validity?: Validity;
  readonly journeyPatternId: UUID;
  readonly vehicleJourneyGroups: ReadonlyArray<VehicleJourneyGroup>;
};

const getTimetableNarrowestValidityPeriod = (
  vehicleJourneyGroups: ReadonlyArray<VehicleJourneyGroup>,
) => {
  const startTimes = vehicleJourneyGroups.map(
    (item) => item.validity.validityStart,
  );

  const endTimes = vehicleJourneyGroups.map(
    (item) => item.validity.validityEnd,
  );

  return {
    validityStart: findLatestTime(startTimes),
    validityEnd: findEarliestTime(endTimes),
  };
};

/**
 * Enriches the vehicleJourneyGroups with inEffect value calculated by checking
 * the active day type ids, and then getting the highest priority of that type.
 * So for example, if the observation date is a 11.7.2023 (Tuesday) and we have
 * a Mon-Fri, Sat, Sun (Standard) and Tuesday (substitute), this function calculates
 * that eligible day types are Mon-Fri and Tuesday, but Tuesday is highest priority, so
 * that one will get the inEffect: true.
 */
const enrichWithInEffectValue = (
  vehicleJourneyGroups: ReadonlyArray<VehicleJourneyGroup>,
  activeDayTypeIds?: ReadonlyArray<UUID>,
) => {
  return vehicleJourneyGroups.map((group) => {
    const dayTypeIsActive = activeDayTypeIds?.includes(
      group.dayType.day_type_id,
    );
    if (!dayTypeIsActive) {
      return { ...group, inEffect: false };
    }

    const isHighestPriorityOnActiveDayType =
      group.priority ===
      Math.max(
        ...vehicleJourneyGroups
          .filter((g) => activeDayTypeIds?.includes(g.dayType.day_type_id))
          .map((g) => g.priority),
      );

    if (!isHighestPriorityOnActiveDayType) {
      return { ...group, inEffect: false };
    }
    return { ...group, inEffect: true };
  });
};

/**
 * In this function we combine the vehicle schedules that we get from the
 * SQL function, and combine them in to vehicleJourneyGroups, which represent
 * the timetable information for a day type.
 *
 * In this function we group up the vehicle schedule rows by their dayTypeId and
 * combine all the same day type's vehicleJourneys to vehicleJourneys attribute
 * in this object. After this we can drop the grouping by dayTypeId and use
 * Object.values to get the result as an array.
 */
const combineVehicleSchedulesToVehicleJourneyGroups = (
  vehicleSchedulesOnDate?: ReadonlyArray<VehicleScheduleFragment>,
) => {
  return Object.values(
    vehicleSchedulesOnDate?.reduce(
      (acc: { [key: string]: VehicleJourneyGroup }, obj) => {
        // NOTE: Not sure why the type codegen-generator thinks this can be null. It shouldnt be.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const dayTypeId = obj.day_type!.day_type_id;
        const vehicleJourney = obj.vehicle_journey ?? null;

        // If there is no entry already in acc[dayTypeId], we create one with
        // empty vehicleJourney array
        const vehicleJourneyGroup = acc[dayTypeId] ?? {
          vehicleJourneys: [],
        };

        const updatedVehicleJourneyGroup: VehicleJourneyGroup = {
          priority: obj.priority,
          validity: {
            validityStart: obj.validity_start,
            validityEnd: obj.validity_end,
          },
          dayType: obj.day_type as DayTypeAllFieldsFragment,
          vehicleScheduleFrameId: obj.vehicle_schedule_frame_id,
          createdAt: obj.created_at,
          // if we have a vehicle journey, we can combine it, if the vehicle
          // journey is null, it means that this day type is a 'no traffic' and the vehicleJourneys
          // can be set to null
          vehicleJourneys:
            vehicleJourney && vehicleJourneyGroup.vehicleJourneys
              ? [...vehicleJourneyGroup.vehicleJourneys, vehicleJourney]
              : null,
        };

        return { ...acc, [dayTypeId]: updatedVehicleJourneyGroup };
      },
      {} as { [key: string]: VehicleJourneyGroup },
    ) ?? {},
  );
};

export const useGetRouteTimetables = (journeyPatternId?: UUID) => {
  const { observationDate } = useObservationDateQueryParam();
  const changeTimetableValidityModalState = useAppSelector(
    selectChangeTimetableValidityModal,
  );
  const { setIsLoading } = useLoader(Operation.FetchRouteTimetables);

  const [timetables, setTimetables] = useState<TimetableWithMetadata>();

  const [getVehicleSchedulesForDate] = useGetVehicleSchedulesForDateLazyQuery();

  const getTimetablesForRoute = useCallback(async () => {
    if (!journeyPatternId) {
      return;
    }
    setIsLoading(true);
    const response = await getVehicleSchedulesForDate({
      variables: {
        journey_pattern_id: journeyPatternId,
        observation_date: observationDate,
      },
    });
    const vehicleSchedulesOnDate =
      response.data?.timetables
        ?.timetables_vehicle_journey_get_vehicle_schedules_on_date;

    const activeDayTypeIds =
      response.data?.timetables?.timetables_service_calendar_get_active_day_types_for_date.map(
        (dayType) => dayType.day_type_id,
      );

    const vehicleJourneyGroups = combineVehicleSchedulesToVehicleJourneyGroups(
      vehicleSchedulesOnDate,
    );

    const enrichedVehicleJourneyGroups = enrichWithInEffectValue(
      vehicleJourneyGroups,
      activeDayTypeIds,
    );

    const validity = vehicleJourneyGroups.length
      ? getTimetableNarrowestValidityPeriod(vehicleJourneyGroups)
      : undefined;

    const timetableWithMetadata: TimetableWithMetadata = {
      validity,
      vehicleJourneyGroups: enrichedVehicleJourneyGroups,
      journeyPatternId,
    };

    setTimetables(timetableWithMetadata);
    setIsLoading(false);
  }, [
    journeyPatternId,
    setIsLoading,
    getVehicleSchedulesForDate,
    observationDate,
  ]);

  useEffect(() => {
    getTimetablesForRoute();
  }, [
    getTimetablesForRoute,
    observationDate,
    changeTimetableValidityModalState.lastModifiedVehicleScheduleFrame,
  ]);

  return { timetables };
};
