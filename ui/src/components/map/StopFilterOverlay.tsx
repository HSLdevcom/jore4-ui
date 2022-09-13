import { useTranslation } from 'react-i18next';
import { FilterItem, useFilterStops } from '../../hooks';
import { Row } from '../../layoutComponents';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';

interface Props {
  className?: string;
}

const FilterRow = ({ filter }: { filter: FilterItem }) => {
  const { id, isActive, label, toggleFunction, disabled } = filter;

  return (
    <Row key={id}>
      <label htmlFor={id} className="mb-0 inline-flex font-normal">
        <input
          type="checkbox"
          id={id}
          className="mr-3.5 mb-2 h-6 w-6"
          onChange={(e) => toggleFunction(e.target.checked)}
          // If filter is disaled, make it appear as not checked
          checked={isActive}
          disabled={disabled}
        />
        {label}
      </label>
    </Row>
  );
};

export const StopFilterOverlay = ({ className = '' }: Props) => {
  const { t } = useTranslation();

  const {
    timeBasedFilterItems,
    priorityFilterItems,
    highestPriorityCurrentFilterItem,
  } = useFilterStops();

  return (
    <MapOverlay className={`rounded-b ${className}`}>
      <MapOverlayHeader>
        <h2 className="text-xl font-bold">{t('filters.title')}</h2>
      </MapOverlayHeader>
      <div className="p-4">
        <div className="mb-3.5 font-bold ">{t('stops.stops')}</div>
        <FilterRow filter={highestPriorityCurrentFilterItem} />
        <div className="mb-3.5 mt-2 border" />
        {timeBasedFilterItems.map((filter) => (
          <FilterRow key={filter.id} filter={filter} />
        ))}
        <div className="mb-3.5 mt-2 border" />
        {priorityFilterItems.map((filter) => (
          <FilterRow key={filter.id} filter={filter} />
        ))}
      </div>
    </MapOverlay>
  );
};
