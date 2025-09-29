import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { theme } from '../../../../generated/theme';
import { SimpleButton } from '../../../../uiComponents';
import { StopSearchRow } from '../../components';
import { ResultCountHeader } from '../components/ResultCountHeader';
import { SortResultsBy } from '../components/SortResultsBy';
import { SortStopsBy, SortingInfo, StopSearchFilters } from '../types';
import { useOpenStopResultsOnMap } from './useOpenStopResultsOnMap';

const testIds = {
  showOnMapButton: 'StopSearchResultsPage::showOnMapButton',
  showOnMapButtonLoading: 'StopSearchResultsPage::showOnMapButton::loading',
};

const supportedSortingFields: ReadonlyArray<SortStopsBy> = [
  SortStopsBy.LABEL,
  SortStopsBy.NAME,
  SortStopsBy.ADDRESS,
];

type CountAndSortingRowProps = {
  readonly className?: string;
  readonly filters: StopSearchFilters;
  readonly resultCount: number;
  readonly sortingInfo: SortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

export const CountAndSortingRow: FC<CountAndSortingRowProps> = ({
  className,
  filters,
  resultCount,
  setSortingInfo,
  sortingInfo,
  stops,
}) => {
  const { t } = useTranslation();

  const [transitioning, transitionToMap] = useOpenStopResultsOnMap(
    filters,
    resultCount,
    stops,
  );

  return (
    <div className={twMerge('a flex items-center gap-3', className)}>
      <ResultCountHeader resultCount={resultCount} />

      {resultCount > 0 && (
        <SimpleButton
          className="px-3 py-1 text-sm leading-none disabled:cursor-wait"
          disabled={transitioning}
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
    </div>
  );
};
