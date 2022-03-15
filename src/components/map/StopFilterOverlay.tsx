import { useTranslation } from 'react-i18next';
import { useFilterStops } from '../../hooks/useFilterStops';
import { Row } from '../../layoutComponents';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';

interface Props {
  className?: string;
}

export const StopFilterOverlay = ({ className }: Props) => {
  const { t } = useTranslation();

  const { timeBasedFilterItems } = useFilterStops();

  return (
    <MapOverlay className={`${className} rounded-b`}>
      <MapOverlayHeader>
        <h2 className="text-xl font-bold">{t('filters.title')}</h2>
      </MapOverlayHeader>
      <div className="p-4">
        <div className="font-bold">{t('stops.stops')}</div>
        {timeBasedFilterItems.map((filter) => (
          <Row key={filter.id}>
            <input
              type="checkbox"
              id={filter.id}
              className="mr-2 h-8"
              onChange={(e) => filter.toggleFunction(e.target.checked)}
              checked={filter.enabled}
            />
            <label htmlFor={filter.id} className="mb-0 self-center font-normal">
              {filter.label}
            </label>
          </Row>
        ))}
      </div>
    </MapOverlay>
  );
};
