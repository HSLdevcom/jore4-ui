import { StopsDatabaseQuayNewestVersionBoolExp } from '../../../../generated/graphql';
import { PagingInfo } from '../../../../types';
import { SortingInfo } from '../types';
import { useStopSearchResults } from '../utils/useStopSearchResults';
import { FindStopAreaInfo } from './useFindStopAreas';

function stopAreasToStopSearchWhere(
  stopAreas: ReadonlyArray<FindStopAreaInfo>,
): StopsDatabaseQuayNewestVersionBoolExp {
  return {
    stop_place_id: { _in: stopAreas.map((area) => area.id) },
  };
}

export function useStopSearchByStopAreasResults(
  stopAreas: ReadonlyArray<FindStopAreaInfo>,
  sortingInfo: SortingInfo,
  pagingInfo: PagingInfo,
) {
  return useStopSearchResults({
    where: stopAreasToStopSearchWhere(stopAreas),
    skip: stopAreas.length === 0,
    sortingInfo,
    pagingInfo,
  });
}
