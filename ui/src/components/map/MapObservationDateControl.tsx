import { FC, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks';
import { Column } from '../../layoutComponents/Column';
import { selectHasChangesInProgress } from '../../redux';
import { mapToISODate, parseDate } from '../../time';
import { useMapUrlStateContext } from './utils/mapUrlState';

const testIds = {
  observationDateInput: 'MapObservationDateControl::dateInput',
};

type MapObservationDateControlProps = {
  readonly className?: string;
  readonly containerClassName?: string;
  readonly inputClassName?: string;
  readonly disabled?: boolean;
};

export const MapObservationDateControl: FC<MapObservationDateControlProps> = ({
  className,
  containerClassName = className,
  inputClassName = className,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const hasChangesInProgress = useAppSelector(selectHasChangesInProgress);

  const {
    state: {
      filters: { observationDate },
    },
    setFilters,
  } = useMapUrlStateContext();

  const [localDateValue, setLocalDateValue] = useState(observationDate);

  useEffect(() => {
    if (observationDate.isValid) {
      setLocalDateValue(observationDate);
    }
  }, [observationDate]);

  const updateUrlState = useCallback(() => {
    const newDate = parseDate(localDateValue);

    if (!newDate.isValid) {
      setLocalDateValue(observationDate);
      return;
    }

    if (!newDate.equals(observationDate)) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        observationDate: newDate,
      }));
    }
  }, [localDateValue, setFilters, observationDate]);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        updateUrlState();
      }
    },
    [updateUrlState],
  );

  const dateInputId = 'map-observation-date-input';
  const isDisabled = disabled || hasChangesInProgress;

  return (
    <Column className={containerClassName}>
      <label htmlFor={dateInputId}>{t('filters.observationDate')}</label>
      <input
        type="date"
        value={mapToISODate(localDateValue)}
        onChange={(e) => setLocalDateValue(parseDate(e.target.value))}
        onBlur={updateUrlState}
        onKeyUp={handleKeyUp}
        id={dateInputId}
        className={inputClassName}
        data-testid={testIds.observationDateInput}
        required
        disabled={isDisabled}
      />
    </Column>
  );
};
