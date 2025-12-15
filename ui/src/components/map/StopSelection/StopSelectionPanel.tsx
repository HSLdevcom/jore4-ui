import { Popover } from '@headlessui/react';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useAppSelector } from '../../../hooks';
import { selectMapStopSelection } from '../../../redux';
import { SlimDropDownMenu } from '../../../uiComponents';
import {
  EquipmentReportMenuItem,
  InfoSpotReportReportMenuItem,
} from '../../stop-registry/search/components/ResultsActionMenuItems';
import { ResultSelection } from '../../stop-registry/search/types';
import { useMapUrlStateContext } from '../utils/mapUrlState';
import { StopSelectionListing } from './StopSelectionListing';

const testIds = {
  panel: 'Map::StopSelection::panel',
  actionMenu: 'Map::StopSelection::actionMenu',
};

type StopSelectionPanelProps = {
  readonly className?: string;
};

export const StopSelectionPanel: FC<StopSelectionPanelProps> = ({
  className,
}) => {
  const { t } = useTranslation();

  const {
    state: { filters },
  } = useMapUrlStateContext();

  const mapStopSelection = useAppSelector(selectMapStopSelection);
  const reportResultSelection: ResultSelection = useMemo(() => {
    if (
      mapStopSelection.byResultSelection ||
      mapStopSelection.selected.length === 0
    ) {
      return { selectionState: 'NONE_SELECTED', included: [], excluded: [] };
    }

    return {
      selectionState: 'SOME_SELECTED',
      included: mapStopSelection.selected,
      excluded: [],
    };
  }, [mapStopSelection]);

  return (
    <Popover.Panel
      className={twMerge(
        'absolute z-10 w-[350px] rounded-md bg-white shadow-md',
        className,
      )}
      data-testid={testIds.panel}
    >
      <div className="flex items-center justify-between border-b border-light-grey p-2">
        <h4>{t('map.stopSelection.title')}</h4>
        <SlimDropDownMenu
          className="text-base"
          buttonText={t('map.stopSelection.download')}
          disabled={reportResultSelection.selectionState === 'NONE_SELECTED'}
          testId={testIds.actionMenu}
        >
          <EquipmentReportMenuItem
            filters={filters}
            resultCount={reportResultSelection.included.length}
            resultSelection={reportResultSelection}
          />
          <InfoSpotReportReportMenuItem
            filters={filters}
            resultCount={reportResultSelection.included.length}
            resultSelection={reportResultSelection}
          />
        </SlimDropDownMenu>
      </div>

      <StopSelectionListing />
    </Popover.Panel>
  );
};
