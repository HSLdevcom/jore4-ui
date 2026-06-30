import { DateTime } from 'luxon';
import { Dispatch, FC, SetStateAction, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseDateInput } from '../BaseDateInput';
import { ChangeHistoryFilters } from './types';

const testIds = {
  fromDate: 'ChangeHistoryPage::DateFilter::FromDate',
  toDate: 'ChangeHistoryPage::DateFilter::ToDate',
};

type DateRangeFilterProps = {
  readonly className?: string;
  readonly filters: ChangeHistoryFilters;
  readonly setFilters: Dispatch<SetStateAction<ChangeHistoryFilters>>;
};

export const DateRangeFilter: FC<DateRangeFilterProps> = ({
  className,
  filters: { from, to },
  setFilters,
}) => {
  const { t } = useTranslation();

  const id = useId();

  const onFromChange = (newDate: DateTime) => {
    const newFromDate = newDate.startOf('day');

    setFilters((p) => {
      const currentToDate = p.to.startOf('day');

      if (currentToDate.valueOf() < newFromDate.valueOf()) {
        return {
          ...p,
          from: newFromDate,
          to: newFromDate.endOf('day'),
        };
      }

      return { ...p, from: newFromDate };
    });
  };

  const onToChange = (newDate: DateTime) => {
    const newToDate = newDate.endOf('day');

    setFilters((p) => {
      const currentFromDate = p.from.endOf('day');

      if (currentFromDate.valueOf() > newToDate.valueOf()) {
        return {
          ...p,
          from: newToDate.startOf('day'),
          to: newToDate,
        };
      }

      return { ...p, to: newToDate };
    });
  };

  return (
    <div className={className}>
      <label id={id} className="inline-block">
        {t(($) => $.changeHistory.tableHeaders.changed)}
      </label>
      <fieldset aria-labelledby={id} className="flex gap-4">
        <BaseDateInput
          data-testid={testIds.fromDate}
          id={`${id}from`}
          parsed
          value={from}
          onChange={onFromChange}
        />

        <BaseDateInput
          data-testid={testIds.toDate}
          id={`${id}to`}
          parsed
          value={to}
          onChange={onToChange}
        />
      </fieldset>
    </div>
  );
};
