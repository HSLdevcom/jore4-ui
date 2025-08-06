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
import { CountAndSortingRow } from './CountAndSortingRow';
import { StopAreaSelector } from './StopAreaSelector';
import { StopAreaStopsTable } from './StopAreaStopsTable';
import { FindStopAreaInfo } from './useFindStopAreas';

type StopAreaSearchGroupedStopsResultsProps = {
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
  readonly stopAreas: ReadonlyArray<FindStopAreaInfo>;
};

export const StopAreaSearchGroupedStopsResults: FC<
  StopAreaSearchGroupedStopsResultsProps
> = ({ setPagingInfo, setSortingInfo, sortingInfo, stopAreas }) => {
  const [activeAreaIds, setActiveAreaIds] =
    useState<ReadonlyArray<string> | null>(
      stopAreas.at(0) ? [stopAreas.at(0)?.id.toString(10)] : null,
    );

  const selectedAreas = useMemo(() => {
    return stopAreas.filter((area) =>
      activeAreaIds?.includes(area.id.toString(10)),
    );
  }, [activeAreaIds, stopAreas]);

  // If stop area list changes, check to see if the selected areas are still within
  // the results, if not, then select the 1st area from the results as active,
  // or null in case there are no results.
  useEffect(() => {
    if (!activeAreaIds || activeAreaIds.length === 0) {
      const idString: string | undefined = stopAreas.at(0)?.id.toString(10);
      setActiveAreaIds(idString ? [idString] : null);
      return;
    }

    // Check if all currently selected areas are still in the results
    const availableAreaIds = stopAreas.map((area) => area.id.toString(10));
    const validSelectedIds = activeAreaIds.filter((id) =>
      availableAreaIds.includes(id),
    );

    // If some or all selected areas are no longer available, update the selection
    if (validSelectedIds.length !== activeAreaIds.length) {
      if (validSelectedIds.length > 0) {
        // Keep the valid selections
        setActiveAreaIds(validSelectedIds);
      } else {
        // No valid selections left, select the first available area
        const idString: string | undefined = stopAreas.at(0)?.id.toString(10);
        setActiveAreaIds(idString ? [idString] : null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopAreas]);

  return (
    <>
      <CountAndSortingRow
        className="mb-6"
        resultCount={0}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />
      <StopAreaSelector
        activeAreaIds={activeAreaIds}
        className="mb-6"
        stopAreas={stopAreas}
        setActiveAreaIds={setActiveAreaIds}
      />

      {selectedAreas.map((area) => (
        <StopAreaStopsTable
          key={area.id}
          stopArea={area}
          className="mb-6 last:mb-0"
        />
      ))}
    </>
  );
};
