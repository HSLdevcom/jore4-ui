import { Duration } from 'luxon';
import { PeriodType } from '../components/timetables/day-settings/RandomReferenceDay/RandomReferenceDayForm.types';
import { TimetablesServiceCalendarSubstituteOperatingDayByLineTypeInsertInput } from '../generated/graphql';
import { parseDate } from '../time';
import { SubstituteDayOfWeek } from '../types/enums';
import { AllOptionEnum } from './enum';

const mapSubstituteDayOfWeek = (
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
    beginTime,
    endTime,
    lineTypes,
    substituteDayOfWeek,
    periodId,
  } = input;
  const endDate2 = input.endDate;
  const currentDate = parseDate(beginDate);
  const endDateObj = parseDate(endDate2);
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
          substitute_day_of_week: mapSubstituteDayOfWeek(substituteDayOfWeek),
          begin_time: Duration.fromISOTime(beginTime),
          end_time: Duration.fromISOTime(endTime),
          substitute_operating_period_id: periodId,
        });
      }
    });
  }
  return objectArray;
};
