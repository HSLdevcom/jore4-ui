import { DateTime } from 'luxon';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLayers } from 'react-icons/md';
import { useAppDispatch, useAppSelector, useFilterStops } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import {
  selectHasChangesInProgress,
  selectMapObservationDate,
  setMapObservationDateAction,
} from '../../redux';
import { IconButton } from '../../uiComponents';
import { MapOverlay } from './MapOverlay';

interface Props {
  className?: string;
}

export const ObservationDateOverlay = ({ className = '' }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const observationDate = useAppSelector(selectMapObservationDate);

  const { toggleShowFilters } = useFilterStops();
  const hasChangesInProgress = useAppSelector(selectHasChangesInProgress);

  const onObservationDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Do not allow setting empty value to observation date
    if (!value) {
      return;
    }

    dispatch(setMapObservationDateAction(DateTime.fromISO(value)));
  };

  return (
    <MapOverlay className={`${className} rounded`}>
      <Column className="space-y-1 p-3">
        <h2 className="text-sm font-bold">{t('filters.observationDate')}</h2>
        <Row className="space-x-1">
          <input
            type="date"
            value={observationDate.toISODate()}
            onChange={onObservationDateChange}
            className="flex-1"
            disabled={hasChangesInProgress}
          />
          <IconButton
            className="block h-11 w-11 self-stretch rounded-md border border-black"
            icon={<MdLayers className="text-2xl text-tweaked-brand" />}
            onClick={toggleShowFilters}
          />
        </Row>
      </Column>
    </MapOverlay>
  );
};
