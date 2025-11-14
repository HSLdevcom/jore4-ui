import { FC } from 'react';
import { useStopSearchRouterState } from '../utils';
import { ActiveLineHeader } from './ActiveLineHeader';
import { CountAndSortingRow } from './CountAndSortingRow';
import { LineRoutesListing } from './LineRoutesListing';
import { LineSelector } from './LineSelector';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

type StopsByLineSearchGroupedStopsResultsProps = {
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
};

export const StopsByLineSearchGroupedStopsResults: FC<
  StopsByLineSearchGroupedStopsResultsProps
> = ({ lines }) => {
  const {
    state: {
      filters: { observationDate },
      sortingInfo,
    },
    historyState: { selectedGroups },
    setPagingInfo,
    setSortingInfo,
  } = useStopSearchRouterState();

  return (
    <>
      <CountAndSortingRow
        className="mb-6"
        resultCount={0}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />

      <LineSelector className="mb-6" lines={lines} />

      {lines
        .filter((line) => selectedGroups.includes(line.line_id))
        .map((line) => (
          <>
            <ActiveLineHeader line={line} className="mt-6" />
            <LineRoutesListing
              observationDate={observationDate}
              line={line}
              sortingInfo={sortingInfo}
            />
          </>
        ))}
    </>
  );
};
