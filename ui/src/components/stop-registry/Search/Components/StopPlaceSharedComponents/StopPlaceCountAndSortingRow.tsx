import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { PagingInfo } from '../../../../../types';
import {
  CountAndSortingRowProps,
  PgIdType,
  SortStopsBy,
  SortingInfo,
  StopSearchFilters,
  commonSortingFields,
  defaultFilters,
} from '../../Types';
import { useStopSearchRouterState } from '../../Utils';
import { OpenStopResultsOnMapButton } from '../OpenStopResultsOnMapButton';
import { ResultCountHeader } from '../ResultCountHeader';
import { ResultsActionMenu } from '../ResultsActionMenu';
import { SelectAllCheckbox } from '../SelectAllCheckbox';
import { SortResultsBy } from '../SortResultsBy';

type CountAndSortingRowImplProps = CountAndSortingRowProps & {
  readonly selectedGroups: ReadonlyArray<PgIdType>;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
};

const StopPlaceCountAndSortingRowImpl: FC<CountAndSortingRowImplProps> = ({
  allSelected,
  className,
  groupingField,
  hasResults,
  onToggleSelectAll,
  resultCount,
  resultSelection,
  selectedGroups,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { sortBy } = sortingInfo;

  const filters: StopSearchFilters = useMemo(
    () => ({
      ...defaultFilters,
      stopPlaces: selectedGroups.slice(),
    }),
    [selectedGroups],
  );

  return (
    <div className={twMerge('flex items-center gap-5', className)}>
      {hasResults && (
        <SelectAllCheckbox
          allSelected={allSelected}
          onToggleSelectAll={onToggleSelectAll}
        />
      )}

      {sortBy === SortStopsBy.DEFAULT || sortBy === groupingField ? null : (
        <ResultCountHeader resultCount={resultCount} />
      )}

      <OpenStopResultsOnMapButton
        filters={filters}
        hasResults={hasResults}
        resultSelection={resultSelection}
      />

      <div className="grow" />

      <SortResultsBy
        groupOnlyFields={[groupingField]}
        mapDefaultTo={groupingField}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        supportedFields={[...commonSortingFields, groupingField]}
      />

      <ResultsActionMenu
        filters={filters}
        resultCount={resultCount}
        resultSelection={resultSelection}
      />
    </div>
  );
};

export const GroupedCountAndSortingRow: FC<CountAndSortingRowProps> = (
  props,
) => {
  const {
    state: { sortingInfo },
    historyState: { selectedGroups },
    setPagingInfo,
    setSortingInfo,
  } = useStopSearchRouterState();

  return (
    <StopPlaceCountAndSortingRowImpl
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      selectedGroups={selectedGroups}
      setPagingInfo={setPagingInfo}
      setSortingInfo={setSortingInfo}
      sortingInfo={sortingInfo}
    />
  );
};

type NonGroupedCountAndSortingRowProps = CountAndSortingRowProps & {
  readonly stopPlaceIds: ReadonlyArray<PgIdType>;
};

export const NonGroupedCountAndSortingRow: FC<
  NonGroupedCountAndSortingRowProps
> = ({ stopPlaceIds, ...props }) => {
  const {
    state: { sortingInfo },
    setPagingInfo,
    setSortingInfo,
  } = useStopSearchRouterState();

  return (
    <StopPlaceCountAndSortingRowImpl
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      selectedGroups={stopPlaceIds}
      setPagingInfo={setPagingInfo}
      setSortingInfo={setSortingInfo}
      sortingInfo={sortingInfo}
    />
  );
};
