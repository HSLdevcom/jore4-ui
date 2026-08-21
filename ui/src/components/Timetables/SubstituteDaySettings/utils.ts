import uniq from 'lodash/uniq';
import { DateTime, Duration } from 'luxon';
import {
  Maybe,
  RouteTypeOfLineEnum,
  SubstituteOperatingPeriodSettingsInfoFragment,
  TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput,
} from '../../../generated/graphql';
import { DateLike, mapToISODate, parseDate } from '../../../time';
import { SubstituteDayOfWeek } from '../../../types/enums';
import { AllOptionEnum } from '../../../utils';
import {
  CommonSubstitutePeriodType,
  PeriodType,
} from './OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';

function mapSubstituteDayOfWeekToNumber(
  substituteDayOfWeek: SubstituteDayOfWeek,
): number | undefined {
  const index = Object.values(SubstituteDayOfWeek).indexOf(substituteDayOfWeek);
  return index === 0 ? undefined : index;
}

export function parseSubstituteDayOfWeek(
  substituteDayOfWeek: Maybe<number> | undefined,
) {
  if (substituteDayOfWeek) {
    return Object.values(SubstituteDayOfWeek)[substituteDayOfWeek];
  }
  return SubstituteDayOfWeek.NoTraffic;
}

function parseOptionalInterval(
  str: string | undefined | null,
): Duration | null {
  if (!str) {
    return null;
  }

  return Duration.fromISOTime(str);
}

function* dateRange(beginDate: DateLike, endDate: DateLike) {
  const parsedBegin = parseDate(beginDate);
  const parsedEnd = parseDate(endDate);

  if (!parsedBegin || !parsedEnd) {
    throw new Error(
      `Invalid date input! $beginDate=${beginDate} | endDate=${endDate}`,
    );
  }

  for (
    let date = parsedBegin;
    date <= parsedEnd;
    date = date.plus({ days: 1 })
  ) {
    yield date;
  }
}

export function mapPeriodsToDayByLineTypes(
  input: PeriodType | CommonSubstitutePeriodType,
): TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput[] {
  const {
    beginDate,
    endDate,
    beginTime,
    endTime,
    lineTypes: lineTypesString,
    substituteDayOfWeek,
    periodId,
  } = input;

  const lineTypes = lineTypesString
    .split(',')
    .filter((lineType) => lineType !== AllOptionEnum.All);

  return dateRange(beginDate, endDate)
    .flatMap((date) =>
      lineTypes.map((lineType: string) => {
        return {
          type_of_line: lineType,
          superseded_date: date,
          substitute_day_of_week:
            mapSubstituteDayOfWeekToNumber(substituteDayOfWeek),
          begin_time: parseOptionalInterval(beginTime),
          end_time: parseOptionalInterval(endTime),
          substitute_operating_period_id: periodId,
        };
      }),
    )
    .toArray();
}

export function mapDateTimeToFormState(
  date: Maybe<DateTime> | undefined,
): string {
  const stringDate = date ? mapToISODate(date) : mapToISODate(DateTime.now());
  return stringDate ?? '';
}

const lineTypeEnumSize = Object.keys(RouteTypeOfLineEnum).length;

export function mapLineTypes(
  period: SubstituteOperatingPeriodSettingsInfoFragment,
) {
  const uniqLineTypes = uniq(
    period.substitute_operating_day_by_line_types.map(
      (operatingDayByLineType) => operatingDayByLineType.type_of_line,
    ),
  );

  const lineTypes =
    uniqLineTypes.length === lineTypeEnumSize
      ? [AllOptionEnum.All]
      : uniqLineTypes;
  return lineTypes.join(',');
}
