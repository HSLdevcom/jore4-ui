import { FC } from 'react';
import { useAppSelector } from '../../hooks';
import { selectHasChangesInProgress } from '../../redux';
import { ObservationDateInput } from '../forms/common';
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
  containerClassName,
  inputClassName,
  disabled = false,
}) => {
  const hasChangesInProgress = useAppSelector(selectHasChangesInProgress);

  const {
    state: {
      filters: { observationDate },
    },
    setFilters,
  } = useMapUrlStateContext();

  return (
    <ObservationDateInput
      id="map-observation-date-input"
      className={className}
      containerClassName={containerClassName}
      inputClassName={inputClassName}
      value={observationDate}
      onChange={(newDate) =>
        setFilters((prevFilters) => ({
          ...prevFilters,
          observationDate: newDate,
        }))
      }
      testId={testIds.observationDateInput}
      required
      disabled={disabled || hasChangesInProgress}
    />
  );
};
