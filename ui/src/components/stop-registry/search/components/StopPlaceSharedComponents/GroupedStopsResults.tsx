import { DateTime } from 'luxon';
import {
  ComponentType,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PagingInfo } from '../../../../../types';
import { SortingInfo } from '../../types';
import { CountAndSortingRowProps } from '../../types/CountAndSortingRow';
import { StopPlaceSelector } from './StopPlaceSelector';
import { StopsTable } from './StopsTable';
import { FindStopPlaceInfo } from './useFindStopPlaces';

type HeaderComponentProps = {
  readonly stopPlace: FindStopPlaceInfo;
  readonly isRounded: boolean;
};

type NoStopsComponentProps = {
  readonly stopPlace: FindStopPlaceInfo;
};

type SearchGroupedStopsResultsProps = {
  readonly observationDate: DateTime;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
  readonly stopPlaces: ReadonlyArray<FindStopPlaceInfo>;
  readonly CountAndSortingRowComponent: ComponentType<CountAndSortingRowProps>;
  readonly HeaderComponent: ComponentType<HeaderComponentProps>;
  readonly NoStopsComponent: ComponentType<NoStopsComponentProps>;
  readonly translationLabel: string;
};

export const SearchGroupedStopsResults: FC<SearchGroupedStopsResultsProps> = ({
  observationDate,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
  stopPlaces,
  CountAndSortingRowComponent,
  HeaderComponent,
  NoStopsComponent,
  translationLabel,
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
      <CountAndSortingRowComponent
        className="mb-6"
        resultCount={0}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />
      <StopPlaceSelector
        activeStopPlaceIds={activeStopPlaceIds}
        className="mb-6"
        stopPlaces={stopPlaces}
        setActiveStopPlaceIds={setActiveStopPlaceIds}
        translationLabel={translationLabel}
      />

      {selectedStopPlaces.map((stopPlace) => (
        <StopsTable
          className="mb-6 last:mb-0"
          key={stopPlace.id}
          observationDate={observationDate}
          stopPlace={stopPlace}
          HeaderComponent={HeaderComponent}
          NoStopsComponent={NoStopsComponent}
        />
      ))}
    </>
  );
};
