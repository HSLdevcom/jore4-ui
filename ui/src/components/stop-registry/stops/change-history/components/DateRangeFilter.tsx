import {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useId,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { parseDate } from '../../../../../time';
import { StopChangeHistoryFilters } from '../types';

type DateRangeFilterProps = {
  readonly className?: string;
  readonly filters: StopChangeHistoryFilters;
  readonly setFilters: Dispatch<SetStateAction<StopChangeHistoryFilters>>;
};

export const DateRangeFilter: FC<DateRangeFilterProps> = ({
  className,
  filters: { from, to },
  setFilters,
}) => {
  const { t } = useTranslation();

  const id = useId();

  const filterFromDateStr = from.toISODate();
  const filterToDateStr = to.toISODate();

  const [fromDateStr, setFromDateStr] = useState<string>(filterFromDateStr);
  const [toDateStr, setToDateStr] = useState<string>(filterToDateStr);

  useEffect(() => {
    setFromDateStr(filterFromDateStr);
    setToDateStr(filterToDateStr);
  }, [filterFromDateStr, filterToDateStr]);

  const onFromChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const str = e.target.value;
    setFromDateStr(str);

    const parsed = parseDate(str);
    if (!parsed) {
      return;
    }

    const newFromDate = parsed.startOf('day');

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

  const onToChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const str = e.target.value;
    setToDateStr(str);

    const parsed = parseDate(str);
    if (!parsed) {
      return;
    }
    const newToDate = parsed.endOf('day');

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
        {t('changeHistory.tableHeaders.changed')}
      </label>
      <fieldset aria-labelledby={id} className="flex gap-4">
        <input
          id={`${id}from`}
          onChange={onFromChange}
          type="date"
          value={fromDateStr}
        />
        <input
          id={`${id}to`}
          className="invalid:border-hsl-red"
          onChange={onToChange}
          type="date"
          value={toDateStr}
        />
      </fieldset>
    </div>
  );
};
