import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import {
  TimetableVersionFragment,
  useGetTimetableVersionsByJourneyPatternIdsLazyQuery,
} from '../../../../generated/graphql';
import { DayOfWeek, TimetablePriority } from '../../../../types/enums';
import { convertArrayTypeForHasura } from '../../../../utils';

const GQL_TIMETABLE_VERSIONS_FRAGMENT = gql`
  fragment timetable_version on timetables_return_value_timetable_version {
    day_type {
      day_type_id
      name_i18n
      label
    }
    substitute_operating_day_by_line_type {
      substitute_operating_day_by_line_type_id
      superseded_date
      substitute_day_of_week
    }
    vehicle_schedule_frame {
      vehicle_schedule_frame_id
      name_i18n
    }
    validity_start
    validity_end
    priority
    in_effect
  }
`;

const GQL_GET_TIMETABLE_VERSIONS_BY_JOURNEY_PARTTERN_IDS = gql`
  query GetTimetableVersionsByJourneyPatternIds(
    $journey_pattern_ids: _uuid
    $start_date: date
    $end_date: date
    $observation_date: date
  ) {
    timetables {
      timetables_vehicle_service_get_timetable_versions_by_journey_pattern_ids(
        args: {
          journey_pattern_ids: $journey_pattern_ids
          start_date: $start_date
          end_date: $end_date
          observation_date: $observation_date
        }
      ) {
        ...timetable_version
      }
    }
  }
`;

/**
 * UI DTO for Timetable version row data. NOTE: this is first iteration and might change completely.
 * For now it contains all the necessary information for timetable version rows.
 */
export type TimetableVersionRowData = {
  readonly routeLabelAndVariant: string;
  readonly dayType: {
    readonly id: UUID;
    readonly label: string;
    readonly nameI18n: LocalizedString;
  };
  readonly vehicleScheduleFrame: {
    readonly id: UUID | undefined;
    readonly nameI18n: LocalizedString;
    readonly priority: TimetablePriority;
    readonly validityStart?: DateTime | null;
    readonly validityEnd?: DateTime | null;
  };
  readonly substituteDay?: {
    readonly substituteDayOfWeek: DayOfWeek;
    readonly supersededDate: DateTime;
  };
  readonly inEffect?: boolean;
};

const mapSubstituteDayData = (
  timetableVersionData: TimetableVersionFragment,
) => {
  if (
    timetableVersionData?.substitute_operating_day_by_line_type?.superseded_date
  ) {
    return {
      substituteDay: {
        supersededDate:
          timetableVersionData?.substitute_operating_day_by_line_type
            .superseded_date,
        substituteDayOfWeek: timetableVersionData
          .substitute_operating_day_by_line_type
          .substitute_day_of_week as DayOfWeek,
      },
    };
  }
  return {};
};

const mapVehicleScheduleFrameData = (
  timetableVersionData: TimetableVersionFragment,
) => {
  return {
    vehicleScheduleFrame: {
      id: timetableVersionData.vehicle_schedule_frame
        ?.vehicle_schedule_frame_id,
      priority: timetableVersionData.priority,
      nameI18n:
        timetableVersionData.vehicle_schedule_frame?.name_i18n ?? '!Versio', // NOTE: this needs to be changed once we get versions.
      validityStart: timetableVersionData.validity_start,
      validityEnd: timetableVersionData.validity_end,
    },
  };
};

const mapDayTypeData = (timetableVersionData: TimetableVersionFragment) => {
  // When using the SQL functions, we had to create a return_value dummy table in the database
  // but we do not want to include it in the data model, since we never save anything to the tables.
  // Because there are no FK constraints, this day_type object relationship from hasura can theoratically
  // be null, and that is why our graphql-codegen types it as nullable. In our case though, it can never
  // be null since it is evaluated at the same time as the day_type_id is found.
  // As this should never happen, we can throw an error, because it would require investigation if it would happen.
  if (!timetableVersionData.day_type) {
    throw new Error(
      'Day type is missing. Requires investigation as this should never happen.',
    );
  }
  return {
    dayType: {
      id: timetableVersionData.day_type.day_type_id,
      nameI18n: timetableVersionData.day_type.name_i18n,
      label: timetableVersionData.day_type.label,
    },
  };
};

const mapToTimetableVersionRowData = (
  key: string,
  timetableVersionData: TimetableVersionFragment,
): TimetableVersionRowData => {
  return {
    routeLabelAndVariant: key,
    inEffect: timetableVersionData.in_effect,
    ...mapDayTypeData(timetableVersionData),
    ...mapVehicleScheduleFrameData(timetableVersionData),
    ...mapSubstituteDayData(timetableVersionData),
  };
};

/**
 * Fetch timetable versions during given time range for given journey pattern ids
 * fetch result is mapped to TimetableVersionRowData.
 */
export const useGetTimetableVersions = ({
  journeyPatternIdsGroupedByRouteLabel,
  startDate,
  endDate,
}: {
  journeyPatternIdsGroupedByRouteLabel: Record<string, UUID[]>;
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const [versions, setVersions] =
    useState<ReadonlyArray<TimetableVersionRowData>>();
  const [getTimetableVersionsByJourneyPatternIds] =
    useGetTimetableVersionsByJourneyPatternIdsLazyQuery();

  const fetchTimetableVersions = useCallback(async () => {
    const timetableVersions = await Promise.all(
      Object.entries(journeyPatternIdsGroupedByRouteLabel).map(
        async ([key, value]) => {
          const result = await getTimetableVersionsByJourneyPatternIds({
            variables: {
              journey_pattern_ids: convertArrayTypeForHasura<UUID>(value),
              start_date: startDate,
              end_date: endDate,
              observation_date: DateTime.now(),
            },
          });
          return (
            result.data?.timetables?.timetables_vehicle_service_get_timetable_versions_by_journey_pattern_ids?.map(
              (entry: TimetableVersionFragment) =>
                mapToTimetableVersionRowData(key, entry),
            ) ?? []
          );
        },
      ),
    );
    setVersions(timetableVersions.flat(1));
  }, [
    journeyPatternIdsGroupedByRouteLabel,
    getTimetableVersionsByJourneyPatternIds,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    if (startDate <= endDate) {
      fetchTimetableVersions();
    } else {
      setVersions([]);
    }
  }, [
    endDate,
    fetchTimetableVersions,
    journeyPatternIdsGroupedByRouteLabel,
    startDate,
  ]);

  return {
    versions,
    fetchTimetableVersions,
  };
};
