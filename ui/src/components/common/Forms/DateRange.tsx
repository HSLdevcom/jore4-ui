import { FC } from 'react';
import { DateLike, parseDate } from '../../../time/date';
import { mapToShortDate } from '../../../time/format';

type DateRangeProps = {
  readonly startDate?: DateLike;
  readonly endDate?: DateLike;
};

export const DateRange: FC<DateRangeProps> = ({ startDate, endDate }) => {
  return `${mapToShortDate(parseDate(startDate))} - ${mapToShortDate(parseDate(endDate))}`;
};
