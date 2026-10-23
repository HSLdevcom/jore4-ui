import { FC } from 'react';
import { DateLike } from '../../../time/date';
import { mapToShortDate } from '../../../time/format';

type DateRangeProps = {
  readonly startDate?: DateLike;
  readonly endDate?: DateLike;
};

export const DateRange: FC<DateRangeProps> = ({ startDate, endDate }) => {
  return `${mapToShortDate(startDate)} - ${mapToShortDate(endDate)}`;
};
