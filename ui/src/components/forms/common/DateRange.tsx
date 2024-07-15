import { DateLike, mapToShortDate } from '../../../time';

interface DateRangeProps {
  startDate?: DateLike;
  endDate?: DateLike;
}

export const DateRange = ({
  startDate,
  endDate,
}: DateRangeProps): React.ReactElement => {
  return <>{`${mapToShortDate(startDate)} - ${mapToShortDate(endDate)}`}</>;
};
