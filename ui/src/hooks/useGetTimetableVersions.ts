import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import {
  TimetableVersionFragment,
  useGetTimetableVersionsByJourneyPatternIdsAsyncQuery,
} from '../generated/graphql';
import { DayOfWeek, TimetablePriority } from '../types/enums';
import { generateArrayTypeForHasura } from '../utils';

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
        ...timetable_version
      }
    }
  }
`;

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
  vehicleScheduleFrame: {
    nameI18n: LocalizedString;
    priority: TimetablePriority;
    validityStart?: DateTime | null;
    validityEnd?: DateTime | null;
  };
  substituteDay?: {
    substituteDayOfWeek: DayOfWeek;
    supersededDate: DateTime;
  };
  inEffect?: boolean;
}

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
      priority: timetableVersionData.priority,
      nameI18n:
        timetableVersionData.vehicle_schedule_frame?.name_i18n || '!Versio', // NOTE: this needs to be changed once we get versions.
      validityStart: timetableVersionData.validity_start,
      validityEnd: timetableVersionData.validity_end,
    },
  };
};

const mapDayTypeData = (timetableVersionData: TimetableVersionFragment) => {
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
  beginDate,
  endDate,
}: {
  journeyPatternIdsGroupedByRouteLabel: Record<string, UUID[]>;
  beginDate: DateTime;
  endDate: DateTime;
}) => {
  const [versions, setVersions] = useState<TimetableVersionRowData[]>();
  const [getTimetableVersionsByJourneyPatternIds] =
    useGetTimetableVersionsByJourneyPatternIdsAsyncQuery();

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
              (entry: TimetableVersionFragment) =>
                mapToTimetableVersionRowData(key, entry),
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
