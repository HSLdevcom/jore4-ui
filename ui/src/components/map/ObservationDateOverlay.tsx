import { MdLayers } from 'react-icons/md';
import { useAppSelector, useFilterStops } from '../../hooks';
import { Column, Row } from '../../layoutComponents';
import { selectHasChangesInProgress } from '../../redux';
import { IconButton } from '../../uiComponents';
import { ObservationDateControl } from '../common/ObservationDateControl';
import { MapOverlay } from './MapOverlay';

interface Props {
  className?: string;
}

export const ObservationDateOverlay = ({ className = '' }: Props) => {
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
              className="block h-11 w-11 self-stretch rounded-md border border-black"
              icon={<MdLayers className="text-2xl text-tweaked-brand" />}
              onClick={toggleShowFilters}
            />
          </Column>
        </Row>
      </Column>
    </MapOverlay>
  );
};
