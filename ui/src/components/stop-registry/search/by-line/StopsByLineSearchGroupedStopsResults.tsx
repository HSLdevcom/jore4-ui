import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { PagingInfo } from '../../../../types';
import { SortingInfo } from '../types';
import { ActiveLineHeader } from './ActiveLineHeader';
import { CountAndSortingRow } from './CountAndSortingRow';
import { LineRoutesListing } from './LineRoutesListing';
import { LineSelector } from './LineSelector';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

type StopsByLineSearchGroupedStopsResultsProps = {
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
};

export const StopsByLineSearchGroupedStopsResults: FC<
  StopsByLineSearchGroupedStopsResultsProps
> = ({ lines, setPagingInfo, setSortingInfo, sortingInfo }) => {
  const [activeLineId, setActiveLineId] = useState<UUID | null>(
    lines.at(0)?.line_id ?? null,
  );

  const lineToShow = lines.find((line) => line.line_id === activeLineId);

  // If lines list changes, check to see if the selected line is still within
  // the results, if not, then select the 1st line from the results as active,
  // or null in case there are no results.
  useEffect(() => {
    if (
      lineToShow &&
      lines.some((line) => line.line_id === lineToShow.line_id)
    ) {
      return;
    }

    setActiveLineId(lines.at(0)?.line_id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  return (
    <>
      <CountAndSortingRow
        className="mb-6"
        resultCount={0}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />

      <LineSelector
        activeLineId={activeLineId}
        className="mb-6"
        lines={lines}
        setActiveLineId={setActiveLineId}
      />

      {lineToShow && (
        <>
          <ActiveLineHeader line={lineToShow} />
          <LineRoutesListing line={lineToShow} />
        </>
      )}
    </>
  );
};
