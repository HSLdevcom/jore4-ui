import { DateTime, Duration } from 'luxon';
import { PeriodType } from '../components/timetables/substitute-day-settings/OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';
import {
  Maybe,
  RouteTypeOfLineEnum,
  TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput,
} from '../generated/graphql';
import { mapToISODate, parseDate } from '../time';
import { SubstituteDayOfWeek } from '../types/enums';
import { AllOptionEnum } from './enum';

const mapSubstituteDayOfWeekToNumber = (
  substituteDayOfWeek: SubstituteDayOfWeek,
): number | undefined => {
  const index = Object.values(SubstituteDayOfWeek).indexOf(substituteDayOfWeek);
  return index === 0 ? undefined : index;
};

export const mapPeriodsToDayByLineTypes = (
  input: PeriodType,
): TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput[] => {
  const {
    beginDate,
    endDate,
    beginTime,
    endTime,
    lineTypes,
    substituteDayOfWeek,
    periodId,
  } = input;
  const currentDate = parseDate(beginDate);
  const endDateObj = parseDate(endDate);
  if (!currentDate || !endDateObj) {
    throw new Error('Invalid date input');
  }

  const objectArray: TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput[] =
    [];
  const lineTypeArray = lineTypes.split(',');
  for (
    let date = currentDate;
    date <= endDateObj;
    date = date.plus({ days: 1 })
  ) {
    lineTypeArray.forEach((lineType: string) => {
      if (lineType !== AllOptionEnum.All) {
        objectArray.push({
          type_of_line: lineType,
          superseded_date: date,
          substitute_day_of_week:
            mapSubstituteDayOfWeekToNumber(substituteDayOfWeek),
          begin_time: Duration.fromISOTime(beginTime),
          end_time: Duration.fromISOTime(endTime),
          substitute_operating_period_id: periodId,
        });
      }
    });
  }
  return objectArray;
};

export const mapDateTimeToFormState = (
  date: Maybe<DateTime> | undefined,
): string => {
  const stringDate = date ? mapToISODate(date) : mapToISODate(DateTime.now());
  return stringDate ?? '';
};

export const mapLineTypes = (lineTypes: Set<string>) => {
  if (lineTypes.size === Object.keys(RouteTypeOfLineEnum).length) {
    lineTypes.add(AllOptionEnum.All);
  }
  return Array.from(lineTypes).join(',');
};

export const generateLineTypes = (): string => {
  const val: string[] = Object.values(RouteTypeOfLineEnum);
  val.push(AllOptionEnum.All);
  return val.join(',');
};
