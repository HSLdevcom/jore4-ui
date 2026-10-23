import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { DateRange } from '../../../types';
import { DateInput } from '../Inputs';
import { Row } from '../LayoutComponents';

const testIds = {
  startDate: 'ScheduledVersionsContainer::DateRangeInputs::startDate',
  endDate: 'ScheduledVersionsContainer::DateRangeInputs::endDate',
};

type DateRangeInputsProps = {
  readonly className?: string;
  readonly dateRange: DateRange;
  readonly setDateRange: Dispatch<SetStateAction<DateRange>>;
};

export const DateRangeInputs: FC<DateRangeInputsProps> = ({
  className,
  dateRange,
  setDateRange,
}) => {
  const { t } = useTranslation();

  const onStartDateChange = (newFromDate: Temporal.PlainDate) => {
    setDateRange((prevState) => ({
      startDate: newFromDate,
      endDate:
        Temporal.PlainDate.compare(newFromDate, prevState.endDate) > 0
          ? newFromDate
          : prevState.endDate,
    }));
  };

  const onEndDateChange = (newToDate: Temporal.PlainDate) => {
    setDateRange((prevState) => ({
      startDate:
        Temporal.PlainDate.compare(prevState.startDate, newToDate) > 0
          ? newToDate
          : prevState.startDate,
      endDate: newToDate,
    }));
  };

  return (
    <Row className={twMerge('gap-4', className)}>
      <DateInput
        value={dateRange.startDate}
        label={t(($) => $.validityPeriod.validityStart)}
        onChange={onStartDateChange}
        testId={testIds.startDate}
        dateInputId={testIds.startDate}
      />
      <DateInput
        value={dateRange.endDate}
        label={t(($) => $.validityPeriod.validityEnd)}
        onChange={onEndDateChange}
        testId={testIds.endDate}
        dateInputId={testIds.endDate}
      />
    </Row>
  );
};
