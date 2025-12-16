import { DateTime } from 'luxon';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate, mapToShortTime } from '../../../../time';
import {
  useGenerateEquipmentReport,
  useGenerateInfoSpotReport,
} from '../csv-export/useGenerateEquipmentReport';
import { ResultSelection, StopSearchFilters } from '../types';
import { DownloadReportMenuItem } from './DownloadReportMenuItem';

const testIds = {
  equipmentReport: 'EquipmentReport',
  infoSpotReport: 'InfoSpotReport',
};

type ResultsActionMenuItemProps = {
  readonly className?: string;
  readonly filters: StopSearchFilters;
  readonly resultCount: number;
  readonly resultSelection: ResultSelection;
};

const EquipmentReportMenuItemImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  ResultsActionMenuItemProps
> = ({ className, filters, resultCount, resultSelection }, ref) => {
  const { t } = useTranslation();

  const generateEquipmentReport = useGenerateEquipmentReport();

  return (
    <DownloadReportMenuItem
      ref={ref}
      className={className}
      disabled={
        resultCount === 0 || resultSelection.selectionState === 'NONE_SELECTED'
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
  );
};

const InfoSpotReportReportMenuItemImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  ResultsActionMenuItemProps
> = ({ className, filters, resultCount, resultSelection }, ref) => {
  const { t } = useTranslation();

  const generateInfoSpotReport = useGenerateInfoSpotReport();

  return (
    <DownloadReportMenuItem
      ref={ref}
      className={className}
      disabled={
        resultCount === 0 || resultSelection.selectionState === 'NONE_SELECTED'
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
  );
};

export const EquipmentReportMenuItem = forwardRef(EquipmentReportMenuItemImpl);
export const InfoSpotReportReportMenuItem = forwardRef(
  InfoSpotReportReportMenuItemImpl,
);
