import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AlignDirection, SimpleDropdownMenu } from '../../../../uiComponents';
import { ResultSelection, StopSearchFilters } from '../types';
import {
  EquipmentReportMenuItem,
  InfoSpotReportReportMenuItem,
} from './ResultsActionMenuItems';

const testIds = {
  actionMenu: 'StopSearchResultsPage::results::actionMenu',
  equipmentReport: 'EquipmentReport',
  infoSpotReport: 'InfoSpotReport',
};

type ResultsActionMenuProps = {
  readonly className?: string;
  readonly filters: StopSearchFilters;
  readonly resultCount: number;
  readonly resultSelection: ResultSelection;
};

export const ResultsActionMenu: FC<ResultsActionMenuProps> = ({
  className,
  filters,
  resultCount,
  resultSelection,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleDropdownMenu
      className={className}
      tooltip={t('accessibility:common.actionMenu')}
      alignItems={AlignDirection.Left}
      testId={testIds.actionMenu}
    >
      <EquipmentReportMenuItem
        filters={filters}
        resultCount={resultCount}
        resultSelection={resultSelection}
      />
      <InfoSpotReportReportMenuItem
        filters={filters}
        resultCount={resultCount}
        resultSelection={resultSelection}
      />
    </SimpleDropdownMenu>
  );
};
