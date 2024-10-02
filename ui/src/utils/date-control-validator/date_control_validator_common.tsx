import { DateTime } from 'luxon';

export type SubstituteDayStartDateValidatorProps = {
  startDate: DateTime;
  endDate: DateTime;
};

export type DateValidatorProps = SubstituteDayStartDateValidatorProps | null;

export enum DateValidatorSource {
  SubstitutePeriodStartDay = 'SubstitutePeriodStartDay',
}

export type DateValidatorData = {
  valid: boolean;
  originalDate: DateTime | null;
  replacedDate: DateTime | null;
};

export type DateControlValidatorType = {
  validate: (props: DateValidatorProps) => DateValidatorData;
};
