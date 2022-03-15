import { useTranslation } from 'react-i18next';
import { MdLayers } from 'react-icons/md';
import { useFilterStops } from '../../hooks/useFilterStops';
import { useObservationDate } from '../../hooks/useObservationDate';
import { Column, Row } from '../../layoutComponents';
import { IconButton } from '../../uiComponents';
import { MapOverlay } from './MapOverlay';

interface Props {
  className?: string;
}

export const ObservationDateOverlay = ({ className }: Props) => {
  const { t } = useTranslation();

  const { observationDate, setObservationDate } = useObservationDate();
  const { toggleShowFilters } = useFilterStops();

  return (
    <MapOverlay className={`${className} rounded`}>
      <Column className="space-y-1 p-3">
        <h2 className="text-sm font-bold">{t('filters.observationDate')}</h2>
        <Row className="space-x-1">
          <input
            type="date"
            value={observationDate}
            onChange={(e) => setObservationDate(e.target.value)}
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
