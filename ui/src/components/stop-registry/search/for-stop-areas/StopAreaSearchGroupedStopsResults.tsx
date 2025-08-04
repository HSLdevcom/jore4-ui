import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
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
  const [activeAreaId, setActiveAreaId] = useState<string | null>(
    stopAreas.at(0)?.id.toString(10) ?? null,
  );

  const areaToShow = stopAreas.find(
    (area) => area.id.toString(10) === activeAreaId,
  );

  // If stop area list changes, check to see if the selected area is still within
  // the results, if not, then select the 1st area from the results as active,
  // or null in case there are no results.
  useEffect(() => {
    if (
      activeAreaId &&
      stopAreas.some((area) => area.id.toString(10) === activeAreaId)
    ) {
      return;
    }

    setActiveAreaId(stopAreas.at(0)?.id.toString(10) ?? null);
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
        activeStopId={activeAreaId}
        className="mb-6"
        stopAreas={stopAreas}
        setActiveStopId={setActiveAreaId}
      />

      {areaToShow && <StopAreaStopsTable stopArea={areaToShow} />}
    </>
  );
};
