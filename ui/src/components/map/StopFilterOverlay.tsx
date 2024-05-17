import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterItem, useFilterStops } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import { MapOverlay, MapOverlayHeader } from './MapOverlay';

interface Props {
  className?: string;
}

const FilterRow = ({
  filter,
  className = '',
}: {
  filter: FilterItem;
  className?: string;
}): JSX.Element => {
  const { id, isActive, label, toggleFunction, disabled } = filter;

  return (
    <Row key={id} className={className}>
      <label htmlFor={id} className="mb-0 inline-flex font-normal">
        <input
          type="checkbox"
          className="mr-3.5 h-6 w-6"
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

const Section: FC = ({ children }) => (
  <Column className="space-y-2 border-t pb-4 pt-4">{children}</Column>
);

export const StopFilterOverlay = ({ className = '' }: Props): JSX.Element => {
  const { t } = useTranslation();

  const {
    timeBasedFilterItems,
    priorityFilterItems,
    highestPriorityCurrentFilterItem,
  } = useFilterStops();

  return (
    <MapOverlay className={`rounded-b ${className}`}>
      <MapOverlayHeader>
        <h4>{t('filters.title')}</h4>
      </MapOverlayHeader>
      <div className="px-4 pb-2 pt-4">
        <p className="mb-3.5 font-bold">{t('stops.stops')} </p>
        <FilterRow className="mb-4" filter={highestPriorityCurrentFilterItem} />
        <Section>
          {timeBasedFilterItems.map((filter) => (
            <FilterRow key={filter.id} filter={filter} />
          ))}
        </Section>
        <Section>
          {priorityFilterItems.map((filter) => (
            <FilterRow key={filter.id} filter={filter} />
          ))}
        </Section>
      </div>
    </MapOverlay>
  );
};
