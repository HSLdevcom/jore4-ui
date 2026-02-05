import { FC } from 'react';
import { useGroupedResultSelection, useStopSearchRouterState } from '../utils';
import { ActiveLineHeader } from './ActiveLineHeader';
import { LineRoutesListing } from './LineRoutesListing';
import { LineSelector } from './LineSelector';
import { StopsByLineCountAndSortingRow } from './StopsByLineCountAndSortingRow';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';
import { useResolveQuayIdsByLines } from './useResolveQuayIdsByLines';

type StopsByLineSearchGroupedStopsResultsProps = {
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
};

export const StopsByLineSearchGroupedStopsResults: FC<
  StopsByLineSearchGroupedStopsResultsProps
> = ({ lines }) => {
  const {
    state: { filters, sortingInfo },
    historyState: { selectedGroups, resultSelection },
    setPagingInfo,
    setSortingInfo,
  } = useStopSearchRouterState();

  const { onBatchUpdateSelection, onToggleSelectAll } =
    useGroupedResultSelection();

  const { quayIds } = useResolveQuayIdsByLines(lines);

  const { observationDate } = filters;

  const filtersWithQuayIds = {
    ...filters,
    quayIds: quayIds.slice(),
  };

  return (
    <>
      <StopsByLineCountAndSortingRow
        filters={filtersWithQuayIds}
        resultCount={selectedGroups.length}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        allSelected={resultSelection.selectionState === 'ALL_SELECTED'}
        onToggleSelectAll={onToggleSelectAll}
        hasResults={selectedGroups.length > 0}
        resultSelection={resultSelection}
      />

      <LineSelector className="my-3" lines={lines} />

      {lines
        .filter((line) => selectedGroups.includes(line.line_id))
        .map((line, i) => (
          <>
            <ActiveLineHeader
              line={line}
              className={i > 0 ? 'mt-6' : ''}
              onBatchUpdateSelection={onBatchUpdateSelection}
              selection={resultSelection}
            />
            <LineRoutesListing
              observationDate={observationDate}
              line={line}
              sortingInfo={sortingInfo}
              selection={resultSelection}
            />
          </>
        ))}
    </>
  );
};
