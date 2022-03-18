import { DateTime } from 'luxon';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLayers } from 'react-icons/md';
import { MapFilterContext, setObservationDate } from '../../context/MapFilter';
import { useFilterStops } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import { IconButton } from '../../uiComponents';
import { MapOverlay } from './MapOverlay';

interface Props {
  className?: string;
}

export const ObservationDateOverlay = ({ className }: Props) => {
  const { t } = useTranslation();

  const {
    state: { observationDate },
    dispatch,
  } = useContext(MapFilterContext);
  const { toggleShowFilters } = useFilterStops();

  return (
    <MapOverlay className={`${className} rounded`}>
      <Column className="space-y-1 p-3">
        <h2 className="text-sm font-bold">{t('filters.observationDate')}</h2>
        <Row className="space-x-1">
          <input
            type="date"
            value={observationDate.toISODate()}
            onChange={(e) =>
              dispatch(setObservationDate(DateTime.fromISO(e.target.value)))
            }
            className="flex-1"
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
