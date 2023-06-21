import { gql } from '@apollo/client';
import { DateTime, Duration } from 'luxon';
import { RandomReferenceFormState as FormState } from '../../components/timetables/day-settings/RandomReferenceDay/RandomReferenceDayForm.types';
import {
  GetSubstituteOperatingPeriodsQuery,
  Maybe,
  RouteTypeOfLineEnum,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '../../generated/graphql';
import { mapDurationToShortTime, mapToISODate } from '../../time';
import { SubstituteDayOfWeek } from '../../types/enums';
import {
  AllOptionEnum,
  buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods,
} from '../../utils';

const GQL_GET_SUBSTITUTE_OPERATING_PERIODS = gql`
  query GetSubstituteOperatingPeriods(
    $periodFilters: timetables_service_calendar_substitute_operating_period_bool_exp
  ) {
    timetables {
      timetables_service_calendar_substitute_operating_period(
        where: $periodFilters
      ) {
        period_name
        is_preset
        substitute_operating_period_id
        substitute_operating_day_by_line_types {
          begin_time
          end_time
          substitute_day_of_week
          substitute_operating_day_by_line_type_id
          superseded_date
          type_of_line
        }
      }
    }
  }
`;

export const useGetSubstituteOperatingPeriods = ({
  startDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const mapSubstituteOperatingPeriodsResult = (
    result: GetSubstituteOperatingPeriodsQuery,
  ) => {
    return result.timetables
      ?.timetables_service_calendar_substitute_operating_period as TimetablesServiceCalendarSubstituteOperatingPeriod[];
  };

  const mapDateTimeToFormState = (
    date: Maybe<DateTime> | undefined,
  ): string => {
    const stringDate = date ? mapToISODate(date) : mapToISODate(DateTime.now());
    return stringDate ?? '';
  };

  const mapDurationToString = (time: Maybe<Duration> | undefined) => {
    if (time) return mapDurationToShortTime(time);
    return '';
  };

  const mapSubstituteDayOfWeek = (
    substituteDayOfWeek: Maybe<number> | undefined,
  ) => {
    if (substituteDayOfWeek) {
      return Object.values(SubstituteDayOfWeek)[substituteDayOfWeek];
    }
    return SubstituteDayOfWeek.NoTraffic;
  };

  const mapLineTypes = (lineTypes: Set<string>) => {
    if (lineTypes.size === Object.keys(RouteTypeOfLineEnum).length) {
      lineTypes.add(AllOptionEnum.All);
    }
    return Array.from(lineTypes).join(',');
  };

  const convertToPeriodSchema = (
    input: TimetablesServiceCalendarSubstituteOperatingPeriod[],
  ): FormState => {
    const periods = input?.map((item) => {
      const periodBeginDate =
        item.substitute_operating_day_by_line_types.reduce(
          (minDate, lineType) =>
            lineType.superseded_date < minDate
              ? lineType.superseded_date
              : minDate,
          item.substitute_operating_day_by_line_types[0].superseded_date,
        );

      const periodEndDate = item.substitute_operating_day_by_line_types.reduce(
        (maxDate, lineType) =>
          lineType.superseded_date > maxDate
            ? lineType.superseded_date
            : maxDate,
        item.substitute_operating_day_by_line_types[0].superseded_date,
      );
      const lineTypes: Set<string> = new Set();
      item.substitute_operating_day_by_line_types.forEach(
        (operatingDayByLineType) =>
          lineTypes.add(operatingDayByLineType.type_of_line),
      );

      return {
        periodId: item.substitute_operating_period_id,
        periodName: item.period_name,
        beginDate: mapDateTimeToFormState(periodBeginDate),
        endDate: mapDateTimeToFormState(periodEndDate),
        beginTime: mapDurationToString(
          item.substitute_operating_day_by_line_types[0].begin_time,
        ),
        endTime: mapDurationToString(
          item.substitute_operating_day_by_line_types[0].end_time,
        ),
        substituteDayOfWeek: mapSubstituteDayOfWeek(
          item.substitute_operating_day_by_line_types[0].substitute_day_of_week,
        ),
        lineTypes: mapLineTypes(lineTypes),
      };
    });
    return { periods };
  };

  const periodFilters = {
    ...buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods(
      startDate,
      endDate,
    ),
  };
  const mapSubstituteOperatingPeriodsToFormState = (
    data: GetSubstituteOperatingPeriodsQuery | undefined,
  ) => {
    let timetablesServiceCalendarSubstituteOperatingPeriodArray: TimetablesServiceCalendarSubstituteOperatingPeriod[] =
      [];
    if (data) {
      timetablesServiceCalendarSubstituteOperatingPeriodArray =
        mapSubstituteOperatingPeriodsResult(data);
    }
    return convertToPeriodSchema(
      timetablesServiceCalendarSubstituteOperatingPeriodArray,
    );
  };

  const { data, refetch: refetchSubstituteOperatingPeriods } =
    useGetSubstituteOperatingPeriodsQuery({
      variables: { periodFilters },
    });

  const randomReferenceDaysFormState =
    mapSubstituteOperatingPeriodsToFormState(data);

  return {
    convertToPeriodSchema,
    mapSubstituteOperatingPeriodsResult,
    randomReferenceDaysFormState,
    refetchSubstituteOperatingPeriods,
  };
};
