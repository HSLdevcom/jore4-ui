import { useTranslation } from 'react-i18next';
import { useFilterStops } from '../../hooks/useFilterStops';
import { Row } from '../../layoutComponents';

interface Props {
  className?: string;
}

export const StopFilterOverlay = ({ className }: Props) => {
  const { t } = useTranslation();

  const { timeBasedFilterItems } = useFilterStops();

  return (
    <div className={`inline-block w-72 ${className}`}>
      <div className="flex flex-col bg-white shadow-md">
        <div className="flex flex-row items-center space-x-1 border-b border-gray-200 bg-background p-4">
          <h2 className="text-bold text-xl font-bold">{t('filters.title')}</h2>
        </div>
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
              <label
                htmlFor={filter.id}
                className="mb-0 self-center font-normal"
              >
                {filter.label}
              </label>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
};
