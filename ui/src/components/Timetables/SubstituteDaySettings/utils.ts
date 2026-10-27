import uniq from 'lodash/uniq';
import {
  Maybe,
  RouteTypeOfLineEnum,
  SubstituteOperatingPeriodSettingsInfoFragment,
  TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput,
} from '../../../generated/graphql';
import { DateLike, mapToISODate, parseDate, today } from '../../../time';
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

// Parses a form validated time (H:mm or HH:mm), which may be past 24:00.
function parseOptionalInterval(
  str: string | undefined | null,
): Temporal.Duration | null {
  if (!str) {
    return null;
  }

  const [hours, minutes] = str.split(':').map(Number);
  return Temporal.Duration.from({ hours, minutes });
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
    Temporal.PlainDate.compare(date, parsedEnd) <= 0;
    date = date.add({ days: 1 })
  ) {
    yield date;
  }
}

export function mapPeriodsToDayByLineTypes({
  beginDate,
  endDate,
  beginTime,
  endTime,
  lineTypes,
  substituteDayOfWeek,
  periodId,
}:
  | PeriodType
  | CommonSubstitutePeriodType): TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput[] {
  const actualLineTypes = lineTypes.includes(AllOptionEnum.All)
    ? Object.values(RouteTypeOfLineEnum)
    : lineTypes;

  return dateRange(beginDate, endDate)
    .flatMap((date) =>
      actualLineTypes.map((lineType: string) => {
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
  date: Maybe<Temporal.PlainDate> | undefined,
): string {
  const stringDate = date ? mapToISODate(date) : mapToISODate(today());
  return stringDate ?? '';
}

const lineTypeEnumSize = Object.keys(RouteTypeOfLineEnum).length;

export function mapLineTypes(
  period: SubstituteOperatingPeriodSettingsInfoFragment,
): Array<RouteTypeOfLineEnum | AllOptionEnum> {
  const uniqLineTypes = uniq(
    period.substitute_operating_day_by_line_types.map(
      (operatingDayByLineType) =>
        operatingDayByLineType.type_of_line as RouteTypeOfLineEnum,
    ),
  );

  return uniqLineTypes.length === lineTypeEnumSize
    ? [AllOptionEnum.All]
    : uniqLineTypes;
}
