import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { SimpleDropdownMenu } from '../../../../uiComponents';
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
      className={twJoin('pr-4', className)}
      tooltip={t('accessibility:common.actionMenu')}
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
