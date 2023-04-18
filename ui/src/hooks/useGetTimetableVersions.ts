import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { useGetTimetableVersionsByJourneyPatternAsyncQuery } from '../generated/graphql';
import { TimetablePriority } from '../types/enums';
import { generateArrayTypeForHasura } from '../utils';

const GQL_GET_TIMETABLE_VERSIONS_BY_JOURNEY_PARTTERN_IDS = gql`
  query GetTimetableVersionsByJourneyPattern(
    $journey_pattern_ids: _uuid
    $begin_date: date
    $end_date: date
    $observation_date: date
  ) {
    timetables {
      timetables_vehicle_service_get_timetable_versions_by_journey_pattern_ids(
        args: {
          journey_pattern_ids: $journey_pattern_ids
          begin_date: $begin_date
          end_date: $end_date
          observation_date: $observation_date
        }
      ) {
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
    }
  }
`;

/**
 * Day of week values used for example in substitute days.
 */
export enum DayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

/**
 * UI DTO for Timetable version row data. NOTE: this is first iteration and might change completely.
 * For now it contains all the necessary information for timetable version rows.
 */
export interface TimetableVersionRowData {
  routeLabelAndVariant: string;
  dayType: {
    id: UUID;
    label: string;
    nameI18n: LocalizedString;
  };
  priority: TimetablePriority;
  vehicleScheduleFrame: {
    nameI18n: LocalizedString;
    priority: TimetablePriority;
    validityStart?: DateTime | null;
    validityEnd?: DateTime | null;
  };
  substituteDay: {
    substituteDayOfWeek: DayOfWeek;
    supersededDate: DateTime;
  };
  versionName: string;
  inEffect?: boolean;
}

/**
 * Fetch timetable versions during given time range for given journey pattern ids
 * fetch result is mapped to TimetableVersionRowData.
 */
export const useGetTimetableVersions = ({
  journeyPatternIdsGroupedByRouteLabel,
  beginDate,
  endDate,
}: {
  journeyPatternIdsGroupedByRouteLabel: {
    [key: string]: UUID[];
  };
  beginDate: DateTime;
  endDate: DateTime;
}) => {
  const [versions, setVersions] = useState<TimetableVersionRowData[]>();
  const [getTimetableVersionsByJourneyPatternIds] =
    useGetTimetableVersionsByJourneyPatternAsyncQuery();

  const fetchTimetableVersions = useCallback(async () => {
    const timetableVersions = await Promise.all(
      Object.entries(journeyPatternIdsGroupedByRouteLabel).map(
        async ([key, value]) => {
          const result = await getTimetableVersionsByJourneyPatternIds({
            journey_pattern_ids: generateArrayTypeForHasura<UUID>(value),
            begin_date: beginDate,
            end_date: endDate,
            observation_date: DateTime.now(),
          });
          return (
            result.data.timetables?.timetables_vehicle_service_get_timetable_versions_by_journey_pattern_ids?.map(
              (entry) => {
                return {
                  routeLabelAndVariant: key,
                  inEffect: entry.in_effect,
                  dayType: {
                    id: entry.day_type?.day_type_id,
                    nameI18n: entry.day_type?.name_i18n,
                    label: entry.day_type?.label,
                  },
                  vehicleScheduleFrame: {
                    priority: entry.priority,
                    nameI18n:
                      entry.vehicle_schedule_frame?.name_i18n || '!Versio', // NOTE: this needs to be changed once we get versions.
                    validityStart: entry.validity_start,
                    validityEnd: entry.validity_end,
                  },
                  substituteDay: {
                    supersededDate:
                      entry?.substitute_operating_day_by_line_type
                        ?.superseded_date,
                    substituteDayOfWeek:
                      entry.substitute_operating_day_by_line_type
                        ?.substitute_day_of_week,
                  },
                } as TimetableVersionRowData;
              },
            ) || []
          );
        },
      ),
    );
    setVersions(timetableVersions.flat(1));
  }, [
    journeyPatternIdsGroupedByRouteLabel,
    getTimetableVersionsByJourneyPatternIds,
    beginDate,
    endDate,
  ]);

  useEffect(() => {
    fetchTimetableVersions();
  }, [fetchTimetableVersions, journeyPatternIdsGroupedByRouteLabel]);

  return {
    versions,
  };
};
