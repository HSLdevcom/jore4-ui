import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate, mapToShortTime } from '../../../../time';
import { AlignDirection, SimpleDropdownMenu } from '../../../../uiComponents';
import {
  useGenerateEquipmentReport,
  useGenerateInfoSpotReport,
} from '../csv-export/useGenerateEquipmentReport';
import { ResultSelection, StopSearchFilters } from '../types';
import { DownloadReportMenuItem } from './DownloadReportMenuItem';

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

  const generateEquipmentReport = useGenerateEquipmentReport();
  const generateInfoSpotReport = useGenerateInfoSpotReport();

  return (
    <SimpleDropdownMenu
      className={className}
      tooltip={t('accessibility:common.actionMenu')}
      alignItems={AlignDirection.Left}
      testId={testIds.actionMenu}
    >
      <DownloadReportMenuItem
        disabled={
          resultCount === 0 ||
          resultSelection.selectionState === 'NONE_SELECTED'
        }
        filters={filters}
        selection={resultSelection}
        generateReport={generateEquipmentReport}
        genFilename={() => {
          const now = DateTime.now();
          return t('stopRegistrySearch.csv.equipmentReportFileName', {
            today: mapToShortDate(now),
            now: mapToShortTime(now),
          });
        }}
        text={t('stopRegistrySearch.csv.downloadEquipmentReport')}
        type={testIds.equipmentReport}
      />

      <DownloadReportMenuItem
        disabled={
          resultCount === 0 ||
          resultSelection.selectionState === 'NONE_SELECTED'
        }
        filters={filters}
        selection={resultSelection}
        generateReport={generateInfoSpotReport}
        genFilename={() => {
          const now = DateTime.now();
          return t('stopRegistrySearch.csv.infoSpotReportFileName', {
            today: mapToShortDate(now),
            now: mapToShortTime(now),
          });
        }}
        text={t('stopRegistrySearch.csv.downloadInfoSpotReport')}
        type={testIds.infoSpotReport}
      />
    </SimpleDropdownMenu>
  );
};
