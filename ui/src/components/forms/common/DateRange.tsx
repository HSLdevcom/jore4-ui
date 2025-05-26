import { DateLike, mapToShortDate } from '../../../time';

type DateRangeProps = {
  readonly startDate?: DateLike;
  readonly endDate?: DateLike;
};

export const DateRange = ({
  startDate,
  endDate,
}: DateRangeProps): React.ReactElement => {
  return <>{`${mapToShortDate(startDate)} - ${mapToShortDate(endDate)}`}</>;
};
