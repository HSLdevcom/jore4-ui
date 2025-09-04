import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PagingInfo } from '../../../../../types';
import { CountAndSortingRow } from '../../for-stop-areas/CountAndSortingRow';
import { TerminalCountAndSortingRow } from '../../for-terminals/TerminalCountAndSortingRow';
import { SortingInfo } from '../../types';
import { StopPlaceSelector } from './StopPlaceSelector';
import { StopsTable } from './StopsTable';
import { FindStopPlaceInfo } from './useFindStopPlaces';

type SearchGroupedStopsResultsProps = {
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
  readonly stopPlaces: ReadonlyArray<FindStopPlaceInfo>;
  readonly isTerminal: boolean;
};

export const SearchGroupedStopsResults: FC<SearchGroupedStopsResultsProps> = ({
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
  stopPlaces,
  isTerminal,
}) => {
  const [activeStopPlaceIds, setActiveStopPlaceIds] =
    useState<ReadonlyArray<string> | null>(
      stopPlaces.at(0) ? [stopPlaces.at(0)?.id.toString(10)] : null,
    );

  const selectedStopPlaces = useMemo(() => {
    return stopPlaces.filter((stopPlace) =>
      activeStopPlaceIds?.includes(stopPlace.id.toString(10)),
    );
  }, [activeStopPlaceIds, stopPlaces]);

  // If stop place list changes, check to see if the selected stop places are still within
  // the results, if not, then select the 1st stop place from the results as active,
  // or null in case there are no results.
  useEffect(() => {
    if (!activeStopPlaceIds || activeStopPlaceIds.length === 0) {
      const idString: string | undefined = stopPlaces.at(0)?.id.toString(10);
      setActiveStopPlaceIds(idString ? [idString] : null);
      return;
    }

    // Check if all currently selected stop places are still in the results
    const availableStopPlaceIds = stopPlaces.map((stopPlace) =>
      stopPlace.id.toString(10),
    );
    const validSelectedIds = activeStopPlaceIds.filter((id) =>
      availableStopPlaceIds.includes(id),
    );

    // If some or all selected stop places are no longer available, update the selection
    if (validSelectedIds.length !== activeStopPlaceIds.length) {
      if (validSelectedIds.length > 0) {
        // Keep the valid selections
        setActiveStopPlaceIds(validSelectedIds);
      } else {
        // No valid selections left, select the first available stop place
        const idString: string | undefined = stopPlaces.at(0)?.id.toString(10);
        setActiveStopPlaceIds(idString ? [idString] : null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopPlaces]);

  return (
    <>
      {isTerminal ? (
        <TerminalCountAndSortingRow
          className="mb-6"
          resultCount={0}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      ) : (
        <CountAndSortingRow
          className="mb-6"
          resultCount={0}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      )}
      <StopPlaceSelector
        activeStopPlaceIds={activeStopPlaceIds}
        className="mb-6"
        stopPlaces={stopPlaces}
        setActiveStopPlaceIds={setActiveStopPlaceIds}
        isTerminal={isTerminal}
      />

      {selectedStopPlaces.map((stopPlace) => (
        <StopsTable
          key={stopPlace.id}
          stopPlace={stopPlace}
          className="mb-6 last:mb-0"
          isTerminal={isTerminal}
        />
      ))}
    </>
  );
};
