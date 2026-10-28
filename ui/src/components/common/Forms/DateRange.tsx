import { FC } from 'react';
import { DateLike, mapToShortDate } from '../../../utils/time';

type DateRangeProps = {
  readonly startDate?: DateLike;
  readonly endDate?: DateLike;
};

export const DateRange: FC<DateRangeProps> = ({ startDate, endDate }) => {
  return `${mapToShortDate(startDate)} - ${mapToShortDate(endDate)}`;
};
