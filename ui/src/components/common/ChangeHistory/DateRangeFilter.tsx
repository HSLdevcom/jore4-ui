import { Dispatch, FC, SetStateAction, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseDateInput } from '../Inputs';
import { ChangeHistoryFilters } from './Types';

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

  const onFromChange = (newFromDate: Temporal.PlainDate) => {
    setFilters((p) => {
      if (Temporal.PlainDate.compare(p.to, newFromDate) < 0) {
        return { ...p, from: newFromDate, to: newFromDate };
      }

      return { ...p, from: newFromDate };
    });
  };

  const onToChange = (newToDate: Temporal.PlainDate) => {
    setFilters((p) => {
      if (Temporal.PlainDate.compare(p.from, newToDate) > 0) {
        return { ...p, from: newToDate, to: newToDate };
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
