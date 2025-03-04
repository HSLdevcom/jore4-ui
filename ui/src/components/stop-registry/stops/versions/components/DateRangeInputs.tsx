import max from 'lodash/max';
import min from 'lodash/min';
import { DateTime } from 'luxon';
import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../../../layoutComponents';
import { DateRange } from '../../../../../types';
import { DateInput } from '../../../../common';

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

  const onStartDateChange = (newFromDate: DateTime) => {
    setDateRange((prevState) => ({
      startDate: newFromDate,
      endDate: max([newFromDate, prevState.endDate]) as DateTime,
    }));
  };

  const onEndDateChange = (newToDate: DateTime) => {
    setDateRange((prevState) => ({
      startDate: min([prevState.startDate, newToDate]) as DateTime,
      endDate: newToDate,
    }));
  };

  return (
    <Row className={twMerge('gap-4', className)}>
      <DateInput
        value={dateRange.startDate}
        label={t('validityPeriod.validityStart')}
        onChange={onStartDateChange}
        testId={testIds.startDate}
        dateInputId={testIds.startDate}
      />

      <DateInput
        value={dateRange.endDate}
        label={t('validityPeriod.validityEnd')}
        onChange={onEndDateChange}
        testId={testIds.endDate}
        dateInputId={testIds.endDate}
      />
    </Row>
  );
};
