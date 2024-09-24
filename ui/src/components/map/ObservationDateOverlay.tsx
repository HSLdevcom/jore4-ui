import { useTranslation } from 'react-i18next';
import { MdLayers } from 'react-icons/md';
import { useAppSelector, useFilterStops } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import { selectHasChangesInProgress } from '../../redux';
import { IconButton } from '../../uiComponents';
import { ObservationDateControl } from '../common/ObservationDateControl';
import { MapOverlay } from './MapOverlay';

const testIds = {
  toggleFiltersButton: 'ObservationDateOverlay::toggleFiltersButton',
};

interface Props {
  className?: string;
}

export const ObservationDateOverlay = ({ className = '' }: Props) => {
  const { t } = useTranslation();
  const { toggleShowFilters } = useFilterStops();
  const hasChangesInProgress = useAppSelector(selectHasChangesInProgress);

  return (
    <MapOverlay className={`${className} rounded`}>
      <Column className="space-y-1 p-3">
        <Row className="items-end space-x-1">
          <Column className="w-full">
            <ObservationDateControl disabled={hasChangesInProgress} />
          </Column>
          <Column>
            <IconButton
              tooltip={t('accessibility:map.showFilters')}
              className="block h-11 w-11 self-stretch rounded-md border border-black"
              icon={
                <MdLayers className="aria-hidden text-2xl text-tweaked-brand" />
              }
              onClick={toggleShowFilters}
              testId={testIds.toggleFiltersButton}
            />
          </Column>
        </Row>
      </Column>
    </MapOverlay>
  );
};
