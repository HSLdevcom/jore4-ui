import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  const [activeLineIds, setActiveLineIds] = useState<UUID[] | null>(
    lines.at(0)?.line_id ? [lines.at(0)?.line_id as string] : null,
  );

  const linesToShow = useMemo(() => {
    return lines.filter((line) => activeLineIds?.includes(line.line_id));
  }, [lines, activeLineIds]);

  // If lines list changes, check to see if the selected line is still within
  // the results, if not, then select the 1st line from the results as active,
  // or null in case there are no results.
  useEffect(() => {
    if (!activeLineIds || activeLineIds.length === 0) {
      const idString: string | undefined = lines.at(0)?.line_id;
      setActiveLineIds(idString ? [idString] : null);
      return;
    }

    // Check if all currently selected lines are still in the results
    const availableLineIds = lines.map((line) => line.line_id);
    const validSelectedIds = activeLineIds.filter((id) =>
      availableLineIds.includes(id),
    );

    // If some or all selected lines are no longer available, update the selection
    if (validSelectedIds.length !== activeLineIds.length) {
      if (validSelectedIds.length > 0) {
        // Keep the valid selections
        setActiveLineIds(validSelectedIds);
      } else {
        // No valid selections left, select the first available area
        const idString: string | undefined = lines.at(0)?.line_id;
        setActiveLineIds(idString ? [idString] : null);
      }
    }
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
        activeLineIds={activeLineIds}
        className="mb-6"
        lines={lines}
        setActiveLineIds={setActiveLineIds}
      />

      {linesToShow.map((line) => (
        <>
          <ActiveLineHeader line={line} className="mt-6" />
          <LineRoutesListing line={line} sortingInfo={sortingInfo} />
        </>
      ))}
    </>
  );
};
