import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { theme } from '../../../../generated/theme';
import {
  AlignDirection,
  SimpleButton,
  SimpleDropdownMenu,
} from '../../../../uiComponents';
import { StopSearchRow } from '../../components';
import { ResultCountHeader } from '../components/ResultCountHeader';
import { SortResultsBy } from '../components/SortResultsBy';
import {
  ResultSelection,
  SortStopsBy,
  SortingInfo,
  StopSearchFilters,
} from '../types';
import { DownloadEquipmentReportMenuItem } from './DownloadEquipmentReportMenuItem';
import { useOpenStopResultsOnMap } from './useOpenStopResultsOnMap';

const testIds = {
  showOnMapButton: 'StopSearchResultsPage::showOnMapButton',
  showOnMapButtonLoading: 'StopSearchResultsPage::showOnMapButton::loading',
  selectAllButton: 'StopSearchResultsPage::selectAllButton',
  actionMenu: 'StopSearchResultsPage::results::actionMenu',
};

const supportedSortingFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.LABEL,
  SortStopsBy.NAME,
  SortStopsBy.ADDRESS,
];

type CountAndSortingRowProps = {
  readonly allSelected: boolean;
  readonly className?: string;
  readonly filters: StopSearchFilters;
  readonly onToggleSelectAll: () => void;
  readonly resultCount: number;
  readonly resultSelection: ResultSelection;
  readonly sortingInfo: SortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

export const CountAndSortingRow: FC<CountAndSortingRowProps> = ({
  allSelected,
  className,
  filters,
  onToggleSelectAll,
  resultCount,
  resultSelection,
  setSortingInfo,
  sortingInfo,
  stops,
}) => {
  const { t } = useTranslation();

  const nothingSelected = resultSelection.selectionState === 'NONE_SELECTED';

  const [transitioning, transitionToMap] = useOpenStopResultsOnMap(
    filters,
    resultSelection,
    resultCount,
    stops,
  );

  return (
    <div className={twMerge('a flex items-center gap-5', className)}>
      <input
        checked={allSelected}
        className="h-7 w-7"
        data-testid={testIds.selectAllButton}
        onChange={onToggleSelectAll}
        type="checkbox"
      />

      <ResultCountHeader resultCount={resultCount} />

      {resultCount > 0 && (
        <SimpleButton
          className="px-3 py-1 text-sm leading-none disabled:cursor-wait"
          disabled={nothingSelected || transitioning}
          onClick={transitionToMap}
          type="button"
          testId={testIds.showOnMapButton}
        >
          {transitioning ? (
            <PulseLoader
              color={theme.colors.brand}
              cssOverride={{ margin: '-2px' }}
              data-testid={testIds.showOnMapButtonLoading}
              size={14}
            />
          ) : (
            t('stopRegistrySearch.showOnMap')
          )}
        </SimpleButton>
      )}

      <div className="flex-grow" />

      <SortResultsBy
        mapDefaultTo={SortStopsBy.LABEL}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        supportedFields={supportedSortingFields}
      />

      <SimpleDropdownMenu
        tooltip={t('accessibility:common.actionMenu')}
        alignItems={AlignDirection.Left}
        testId={testIds.actionMenu}
      >
        <DownloadEquipmentReportMenuItem
          disabled={
            resultCount === 0 ||
            resultSelection.selectionState === 'NONE_SELECTED'
          }
          filters={filters}
          selection={resultSelection}
        />
      </SimpleDropdownMenu>
    </div>
  );
};
